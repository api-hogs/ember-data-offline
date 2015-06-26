import Ember from 'ember';

export default Ember.Mixin.create({
  serialize() {
    let json = this._super.apply(this, arguments);
    if (json._id) {
      json.id = json._id;
    }
    return json;
  },
});
