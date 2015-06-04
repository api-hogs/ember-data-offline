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
    
  // currentJob: Ember.computed.alias('pendingJobs.l')

  add: function(job){
    this.get('pendingJobs').pushObject(job);
    Ember.run.later(() => {
      this.process(job);
    }, this.get('delay'));
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

        if (job.get('needRetry') && job.get('retryCount') > 0){
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
