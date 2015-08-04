import Ember from 'ember';

export default Ember.Route.extend({
  model() {
      this.store.findAll('city');
      return this.store.findAll('user');
    },

    actions: {
      createUser() {
        let newUser = this.store.createRecord('user', {
          firstName: "Igor",
          lastName: "K",
          gender: "male"
        });
        newUser.save().then(result => {
          console.log("saved!", result);
        });
      },
      updateFirst() {
        let url = '/update_users';
        let data = {
          firstName: 'Aaron'
        };
        this.EDORequest.exec(url, 'PUT', data, () => {
          this.set('currentModel.firstObject.firstName', 'Aaron');
          this.get('currentModel.firstObject').save();
        });
      },
      deleteUser(user) {
        user.destroyRecord();
      },
    },
});
