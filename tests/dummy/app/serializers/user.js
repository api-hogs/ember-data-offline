import DS from 'ember-data';

export default DS.RESTSerializer.extend({
  primaryKey: '_id',
  modelNameFromPayloadKey: function(payloadKey) {
    if (payloadKey === 'dummy_users' || payloadKey === 'dummy_user') {
      return this._super('user');
    } else {
      return this._super(payloadKey);
    }
  },
});
