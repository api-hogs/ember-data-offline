
/**
@module jobs
**/
import Ember from 'ember';
import jobMixin from 'ember-data-offline/mixins/job';
import persistOffline from 'ember-data-offline/utils/persist-offline';
/**
An implementation of a syncronization job for the Localforage storage.

@class Localforage
@extends Ember.Object
@uses Job
@constructor
**/
export default Ember.Object.extend(jobMixin, {
  /**
  A method called by default to execute the job.
  The method to be called as well as it's arguments can be customized.
  @method task
  @return promise {Promise}
  **/
  task() {
    if (this[this.get('method')]){
      return this[this.get('method')].apply(this, this.get('params'));
    }
    return this.get('adapter')[this.get('method')].apply(this.get('adapter'), this.get('params'));
  },

  /**
  Saves the loaded records to the local storage.
  @method findAll
  @param store {DS.Store}
  @param typeClass {DS.Model}
  **/
  findAll(store, typeClass) {
    persistOffline(this.get('adapter'), store, typeClass, null, 'findAll');
  },
  /**
  Saves the loaded record to the local storage.
  @method find
  @param store {DS.Store}
  @param typeClass {DS.Model}
  @param id {String|Number}
  **/
  find(store, typeClass, id) {
    let adapter = this.get('adapter');
    persistOffline(adapter, store, typeClass, id, "find");
  },
  /**
  Saves the loaded record to the local storage.
  @method findQuery
  @param store {DS.Store}
  @param typeClass {DS.Model}
  @param query {Object}
  @param onlineResp {Promise}
  **/
  findQuery(store, typeClass, query, onlineResp) {
    let adapter = this.get('adapter');
    persistOffline(adapter, store, typeClass, onlineResp, "findQuery");
  },

  /**
  Saves the loaded records to the local storage.
  @method findMany
  @param store {DS.Store}
  @param typeClass {DS.Model}
  @param ids {Array}
  **/
  findMany(store, typeClass, ids) {
    let adapter = this.get('adapter');
    persistOffline(adapter, store, typeClass, ids, 'findMany');
  },
  /**
  Saves the loaded record to the local storage.

  @method createRecord
  @param store {DS.Store}
  @param type {DS.Model}
  @param snapshot {DS.Snapshot}
  @param onlineResp {Promise}
  **/
  createRecord(store, type, snapshot, onlineResp){
    onlineResp.then(() => {
      return this.get('adapter').createRecord(store, type, snapshot);
    });
  },
  /**
  Updates the record in the local storage.

  @method updateRecord
  @param store {DS.Store}
  @param type {DS.Model}
  @param snapshot {DS.Snapshot}
  @param onlineResp {Promise}
  **/
  updateRecord(store, type, snapshot, onlineResp){
    onlineResp.then(() => {
      return this.get('adapter').updateRecord(store, type, snapshot);
    });
  },
  /**
  Deletes the record from the local storage.

  @method deleteRecord
  @param store {DS.Store}
  @param type {DS.Model}
  @param snapshot {DS.Snapshot}
  @param onlineResp {Promise}
  **/
  deleteRecord(store, type, snapshot, onlineResp){
    onlineResp.then(() => {
      return this.get('adapter').deleteRecord(store, type, snapshot);
    });
  },
});
