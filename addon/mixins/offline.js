/**
@module mixins
**/
import Ember from 'ember';
import baseMixin from 'ember-data-offline/mixins/base';
import debug from 'ember-data-offline/utils/debug';
import extractTargetRecordFromPayload from 'ember-data-offline/utils/extract-online';
import { isExpiredOne, isExpiredMany, isExpiredAll } from 'ember-data-offline/utils/expired';
import { updateMeta } from 'ember-data-offline/utils/meta';

/**
Ofline mixin redefines all adapter methods for finding, creation, deletion to make request to offline storage.

@class Offline
@extends Ember.Mixin
@uses Base
@constructor
**/
export default Ember.Mixin.create(baseMixin, {
  shouldReloadAll() {
    return false;
  },
  shouldBackgroundReloadAll: function() {
    return true;
  },
  shouldReloadRecord() {
    return false;
  },
  shouldBackgroundReloadRecord() {
    return true;
  },

  /**
  Returns the metadata for a given. Returned metadata consists information about
  last fetched and last updated time.

  @method metadataForType
  @param typeClass {DS.Model}
  @returns metadata {Object}
  **/
  metadataForType(typeClass) {
    return this._namespaceForType(typeClass).then(namespace => {
      return namespace["__data_offline_meta__"];
    });
  },

  /**
  Overrides the method of an extended adapter (offline). Fetches a JSON array for all of the records for a given type
  from offline adapter. If fetched records are expired then tries to create online job of fetching the records
  from online adapter and persisting them offline. Returns a promise for the resulting payload.

  @method findAll
  @param store {DS.Store}
  @param typeClass {DS.Model}
  @param sinceToken {String}
  @param snapshots {Array}
  @param fromJob {boolean}
  @return promise {Promise}
  **/
  findAll: function(store, typeClass, sinceToken, snapshots, fromJob) {
    debug('findAll offline', typeClass.modelName);
    return this._super.apply(this, arguments).then(records => {
      if (!fromJob) {
        //TODO find way to pass force reload option here
        this.metadataForType(typeClass).then(meta => {
          if (isExpiredAll(store, typeClass, meta)) {
            this.createOnlineJob('findAll', [store, typeClass, sinceToken, snapshots, true]);
          }
        });
      }
      return records;
    });
  },

  /**
  Overrides the method of an extended adapter (offline). Fetches a JSON for a given type and ID
  from offline adapter. If fetched record is expired then tries to create online job of fetching the record
  from online adapter and persisting it offline. Returns a promise for the resulting payload.
  @method find
  @param store {DS.Store}
  @param typeClass {DS.Model}
  @param id {String|Number}
  @param snapshot {DS.Snapshot}
  @param fromJob {boolean}
  @return promise {Promise}
  **/
  find: function(store, typeClass, id, snapshot, fromJob) {
    return this._super.apply(this, arguments).then(record => {
      if (!fromJob) {
        if (isExpiredOne(store, typeClass, record) && !Ember.isEmpty(id)) {
          this.createOnlineJob('find', [store, typeClass, id, snapshot, true]);
        }
      }
      if (Ember.isEmpty(record) && !Ember.isEmpty(id)) {
        let primaryKey = store.serializerFor(typeClass.modelName).primaryKey;
        let stub = {};
        stub[primaryKey] = id;
        return stub;
      }
      return record;
    });
  },

  /**
  Overrides the method of an extended adapter (offline). Fetches a JSON array for the records that match a particular query
  from offline adapter. If fetched records are expired then tries to create online job of fetching the records
  from online adapter and persisting them offline. Returns a promise for the resulting payload.

  @method query
  @param store {DS.Store}
  @param typeClass {DS.Model}
  @param query {Object}
  @param recordArray {Array}
  @param fromJob {boolean}
  @return promise {Promise}
  **/
  query: function(store, typeClass, query, recordArray, fromJob) {
    return this._super.apply(this, arguments).then(records => {
      //TODO think how to remove this dirty hasck
      if (Ember.isEmpty(records)) {
        return this.get('onlineAdapter').findQuery(store, typeClass, query, recordArray, fromJob).then(onlineRecords => {
          return extractTargetRecordFromPayload(store, typeClass, onlineRecords);
        });
      }
      else {
        if (!fromJob) {
          this.createOnlineJob('query', [store, typeClass, query, recordArray, true]);
        }
      }
      return records;
    });
  },

  /**
  Overrides the method of an extended adapter (offline). Fetches a JSON array for  a given type and IDs
  from offline adapter. If fetched records are expired then tries to create online job of fetching the records
  from online adapter and persisting them offline. Returns a promise for the resulting payload.

  @method findMany
  @param store {DS.Store}
  @param typeClass {DS.Model}
  @param ids {Array}
  @param snapshots {Array}
  @param fromJob {boolean}
  @return promise {Promise}
  **/
  findMany: function(store, typeClass, ids, snapshots, fromJob) {
    // debug('findMany offline', type.modelName);
    return this._super.apply(this, arguments).then(records => {
      if (!fromJob) {
        if (isExpiredMany(store, typeClass, records) && !Ember.isEmpty(ids)) {
          this.createOnlineJob('findMany', [store, typeClass, ids, snapshots, true]);
        }
      }
      if (Ember.isEmpty(records) && !Ember.isEmpty(ids)) {
        let primaryKey = store.serializerFor(typeClass.modelName).primaryKey;
        return ids.map(id => {
          let stub = {};
          stub[primaryKey] = id;
          return stub;
        });
      }
      return records;
    });
  },

  /**
  Called  when a newly created record is saved via the `save` method on a model record instance.
  If this method was called from Queue(fromJob) then it would create an online job for creation record.
  Calls the implementation method of parrent offline adapter.
  @method createRecord
  @param store {DS.Store}
  @param type {DS.Model}
  @param snapshot {DS.Snapshot}
  @param fromJob {boolean}
  @return promise {Promise}
  **/
  createRecord(store, type, snapshot, fromJob) {
    updateMeta(snapshot);

    if (!fromJob) {
      if (this.get('isOnline')) {
        this.createOnlineJob('createRecord', [store, type, snapshot, true], `create$${type.modelName}`);
      }
      else {
        this.createOnlineJob('createRecord', [store, type, snapshot, true]);
      }
    }

    return this._super.apply(this, [store, type, snapshot]);
  },
  /**
  Called when an existing record is saved
  via the `save` method on a model record instance.

  If this method was called from Queue(fromJob) then it would create an online job for updating record.
  Calls the implementation method of parrent offline adapter.
  @method updateRecord
  @param store {DS.Store}
  @param type {DS.Model}
  @param snapshot {DS.Snapshot}
  @param fromJob {boolean}
  @return promise {Promise}
  **/
  updateRecord(store, type, snapshot, fromJob) {
    if (!fromJob) {
      this.createOnlineJob('updateRecord', [store, type, snapshot, true]);
    }

    updateMeta(snapshot);
    return this._super.apply(this, [store, type, snapshot]);
  },
  /**
  Called when a record is deleted.
  If this method was called from Queue(fromJob) then it would create an online job for deletion record.
  Calls the implementation method of parrent offline adapter.
  @method deleteRecord
  @param store {DS.Store}
  @param type {DS.Model}
  @param snapshot {DS.Snapshot}
  @param fromJob {boolean}
  @return promise {Promise}
  **/
  deleteRecord(store, type, snapshot, fromJob) {
    if (!fromJob) {
      this.createOnlineJob('deleteRecord', [store, type, snapshot, true]);
    }
    return this._super.apply(this, arguments);
  }
});
