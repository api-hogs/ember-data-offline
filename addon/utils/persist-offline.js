import Ember from 'ember';

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
  fromStore.forEach(record => {
    let snapshot = record._createSnapshot();
    adapter.createRecord(store, typeClass, snapshot, true);
  });
};

var persistMany = function persistMany(adapter, store, typeClass, ids) {
  let fromStore = store.peekAll(typeClass.modelName);
  if (Ember.isEmpty(fromStore)) {
    return;
  }
  let records = fromStore.forEach(record => {
    if (ids.indexOf(record.id) > -1) {
      let snapshot = record._createSnapshot();
      adapter.createRecord(store, typeClass, snapshot, true);
    } 
  });
};

export { persistOne, persistAll };

export default function persistOffline(adapter, store, typeClass, onlineResp, method) {
  if (Ember.isEmpty(onlineResp)) {
    return;
  }
  if (method === 'find') {
    persistOne(adapter, store, typeClass, onlineResp);
  } else if (method === 'findMany') {
    persistMany(adapter, store, typeClass, onlineResp);
  } else {
    persistAll(adapter, store, typeClass);
  }
}
