import Ember from 'ember';
const { RSVP } = Ember;

var goOffline = function goOffline() {
  return new RSVP.Promise(resolve => {
    window.navigator.__defineGetter__('onLine', function () { return false; });
    $(window).trigger('offline');
    resolve();
  });
};
var goOnline = function goOnline() {
  delete window.navigator.onLine; 
  $(window).trigger('online');
};

export { goOnline, goOffline };
