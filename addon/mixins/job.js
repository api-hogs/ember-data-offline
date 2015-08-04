/**
  @module ember-data-offline
*/
import Ember from 'ember';
const { computed, RSVP } = Ember;

/**
Base class for creating jobs.

{Job} is an abstract class and is not meant to be used directly. The following classes extend {Job}.

{Localforage}
{Rest}

@class Job
@constructor
**/
export default Ember.Mixin.create({
  /**
  The number of retry attempts.
  @property retryCount
  @type {Number}
  **/
  retryCount: 0,

  /**
  Shows if there are retry attempts.
  @property needRetry
  @type {boolean}
  **/
  needRetry: computed.gt('retryCount', 0),

  /**

  @method task
  **/
  task() {
    return true;
  },

  /**
  Called by the Queue to perform the job.
  @method perform
  @return {Ember.Promise}
  **/
  perform() {
    return RSVP.Promise.resolve().then(() => {
      return this.task();
    });
  },
});
