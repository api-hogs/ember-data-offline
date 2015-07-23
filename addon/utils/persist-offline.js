import Ember from 'ember';
import extractTargetRecordFromPayload from 'ember-data-offline/utils/extract-online';
import { updateMeta } from 'ember-data-offline/utils/meta';

var persistOne = function persistOne(adapter, store, typeClass, id) {
  let modelName = typeClass.modelName;
  let recordFromStore = store.peekRecord(modelName, id);
  if (Ember.isEmpty(recordFromStore)) {
    return;
  }
  let snapshot = recordFromStore._createSnapshot();
  
  return adapter.createRecord(store, typeClass, snapshot, true);
};

var persistAll = function persistAll(adapter, store, typeClass) {
  let fromStore = store.peekAll(typeClass.modelName).toArray();
  if (Ember.isEmpty(fromStore)) {
    return;
  }
  adapter._namespaceForType(typeClass).then(namespace => {
    var serializer = store.adapterFor(typeClass.modelName).serializer;

    for (var i = 0, len = fromStore.length; i !== len; i++) {
      let snapshot = fromStore[i]._createSnapshot();
      updateMeta(snapshot);
      let recordHash = serializer.serialize(snapshot, {includeId: true});

      namespace.records[recordHash.id] = recordHash;
    }
    namespace["__data_offline_meta__"] = {
      fetchedAt: new Date().toString()
    };
    adapter.persistData(typeClass, namespace);
  });
};

var persistMany = function persistMany(adapter, store, typeClass, ids) {
  let fromStore = store.peekAll(typeClass.modelName);
  if (Ember.isEmpty(fromStore)) {
    return;
  }
  fromStore.forEach(record => {
    if (ids.indexOf(record.id) > -1) {
      let snapshot = record._createSnapshot();
      adapter.createRecord(store, typeClass, snapshot, true);
    } 
  });
};

var persistQuery = function persistQuery(adapter, store, typeClass, onlineResp) {
  let fromStore = store.peekAll(typeClass.modelName);
  if (Ember.isEmpty(fromStore)) {
    return;
  }
  let onlineIds = extractTargetRecordFromPayload(onlineResp).map(record => record.id);
  fromStore.forEach(record => {
    if (onlineIds.indexOf(record.id) > -1) {
      let snapshot = record._createSnapshot();
      adapter.createRecord(store, typeClass, snapshot, true);
    } 
  });
};

export { persistOne, persistAll, persistMany, persistQuery };

export default function persistOffline(adapter, store, typeClass, onlineResp, method) {
  if (method === 'find') {
    persistOne(adapter, store, typeClass, onlineResp);
  } else if (method === 'findMany') {
    persistMany(adapter, store, typeClass, onlineResp);
  } else if (method === 'findQuery') {
    persistQuery(adapter, store, typeClass, onlineResp);
  } else {
    persistAll(adapter, store, typeClass);
  }
}
