/**
!! This is not a class. It's a ES6 module.
@module utils
@class HandleApiErrors
**/
import Ember from 'ember';

/**
Handles the server response errors. If there is  a request timeout it tries to do request again by passing rejected promise.
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
