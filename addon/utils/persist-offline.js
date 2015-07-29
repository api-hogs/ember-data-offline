import Ember from 'ember';
import extractTargetRecordFromPayload from 'ember-data-offline/utils/extract-online';
import { updateMeta } from 'ember-data-offline/utils/meta';

var _persistArray = function(array, adapter, typeClass, withMeta) {
  let serializer = adapter.serializer;
  adapter.queue.attach((resolve, reject) => {
    adapter._namespaceForType(typeClass).then(namespace => {
      if (!Ember.isEmpty(array)) {
        for (var i = 0, len = array.length; i !== len; i++) {
          let snapshot = array[i]._createSnapshot();
          updateMeta(snapshot);

          let recordHash = serializer.serialize(snapshot, {includeId: true});
          namespace.records[recordHash.id] = recordHash;
        }
      }
      if (withMeta) {
        namespace["__data_offline_meta__"] = {
          fetchedAt: new Date().toString()
        };
      }
      adapter.persistData(typeClass, namespace).then(() => {
        resolve();
      }, (err) => {
        reject(err);
      });
    }, (err) => {
      reject(err);
    });
  });
};

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
  _persistArray(fromStore, adapter, typeClass, true);
};

var persistMany = function persistMany(adapter, store, typeClass) {
  //While we using findAll instead of findMany we better use this for persistance
  let fromStore = store.peekAll(typeClass.modelName).toArray();
  _persistArray(fromStore, adapter, typeClass);
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
