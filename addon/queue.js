import Ember from 'ember';

export default Ember.Object.extend({
  name: 'normal',
  retryOnFailureDelay: 10000,
  delay: 5000,
  pendingJobs: [],
  faltureJobs: [],
  retryJobs: [],

  init: function(){
    return this._super();
  },

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
      this.get('pendingJobs').removeObject(job);
      job.perform().then(() => {
        this.get('retryJobs').removeObject(job);
      }, ()=>{
        if (job.get('needRetry')){
          job.decrementProperty('retryCount');
          this.get('retryJobs').pushObject(job);
          Ember.run.later(() => {
            this.perform();
          }, this.get('retryOnFailureDelay'));
        }
        else{
          this.get('retryJobs').removeObject(job);
          this.get('faltureJobs').pushObject(job);
        }
      });
  }
});
