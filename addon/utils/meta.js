/**
Methods for manipulations with record metadata (fetch and update timestamps).
@module utils
@class Meta
**/
import Ember from 'ember';

/**
Adds the metadata to the given snapshot.
@method addMeta
@param snapshot {DS.snapshot}
@param infoToAdd {Object}
**/
var addMeta = function addMeta(snapshot, infoToAdd) {
  //TODO add store meta changing here too
  snapshot.record.set('__data_offline_meta__', Ember.merge(snapshot.record.get('__data_offline_meta__') || {}, infoToAdd));
};
/**
Adds the 'updatedAt' field to the metadata of a given snapshot. The 'fetchedAt' property stores the information
about the last update time of a record and is used for expirations checks.
@method addUpdatedAtToMeta
@param snapshot {DS.snapshot}
**/
var addUpdatedAtToMeta = function addUpdatedAtToMeta(snapshot) {
  addMeta(snapshot, {
    updatedAt: new Date().toString()
  });
};
/**
Adds the 'fetchedAt' field to the metadata of a given snapshot. The 'fetchedAt' property stores the information
about the last fetch time of record and is used for expiration checks.
@method addFetchedAtToMeta
@param snapshot {DS.snapshot}
**/
var addFetchedAtToMeta = function addFetchedAtToMeta(snapshot, fetchedAt) {
  let date = fetchedAt || new Date().toString();
  addMeta(snapshot, {
    fetchedAt: date
  });
};
/**
Updates the last fetch and update timestamps in the metadata.
@method updateMeta
@param snapshot {DS.snapshot}
**/
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
