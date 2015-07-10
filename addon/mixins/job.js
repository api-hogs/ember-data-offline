import Ember from 'ember';
const { computed, RSVP } = Ember;

export default Ember.Mixin.create({
  retryCount: 0,

  needRetry: computed.gt('retryCount', 0),

  task() {
    return true;
  },
  fail() {
    return true;
  },
  prevent(err) {
    return RSVP.Promise.resolve().then(() => {
      return this.fail(err);
    });
  },
  perform() {
    return RSVP.Promise.resolve().then(() => {
      return this.task();
    });
  },
});
