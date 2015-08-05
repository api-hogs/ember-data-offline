
/**
@module ember-data-offline
**/
import Ember from 'ember';
import jobMixin from 'ember-data-offline/mixins/job';
import persistOffline from 'ember-data-offline/utils/persist-offline';
/**
@class Localforage
@extends Ember.Object
@uses Job
**/
export default Ember.Object.extend(jobMixin, {
  /**
  Executes task. Before executiong you need to set the method, which should be executed, and the params for method.
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
  Task for saving records offline after findAll operation.
  @method findAll
  @param store {DS.Store}
  @param typeClass {DS.Model}
  **/
  findAll(store, typeClass) {
    persistOffline(this.get('adapter'), store, typeClass, null, 'findAll');
  },
  /**
  Task for saving record offline after find operation.
  @method find
  @param store {DS.Store}
  @param typeClass {DS.Model}
  @param id {String}
  **/
  find(store, typeClass, id) {
    let adapter = this.get('adapter');
    persistOffline(adapter, store, typeClass, id, "find");
  },
  /**
  Task for saving records offline after findQuery operation.
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
  Task for saving records offline after findMany operation.
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
  Task for saving record offline after createRecord operation.

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
  Task for updating record offline after updateRecord operation.

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
  Task for deleting record offline after deleteRecord operation.

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
