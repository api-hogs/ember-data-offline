import baseMixin from 'ember-data-offline/mixins/base';
import Ember from 'ember';

export default Ember.Mixin.create(baseMixin, {

  findAll: function(store, typeClass, sinceToken, fromJob) {
    let adapterResp = this._super.apply(this, arguments);
    if (!fromJob) {
      this.createOfflineJob('findAll', [store, typeClass, sinceToken, adapterResp, true], store);
    }
    console.log('findAll from online adapter', typeClass);
    return adapterResp;
  },

  find: function(store, typeClass, id, snapshot, fromJob) {
    let onlineResp = this._super.apply(this, arguments);
    if (!fromJob) {
      this.createOfflineJob('find', [store, typeClass, id, snapshot, onlineResp, true], store);
    }
    return onlineResp;
  },

  findQuery: function(store, type, query, fromJob) {
    let onlineResp = this._super.apply(this, arguments);
    if (!fromJob) {
      this.createOfflineJob('findQuery', [store, type, query, onlineResp, true], store);
    }
    return onlineResp;
  },

  findMany: function(store, type, ids, snapshots, fromJob) {
    let onlineResp = this._super.apply(this, arguments);
    if (!fromJob) {
      this.createOfflineJob('find', [store, type, ids, snapshots, onlineResp, true], store);
    }
    return onlineResp;
  },

  createRecord(store, type, snapshot, fromJob) {
    let onlineResp = this._super.apply(this, arguments);
    if (!fromJob) {
      this.createOfflineJob('createRecord', [store, type, snapshot, onlineResp, true], store);
    }
    return onlineResp;
  },

  updateRecord(store, type, snapshot, fromJob) {
    let onlineResp = this._super.apply(this, arguments);
    if (!fromJob) {
      this.createOfflineJob('updateRecord', [store, type, snapshot, onlineResp, true], store);
    }
    return onlineResp;
  },

  deleteRecord(store, type, snapshot, fromJob) {
    let onlineResp = this._super.apply(this, arguments);
    if (!fromJob) {
      this.createOfflineJob('deleteRecord', [store, type, snapshot, onlineResp, true], store);
    }
    return onlineResp;
  }
});
