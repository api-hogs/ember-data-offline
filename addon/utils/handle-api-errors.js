import Ember from 'ember';

export default function(err) {
  //TODO: 422 behavior
  return new Ember.RSVP.Promise((resolve, reject) => {
    if (err && !Ember.isEmpty(err.errors)) {
      if (err.errors[0].status === "408") {
        return reject();
      }
    }
    resolve();
  });
}
