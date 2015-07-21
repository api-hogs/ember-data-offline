import Ember from 'ember';

var addMeta = function addMeta(snapshot, infoToAdd) {
  snapshot.record.set('__data_offline_meta__', Ember.merge(snapshot.record.get('__data_offline_meta__') || {}, infoToAdd));
};

var addUpdatedAtToMeta = function addUpdatedAtToMeta(snapshot) {
  addMeta(snapshot, { updatedAt: new Date().toString() });
};

var addFetchedAtToMeta = function addFetchedAtToMeta(snapshot, fetchedAt = (new Date()).toString()) {
  addMeta(snapshot, { fetchedAt: fetchedAt });
};

export { addMeta, addUpdatedAtToMeta, addFetchedAtToMeta };

export default addMeta;
