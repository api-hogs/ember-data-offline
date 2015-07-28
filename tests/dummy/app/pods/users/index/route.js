import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    this.store.findAll('city');
    return this.store.findAll('user');
  },

  actions: {
    createUser(){
      let newUser = this.store.createRecord('user', {
        firstName: "Igor",
        lastName: "K",
        gender: "male"
      });
      newUser.save().then(result => {
        console.log("saved!", result);
      });
    },
    deleteUser(user){
      user.destroyRecord();
    },
  },
});
