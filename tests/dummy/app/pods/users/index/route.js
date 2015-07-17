import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    return this.store.findAll('user');
  },

  actions: {
    // goOnline(){
    //   window.navigator.__defineGetter__('onLine', function() {
    //     return true;
    //   });
    //   $(window).trigger('online');
    //   this.set('controller.status', 'Online');
    // },
    // goOffline(){
    //   window.navigator.__defineGetter__('onLine', function() {
    //     return false;
    //   });
    //   $(window).trigger('offline');
    //   this.set('controller.status', 'Offline');
    //   this.store.unloadAll('user');
    // },
    // findFromLocal() {
    //   this.store.find('user', {});
    // },
    createUser(){
      let newUser = this.store.createRecord('user', {
        firstName: "Igor",
        lastName: "K",
        gender: "male"
      });
      newUser.save();
    },
  },
});
