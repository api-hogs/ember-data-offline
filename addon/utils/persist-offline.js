import Ember from 'ember';
import { extractTargetRecordFromPayload  }from 'ember-data-offline/utils/extract-online';

var persistOne = function persistOne(adapter, store, typeClass, onlineRecord) {
  let modelName = typeClass.modelName;
  let rec = extractTargetRecordFromPayload(store, typeClass, onlineRecord);
  if (Ember.isEmpty(rec)) {
    return;
  }
  let recordFromStore = store.peekRecord(modelName, rec.id);
  if (Ember.isEmpty(recordFromStore)) {
    return;
  }
  let snapshot = recordFromStore._createSnapshot();
  return adapter.createRecord(store, typeClass, snapshot, true);
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
