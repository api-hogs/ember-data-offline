var eraseOne = function(adapter, store, type, snapshot) {
  let recordToDelete = store.peekRecord(type.modelName, snapshot.id);
  store.deleteRecord(recordToDelete);
  adapter.deleteRecord(store, type, snapshot, true);
};

export { eraseOne };
export default eraseOne;
