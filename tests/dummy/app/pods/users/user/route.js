import Ember from 'ember';

export default Ember.Route.extend({
  model(params){
    console.log("NCCCCCCCNCN")
    return this.store.findRecord('user', params.id);
  },
});
