import baseAdapter from 'ember-data-offline/adapters/base';

export default baseAdapter.extend({
  offlineNamespace: 'foo',
  serializerPrimaryKey: '_id',
});
