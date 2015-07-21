import Ember from 'ember';

var addMeta = function addMeta(snapshot, infoToAdd) {
  //TODO add store meta changing here too
  snapshot.record.set('__data_offline_meta__', Ember.merge(snapshot.record.get('__data_offline_meta__') || {}, infoToAdd));
};

var addUpdatedAtToMeta = function addUpdatedAtToMeta(snapshot) {
  addMeta(snapshot, { updatedAt: new Date().toString() });
};

var addFetchedAtToMeta = function addFetchedAtToMeta(snapshot, fetchedAt) {
  let date = fetchedAt || new Date().toString();
  addMeta(snapshot, { fetchedAt: date });
};

export { addMeta, addUpdatedAtToMeta, addFetchedAtToMeta };

export default addMeta;
