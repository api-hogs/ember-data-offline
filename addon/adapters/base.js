/**
@module ember-data-offline
**/
import DS from 'ember-data';
import Ember from 'ember';
import offlineMixin from 'ember-data-offline/mixins/offline';
import onlineMixin from 'ember-data-offline/mixins/online';
import LFAdapter from 'ember-localforage-adapter/adapters/localforage';
import LFSerializer from 'ember-localforage-adapter/serializers/localforage';
import isObjectEmpty from 'ember-data-offline/utils/is-object-empty';
/**
This is an example of usage of Online and Offline mixins.
It simplifies setup proccess.  By default it use RESTAdapter and LocalForageAdapter,
but you can use your own adapters that you like.

@class BaseAdapter
@extends DS.RESTAdapter
@uses onlineMixin
**/
export default DS.RESTAdapter.extend(onlineMixin, {
  __adapterName__: "ONLINE",
  offlineAdapter: null,

  initRunner: Ember.on('init', function() {

    let adapter = this;
    let container = this.container;

    let serializer = LFSerializer.extend({
      serialize(snapshot, options) {
        let json = this._super.apply(this, arguments);
        let store = snapshot.record.store;
        let modelSerializer = store.serializerFor(snapshot._internalModel.modelName);
        let primaryKey = 'id';
        if (modelSerializer) {
          primaryKey = modelSerializer.primaryKey;
          let serialized = modelSerializer.serialize(snapshot, options);
          json = Ember.merge(json, serialized);
        }
        if (snapshot.get('__data_offline_meta__')) {
          json['__data_offline_meta__'] = snapshot.get('__data_offline_meta__');
        }
        if (primaryKey !== 'id') {
          json.id = json[primaryKey];
        }
        snapshot.eachRelationship((name, relationship) => {
          if (relationship.kind === 'hasMany' && Ember.isEmpty(json[name])) {
            json[name] = [];
          }
        });
        return json;
      },
      extractMeta: function(store, modelClass, payload) {
        let meta = store.metadataFor(modelClass);
        if (isObjectEmpty(meta)) {
          meta = {};
          meta['__data_offline_meta__'] = {};
        }
        if (Ember.isArray(payload)) {
          payload.forEach(_payload => {
            meta['__data_offline_meta__'][_payload[store.serializerFor(modelClass).primaryKey]] = _payload['__data_offline_meta__'];
          });
        } else {
          meta['__data_offline_meta__'][payload[store.serializerFor(modelClass).primaryKey]] = payload['__data_offline_meta__'];
        }
        store.setMetadataFor(modelClass, meta);
      },
    }).create({
      container: container,
    });
    let serializerPrimaryKey = this.get('serializerPrimaryKey');
    if (serializerPrimaryKey) {
      serializer.set('primaryKey', serializerPrimaryKey);
    }
    let defaults = {
      __adapterName__: "OFFLINE",
      onlineAdapter: adapter,
      container: container,
      serializer: serializer,
      caching: 'none',
      namespace: 'ember-data-offline:store',
    };
    if (adapter.offlineNamespace) {
      defaults.namespace = adapter.offlineNamespace;
    }
    let offlineAdapter = LFAdapter.extend(offlineMixin).create(defaults);

    this.set('offlineAdapter', offlineAdapter);
  }),
});
