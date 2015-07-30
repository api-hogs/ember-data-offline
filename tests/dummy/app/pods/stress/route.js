import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    return Ember.RSVP.hash({
      city: this.store.findAll('city'),
      user: this.store.findAll('user'),
      car: this.store.findAll('car'),
      company: this.store.findAll('company'),
      office: this.store.findAll('office'),
    });
  },
});
