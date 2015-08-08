/**
@module mixins
**/
import Ember from 'ember';
import baseMixin from 'ember-data-offline/mixins/base';
import debug from 'ember-data-offline/utils/debug';


/**
Online mixin redefines all adapter persistance methods to make request to online storage.

@class Online
@extends Ember.Mixin
@uses Base
@constructor
**/
export default Ember.Mixin.create(baseMixin, {
  /**
  Fetches a JSON array for all of the records for a given type from online adapter.
  @method findAll
  @param store {DS.Store}
  @param typeClass {DS.Model}
  @return promise {Promise}
  **/
  findAll: function(store, typeClass) {
    debug('findAll online', typeClass.modelName);
    return this._super.apply(this, arguments);
  },
  /**
  Fetches a JSON array for all of the records for a given type from online adapter.
  @method find
  @return promise {Promise}
  **/
  find: function() {
    return this._super.apply(this, arguments);
  },
  /**
  Fetches a JSON array for all of the records for a given type from online adapter.
  @method findQuery
  @param store {DS.Store}
  @param type {DS.Model}
  @param query {Object}
  @param recordArray {Array}
  @param fromJob {Array}
  @return promise {Promise}
  **/
  findQuery: function(store, type, query, recordArray, fromJob) {
    let onlineResp = this._super.apply(this, arguments);
    return onlineResp.then(resp => {
      if (!fromJob && store.get('isOfflineEnabled')) {
        this.createOfflineJob('findQuery', [store, type, query, resp, true], store);
      }
      return resp;
    });
  },
  /**
  Fetches a JSON array for all of the records for a given type from online adapter.
  @method findMany
  @param store {DS.Store}
  @param typeClass {DS.Model}
  @param ids {Array}
  @param snapshots {Array}
  @param fromJob {Array}
  @return promise {Promise}
  **/
  findMany: function(store, typeClass, ids, snapshots, fromJob) {
    //TODO add some config param for such behavior
    let onlineResp = this.findAll(store, typeClass, null, true);

    return onlineResp.then(resp => {
      if (!fromJob && store.get('isOfflineEnabled')) {
        this.createOfflineJob('findMany', [store, typeClass, ids], store);
      }
      return resp;
    });
  },
  /**
  Saves the record via the parent offline adapter.
  @method createRecord
  @return promise {Promise}
  **/
  createRecord() {
    return this._super.apply(this, arguments);
  },
  /**
  Updates the record via the parent offline adapter.
  @method updateRecord
  @return promise {Promise}
  **/
  updateRecord() {
    return this._super.apply(this, arguments);
  },

  /**
  Deletes the record via the parent offline adapter.
  @method deleteRecord
  @return promise {Promise}
  **/
  deleteRecord() {
    return this._super.apply(this, arguments);
  }
});
