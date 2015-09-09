/**
@module utils
@class EraseOne
**/

/**
Erases the given record (snapshot) from store.

@method eraseOne
@param adapter {DS.Adapter}
@param store {DS.Store}
@param type {DS.Model}
@param snapshot {DS.Snapshot}
**/
var eraseOne = function(adapter, store, type, snapshot) {
  let recordToDelete = store.peekRecord(type.modelName, snapshot.id);
  store.deleteRecord(recordToDelete);
  adapter.deleteRecord(store, type, snapshot, true);
};
var eraseAll = function(adapter, store, type) {
  store.unloadAll(type.modelName);
  adapter.queue.attach((resolve, reject) => {
    adapter._namespaceForType(typeClass).then(namespace => {
      adapter.persistData(typeClass, []).then(() => {
        resolve();
      }, (err) => {
        reject(err);
      });
    }, (err) => {
      reject(err);
    });
  });
};

export { eraseOne, eraseAll };
export default eraseOne;
