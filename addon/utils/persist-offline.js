import Ember from 'ember';
import extractTargetRecordFromPayload from 'ember-data-offline/utils/extract-online';

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
  let fromStore = store.peekAll(typeClass.modelName);
  if (Ember.isEmpty(fromStore)) {
    return;
  }
  let promises = fromStore.map(record => {
    let snapshot = record._createSnapshot();
    return adapter.createRecord(store, typeClass, snapshot, true);
  });
  Ember.RSVP.all(promises).then(() => {
    adapter._namespaceForType(typeClass).then(namespace => {
      namespace["__data_offline_meta__"] = {
        fetchedAt: new Date().toString()
      };
      adapter.persistData(typeClass, namespace);
    });
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
