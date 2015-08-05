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

export { eraseOne };
export default eraseOne;
