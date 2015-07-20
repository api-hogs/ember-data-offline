import DS from 'ember-data';
import Ember from 'ember';
import offlineMixin from 'ember-data-offline/mixins/offline';
import onlineMixin from 'ember-data-offline/mixins/online';
import LFAdapter from 'ember-localforage-adapter/adapters/localforage';
import LFSerializer from 'ember-localforage-adapter/serializers/localforage';

export default DS.RESTAdapter.extend(onlineMixin, {
  __adapterName__: "ONLINE",
  offlineAdapter: Ember.computed(function() {
    let adapter = this;
    let serializer = LFSerializer.extend({
      serialize(snapshot) {
        let json = this._super.apply(this, arguments);
        if (snapshot['__data_offline_meta__']) {
          json['__data_offline_meta__'] = snapshot['__data_offline_meta__'];
        }
        return json;
      }
    }).create({
      container: this.container,
    });
    let serializerPrimaryKey = this.get('serializerPrimaryKey');
    if (serializerPrimaryKey) {
     serializer.set('primaryKey', serializerPrimaryKey); 
    }
    let defaults = {
      __adapterName__: "OFFLINE",
      onlineAdapter: adapter,
      container: this.container,
      serializer: serializer,
      caching: 'none',
      namespace: 'ember-data-offline:store',
    };
    if (adapter.offlineNamespace) {
      defaults.namespace = adapter.offlineNamespace;
    }
    return LFAdapter.extend(offlineMixin, {
    }).create(defaults);
  }),
});
