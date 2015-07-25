import Ember from 'ember';

var addMeta = function addMeta(snapshot, infoToAdd) {
  //TODO add store meta changing here too
  snapshot.record.set('__data_offline_meta__', Ember.merge(snapshot.record.get('__data_offline_meta__') || {}, infoToAdd));
};

var addUpdatedAtToMeta = function addUpdatedAtToMeta(snapshot) {
  addMeta(snapshot, {
    updatedAt: new Date().toString()
  });
};

var addFetchedAtToMeta = function addFetchedAtToMeta(snapshot, fetchedAt) {
  let date = fetchedAt || new Date().toString();
  addMeta(snapshot, {
    fetchedAt: date
  });
};

var updateMeta = function updateMeta(snapshot) {
  //TODO maybe updatedAt not always gets setted?
  let store = snapshot.record.store;
  let modelName = snapshot._internalModel.modelName;
  let storeMetadata = store.metadataFor(modelName);
  
  addUpdatedAtToMeta(snapshot);
  addFetchedAtToMeta(snapshot, Ember.getWithDefault(storeMetadata, `__data_offline_meta__.${snapshot.id}.fetchedAt`, null));
};

export { addMeta, addUpdatedAtToMeta, addFetchedAtToMeta, updateMeta };

export default addMeta;
