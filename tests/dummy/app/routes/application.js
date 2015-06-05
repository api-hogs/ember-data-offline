import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    return this.store.find('user');
  },
  actions: {
    goOnline(){
      window.navigator.__defineGetter__('onLine', function() {
        return true;
      });
      $(window).trigger('online');
      this.set('controller.status', 'Online');
    },
    goOffline(){
      window.navigator.__defineGetter__('onLine', function() {
        return false;
      });
      $(window).trigger('offline');
      this.set('controller.status', 'Offline');
    },
  },
  setupController: function(controller, model) {
    controller.set('status', 'Online');
    this._super(controller, model);
  },
});

