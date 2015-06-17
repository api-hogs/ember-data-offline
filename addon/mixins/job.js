import Ember from 'ember';
const { computed, RSVP } = Ember;

export default Ember.Mixin.create({
  retryCount: 0,

  needRetry: computed.gt('retryCount', 0),

  task() {
    return true;
  },
  perform() {
    //guard
    return RSVP.Promise.resolve().then(() => {
      return this.task();
    }).catch(err => {
      console.log('Error was occurred')
    });
  },
});
