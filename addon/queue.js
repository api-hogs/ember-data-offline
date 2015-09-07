/**
  @module ember-data-offline
*/
import Ember from 'ember';
/**
A queue of syncronization jobs.

@class Queue
@constructor
@extends Ember.Object
**/
export default Ember.Object.extend({
  /**
  @property name
  @type {String}
  **/
  name: 'normal',
  /**
  Interval between job retries.
  @property retryOnFailureDelay
  @type {Number}
  **/
  retryOnFailureDelay: 5000,
  /**
  Job execution delay.
  @property delay
  @type {Number}
  **/
  delay: 500,
  /**
  Number of workers in a queue.
  @property workers
  @type {Number}
  **/
  workers: 5,
  /**
  An array of active jobs in a queue.
  @property activeJobs
  @type {Ember.Array}
  **/
  activeJobs: null,
  /**
  An array of pending jobs in a queue.
  @property pendingJobs
  @type {Ember.Array}
  **/
  pendingJobs: null,
  /**
  An array of failed jobs in a queue.
  @property failureJobs
  @type {Ember.Array}
  **/
  failureJobs: null,
  /**
  An array of retried jobs in a queue.
  @property retryJobs
  @type {Ember.Array}
  **/
  retryJobs: null,
  /**
  An array of on-demand jobs.
  @property onDemandJobs
  @type {Ember.Object}
  **/
  onDemandJobs: null,

  init: function() {
    this.setProperties({
      activeJobs: Ember.A(),
      pendingJobs: Ember.A(),
      failureJobs: Ember.A(),
      retryJobs: Ember.A(),
      onDemandJobs: Ember.Object.create(),
    });
    this._super.apply(this, arguments);
  },

  /**
  @method runJob
  @param Job {Job}
  **/
  runJob(job) {
    //TODO Think about to build in queue in ember(ed) runloop
    this.get('activeJobs').pushObject(job);
    let delay = job.get('adapter.throttle') || job.get('delay') || this.get('delay');
    Ember.run.later(() => {
      this.process(job);
    }, delay);
  },
  /**
  Checks if the job exists in a queue.
  @method isJobExist
  @param Job {Job}
  @return {boolean}
  **/
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
      let job = this.get('pendingJobs').shift();
      if (job) {
        this.runJob(job);
      }
    }
  }),

  /**
  Adds a job to the queue. If 'onDemandKey' param was passed, the job will be processed on demand.

  @method add
  @param Job {Job}  job to add
  @param onDemandKey {String}
  @return {Job} the passed Job
  **/
  add: function(job, onDemandKey) {
    if (!Ember.isEmpty(onDemandKey)) {
      return this.set(`onDemandJobs.${onDemandKey}`, job);
    }
    if (!this.isJobExist(job)) {
      return this.get('pendingJobs').pushObject(job);
    }
  },

  /**
  Removes the job from the queue.

  @method remove
  @param Job {Job}  job to remove
  **/
  remove: function(job) {
    this.get('pendingJobs').removeObject(job);
  },

  /**
  Performs the job. After successful processing removes the job from lists of active and retried jobs.
  If a job fails, it will be automatically retried with a delay, until it succeeds or runs out of retries.

  @method process
  @param Job {Job} job to process
  **/
  process: function(job) {
    let queue = this;
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
        }, job.get('retryDelay') || queue.get('retryOnFailureDelay'));
      } else {
        queue.get('retryJobs').removeObject(job);
        queue.get('failureJobs').pushObject(job);
      }
    });
  }
});
