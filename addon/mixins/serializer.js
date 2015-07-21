import Ember from 'ember';

export default Ember.Mixin.create({
  serialize(snapshot) {
    let json = this._super.apply(this, arguments);
    if (snapshot.get('__data_offline_meta__')) {
      json['__data_offline_meta__'] = snapshot.get('__data_offline_meta__');
    }
        console.log('OOOOOOOOOOOOO', snapshot.modelName, snapshot)
    return json;
  },

});
