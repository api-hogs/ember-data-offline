import DS from 'ember-data';
import offlineIdMixin from 'ember-data-offline/mixins/localstorage-id';

export default DS.RESTSerializer.extend(offlineIdMixin, {
  primaryKey: '_id',
});
