import Ember from 'ember';

export default Ember.Route.extend({
  model(params){
    return this.store.findRecord('user', params.id);
  },
  actions: {
    updateUser() {
      this.get('currentModel').save();
    },
    reload(id) {
      this.store.forceFetchRecord('user', id);
    }
  }
});
