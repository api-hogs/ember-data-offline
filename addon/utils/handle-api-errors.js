import Ember from 'ember';

export default function(callback) {
  //TODO: 422 behavior
  return function(err) {
    if (err && !Ember.isEmpty(err.errors)) {
      if (err.errors[0].status === "408") {
        return Ember.RSVP.resolve();
      }
      else {
        callback();
        return Ember.RSVP.reject();
      }
    }
  };
}
