/**
!! This is not a class. It's a ES6 module.
The main goal of this module is to provide the methods for manipulation with metadata such as time of last fetching or updating.
@module utils
@class Meta
**/
import Ember from 'ember';

/**
Adds the meta info to the given snapshot.
@method addMeta
@param snapshot {DS.snapshot}
@param infoToAdd {Object}
**/
var addMeta = function addMeta(snapshot, infoToAdd) {
  //TODO add store meta changing here too
  snapshot.record.set('__data_offline_meta__', Ember.merge(snapshot.record.get('__data_offline_meta__') || {}, infoToAdd));
};
/**
Adds the 'updatedAt' information into the meta to the given snapshot. 'fetchedAt' property stores the information
about last updated time of record (data) and  is used for checking if the data is expired.
@method addUpdatedAtToMeta
@param snapshot {DS.snapshot}
**/
var addUpdatedAtToMeta = function addUpdatedAtToMeta(snapshot) {
  addMeta(snapshot, {
    updatedAt: new Date().toString()
  });
};
/**
Adds the 'fetchedAt' information into the meta to the given snapshot. 'fetchedAt' property stores the information
about last fetched time of record (data) and  is used for checking if the data is expired.
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
Updates the meta info about last fetched and last updated time.
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
