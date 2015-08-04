import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    goOnline() {
      window.navigator.__defineGetter__('onLine', function() {
        return true;
      });
      $(window).trigger('online');
      this.set('controller.isOffline', false);
    },
    goOffline() {
      window.navigator.__defineGetter__('onLine', function() {
        return false;
      });
      $(window).trigger('offline');
      this.set('controller.isOffline', true);
    },
    toggleOffline() {
      if (this.get('controller.isOffline')) {
        this.send('goOnline');
      }
      else {
        this.send('goOffline');
      }
    }
  }
});
