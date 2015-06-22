import DS from 'ember-data';
import Ember from 'ember';
import offlineMixin from 'ember-data-offline/mixins/offline';
import onlineMixin from 'ember-data-offline/mixins/online';
import LFAdapter from 'ember-localforage-adapter/adapters/localforage';
import LFSerializer from 'ember-localforage-adapter/serializers/localforage';

var localAdapter = LFAdapter.extend({
  namespace: 'ember-data-offline:store',
});

export default DS.RESTAdapter.extend(onlineMixin, {
  offlineAdapter: Ember.computed(function() {
    let adapter = this;
    let serializer = LFSerializer.extend({
      extractArray(store, type, payload) {
        var serializer = this;

        if (Ember.isEmpty(payload)) {
          return [];
        }

        return payload.map(function (record) {
          return serializer.extractSingle(store, type, record);
        });
      },
    }).create({
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
      caching: 'none'
    };
    if (adapter.offlineNamespace) {
      defaults.namespace = adapter.offlineNamespace;
    }
    return localAdapter.extend(offlineMixin, {
    }).create(defaults);
  }),
});
