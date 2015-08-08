/**
@module utils
@class HandleApiErrors
**/
import Ember from 'ember';

/**
Handles server response errors.
@method
@param callback {function}
@return promise {Promise}
**/
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
