/**
  @module mixins
*/
import Ember from 'ember';
const { computed, RSVP } = Ember;

/**
An abstract job.

Examples:
{{#crossLink "Localforage"}}{{/crossLink}}
{{#crossLink "Rest"}}{{/crossLink}}

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
  Shows if there are retry attempts left.
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
  Called to perform the job.
  @method perform
  @return {Ember.Promise}
  **/
  perform() {
    return RSVP.Promise.resolve().then(() => {
      return this.task();
    });
  },
});
