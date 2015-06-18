import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    return Ember.RSVP.hash({
      users: this.store.find('user'),
      cars: this.store.find('car')
    });
    // return this.store.find('user');
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
      this.store.unloadAll('user');
    },
    findFromLocal() {
      this.store.find('user', {});
    },
    createUser(){
      let newUser = this.store.createRecord('user', {
        firstName: "igor",
      });
      newUser.save().then(() => {
        this.set('controller.username', null);
      });
    },
  },
  setupController: function(controller, model) {
    controller.set('status', 'Online');
    this._super(controller, model);
  },
});

