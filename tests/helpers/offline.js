import Ember from 'ember';
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

export { goOnline, goOffline };
