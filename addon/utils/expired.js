/**
!! This is not a class. It's a ES6 module.
The main goal of this modele is to provide the methods for cheking an actulity of data in offline storage. 
@module utils
@class Expired

**/
import Ember from 'ember';
import moment from 'moment';

/**
Checks if record is expired by comparing last fetched time with recordTTL.

@private
@method _isExpired
@param record {Object}
@param RecordTTl {Number}
@return {boolean}
**/
var _isExpired = function(record, recordTTL) {
  if (!record) {
    return true;
  }
  let updatedAt = record["__data_offline_meta__"] ? record['__data_offline_meta__'].fetchedAt : record.fetchedAt;
  //this is for locally created records
  if (!updatedAt) {
    return true;
  }
  if (moment().diff(updatedAt) > recordTTL) {
   return true;
  }
  return false;
};
/**
Checks if record is expired by comparing last fetched time with recordTTL. Information about record ttl
is gotten from adapter for a given type.

@method isExpiredOne
@param store {DS.Store}
@param typeClass {DS.Model}
@param record {}
@return {boolean}
**/
var isExpiredOne = function(store, typeClass, record) {
  if (Ember.isEmpty(record)) {
    return true;
  }
  let recordTTL = store.lookupAdapter(typeClass.modelName).get('recordTTL');

  return _isExpired(record, recordTTL);
};

/**
Checks if the collection of records is expired by comparing last fetched time with recordTTL. Information about record(collection)
ttl is gotten from adapter for a given type.

@method isExpiredAll
@param store {DS.Store}
@param typeClass {DS.Model}
@param meta {Object}
@return {boolean}
**/
var isExpiredAll = function(store, typeClass, meta) {
  let adapter = store.lookupAdapter(typeClass.modelName);
  let ttl = adapter.get('collectionTTL') || adapter.get('recordTTL');

  return _isExpired(meta, ttl);
};


/**
Checks if the any record from array of records is expired by comparing last fetched time with recordTTL. Information about record(collection)
ttl is gotten from adapter for a given type.

@method isExpiredMany
@param store {DS.Store}
@param typeClass {DS.Model}
@param records {Array}
@return {boolean}
**/
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

export { isExpiredOne, isExpiredMany, isExpiredAll };
