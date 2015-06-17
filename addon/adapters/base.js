import DS from 'ember-data';
import Ember from 'ember';
import offlineMixin from 'ember-data-offline/mixins/offline';
import onlineMixin from 'ember-data-offline/mixins/online';

var localAdapter = DS.LSAdapter.extend({
  namespace: 'ember-data-offline:store',
});

export default DS.RESTAdapter.extend(onlineMixin, {
  offlineAdapter: Ember.computed(function() {
    let adapter = this;
    let serializer = DS.LSSerializer.extend().create({
      container: this.container,
    });
    let serializerPrimaryKey = this.get('serializerPrimaryKey');
    if (serializerPrimaryKey) {
     serializer.set('primaryKey', serializerPrimaryKey); 
    }
    let defaults = {
      onlineAdapter: adapter,
      container: this.container,
      serializer: serializer,
    };
    if (adapter.offlineNamespace) {
      defaults.namespace = adapter.offlineNamespace;
    }
    return localAdapter.extend(offlineMixin, {

    }).create(defaults);
  }),
});
