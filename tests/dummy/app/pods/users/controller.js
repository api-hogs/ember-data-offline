import Ember from 'ember';

export default Ember.Controller.extend({
  isUserSyncLoad: Ember.computed.equal('store.syncLoads.findAll.user', true),
});

