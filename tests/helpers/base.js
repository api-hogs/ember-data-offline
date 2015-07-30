import Ember from 'ember';
import moment from 'moment';

const { RSVP } = Ember;

(function(global) {
  let fakeNavigator = {};
  for (let i in global.navigator) {
    fakeNavigator[i] = global.navigator[i];
  }
  global.navigator = fakeNavigator;
}(window));

var goOffline = function goOffline() {
  return new RSVP.Promise(resolve => {
    window.navigator.__defineGetter__('onLine', function() {
      return false;
    });
    $(window).trigger('offline');
    resolve();
  });
};

var goOnline = function goOnline() {
  window.navigator.__defineGetter__('onLine', function() {
    return true;
  });
  $(window).trigger('online');
};

var getStoreMock = function() {
  return Ember.Object.create({
    lookupAdapter() {
      return Ember.Object.create({
        recordTTL : moment.duration(12, 'hours')
      });
    },
    serializerFor(){
      return {
        primaryKey: 'id',
        normalizePayload(payload) {
          return payload;
        },
        modelNameFromPayloadKey(key) {
          return key;
        }
      };
    }
  });
};

var getQueueMock = function(assert, encapsulatedIn) {
  return Ember.Object.create({
    _assert: assert,
    _encapsulatedIn: encapsulatedIn,
    add() {
      this.get('_assert').ok(true, 'queue.add was invoked @' + this.get('_encapsulatedIn'));
    }
  });
};

export {goOnline, goOffline, getStoreMock, getQueueMock};
