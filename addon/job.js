import Ember from 'ember';
const { computed, RSVP } = Ember;

export default Ember.Object.extend({
  needRetry: computed.gt('retryCount', 0),
  retryCount: 0,
  task: function() {
    return true;
  },
  perform() {
    return RSVP.Promise.resolve().then(() => {
      return this.task();
    });
  },
});
