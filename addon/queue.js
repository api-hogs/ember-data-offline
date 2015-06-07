import Ember from 'ember';

export default Ember.Object.extend({
  name: 'normal',
  retryOnFailureDelay: 10000,
  delay: 5000,
  pendingJobs: Ember.A(),
  faltureJobs: Ember.A(),
  retryJobs: Ember.A(),

  init: function(){
    return this._super();
  },

  runJob(job){
    Ember.run.later(() => {
      this.process(job);
    }, this.get('delay'));
  },

  isJobExist(job){
    let pendingJob = this.get('pendingJobs').find((item) => {
      return item.get('adapter') === job.get('adapter') && item.get('method') === job.get('method');
    });
    let retryJob =  this.get('retryJobs').find((item) => {
      return item.get('adapter') === job.get('adapter') && item.get('method') === job.get('method');
    });
    return pendingJob || retryJob;
  },

  add: function(job){
    if (!this.isJobExist(job)){
      this.get('pendingJobs').pushObject(job);
      this.runJob(job);
    }
  },

  remove: function(job){
    this.get('pendingJobs').removeObject(job);
  },

  process: function(job){
      let queue = this;
      this.get('pendingJobs').removeObject(job);
      job.perform().then(() => {
        this.get('retryJobs').removeObject(job);
      }, () => {

        if (job.get('needRetry')){
          job.decrementProperty('retryCount');
          queue.get('retryJobs').pushObject(job);
          Ember.run.later(() => {

            queue.process(job);
          }, queue.get('retryOnFailureDelay'));
        }
        else{
          queue.get('retryJobs').removeObject(job);
          queue.get('faltureJobs').pushObject(job);
        }
      });
  }
});
