import DS from 'ember-data';
import offlineIdMixin from 'ember-data-offline/mixins/localstorage-id';

export default DS.RESTSerializer.extend(offlineIdMixin, {
  primaryKey: '_id',
  modelNameFromPayloadKey: function(payloadKey) {
    if (payloadKey === 'dummy_users' || payloadKey === 'dummy_user') {
      return this._super('user');
    } else {
      return this._super(payloadKey);
    }
  },
});
