import Ember from 'ember';

export default function(err, handler) {
  //TODO: 422 behavior
  if (err && !Ember.isEmpty(err.errors)) {
    if (err.errors[0].status === "408") {
      return Ember.RSVP.reject();
    }
  }
  handler();
  return null;
}
