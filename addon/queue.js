import Ember from 'ember';

export default Ember.Object.extend({
  name: 'normal',
  retryOnFailureDelay: 10000,
  delay: 5000,
  workers: 5,
  activeJobs: null,
  pendingJobs: null,
  faltureJobs: null,
  retryJobs: null,

  init: function() {
    this.setProperties({
      activeJobs: Ember.A(),
      pendingJobs: Ember.A(),
      faltureJobs: Ember.A(),
      retryJobs: Ember.A(),
    });
    this._super.apply(this, arguments);
  },

  runJob(job) {
    this.get('activeJobs').pushObject(job);
    Ember.run.later(() => {
      this.process(job);
    }, this.get('delay'));
  },

  isJobExist(job) {
    let pendingJob = this.get('pendingJobs').find((item) => {
      return item.get('adapter') === job.get('adapter') && item.get('method') === job.get('method');
    });
    let retryJob = this.get('retryJobs').find((item) => {
      return item.get('adapter') === job.get('adapter') && item.get('method') === job.get('method');
    });
    return pendingJob || retryJob;
  },

  pendingJobObserver: Ember.observer('pendingJobs.[]','activeJobs.[]', function() {
    if (this.get('pendingJobs.length') <= 0) {
      return;
    }
    if (this.get('activeJobs').length < this.get('workers')) {
      let job = this.get('pendingJobs').pop();
      if (job) {
        this.runJob(job);
      }
    }
  }),

  add: function(job) {
    if (!this.isJobExist(job)) {
      this.get('pendingJobs').pushObject(job);
    }
  },

  remove: function(job) {
    this.get('pendingJobs').removeObject(job);
  },

  process: function(job) {
    let queue = this;
    console.log("DBDBBDBDB", job)
    job.perform().then(() => {
      this.get('activeJobs').removeObject(job);
      this.get('retryJobs').removeObject(job);
    }, () => {
      this.get('activeJobs').removeObject(job);
      queue.get('retryJobs').removeObject(job);

      if (job.get('needRetry')) {
        job.decrementProperty('retryCount');
        queue.get('retryJobs').pushObject(job);
        Ember.run.later(() => {
          queue.process(job);
        }, queue.get('retryOnFailureDelay'));
      } else {
        queue.get('retryJobs').removeObject(job);
        queue.get('faltureJobs').pushObject(job);
      }
    });
  }
});
