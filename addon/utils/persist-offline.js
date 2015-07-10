import Ember from 'ember';

var persistOne = function persistOne(adapter, store, typeClass, onlineRecord) {
  let fromStore = store.peekAll(typeClass.modelName);
  if (Ember.isEmpty(fromStore)) {
    return;
  }
  let recordFromStore = fromStore.find(record => {
    if (record && record.id) {
      return record.id === onlineRecord[typeClass.modelName].id;
    }
  });
  if (recordFromStore) {
    let snapshot = recordFromStore._createSnapshot();
    return adapter.createRecord(store, typeClass, snapshot, true);
  }
};

var persistMany = function persistMany(adapter, store, typeClass) {
  let fromStore = store.peekAll(typeClass.modelName);
  if (Ember.isEmpty(fromStore)) {
    return;
  }
  fromStore.forEach(record => {
    let snapshot = record._createSnapshot();
    adapter.createRecord(store, typeClass, snapshot, true);
  });
};

export { persistOne, persistMany };

export default function persistOffline(adapter, store, typeClass, onlineResp, method) {
  if (Ember.isEmpty(onlineResp)) {
    return;
  }
  if (method === 'find') {
    persistOne(adapter, store, typeClass, onlineResp);
  } else {
    persistMany(adapter, store, typeClass);
  }
}
