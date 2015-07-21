import Ember from 'ember';
import moment from 'moment';

var _isExpired = function(record, recordTTL) {
  let updatedAt = record['__data_offline_meta__'].fetchedAt;
  //this is for locally created records
  if (updatedAt === null) {
    return false;
  }
  if (moment().diff(updatedAt) > recordTTL) {
   return true; 
  }
  return false;
}

var isExpiredOne = function(store, typeClass, record) {
  if (Ember.isEmpty(record)) {
    return true;
  }
  let recordTTL = store.lookupAdapter(typeClass.modelName).get('recordTTL');

  return _isExpired(record, recordTTL)
};

var isExpiredMany = function(store, typeClass, records) {
  if (Ember.isEmpty(records)) {
    return true;
  }
  let adapter = store.lookupAdapter(typeClass.modelName);
  let recordTTL = adapter.get('recordTTL');

  return records.reduce((p, record) => {
    return p || _isExpired(record, recordTTL);
  }, false);
};

export { isExpiredOne, isExpiredMany };
