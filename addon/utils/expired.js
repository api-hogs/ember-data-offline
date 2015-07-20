import Ember from 'ember';
import moment from 'moment';

var isExpiredOne = function(store, typeClass, record) {
  if (Ember.isEmpty(record)) {
   return true; 
  }
  let adapter = store.lookupAdapter(typeClass.modelName);
  let recordTTL = adapter.get('recordTTL');
  let updatedAt = record['__data_offline_meta__'].updatedAt;
  if (moment().diff(updatedAt) > recordTTL) {
   return true; 
  }
  return false;
};

var isExpiredMany = function(store, typeClass, records) {
  if (Ember.isEmpty(records)) {
   return true; 
  }
  let adapter = store.lookupAdapter(typeClass.modelName);
  let recordTTL = adapter.get('recordTTL');
  return records.reduce((p, record) => {
    let updatedAt = record['__data_offline_meta__'].updatedAt;
    let gate = false;
    if (moment().diff(updatedAt) > recordTTL) {
     return true; 
    }
    return p || gate;
  }, false);
};

export { isExpiredOne, isExpiredMany };
