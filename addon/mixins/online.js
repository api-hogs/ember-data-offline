import Ember from 'ember';
import baseMixin from 'ember-data-offline/mixins/base';
import debug from 'ember-data-offline/utils/debug';

export default Ember.Mixin.create(baseMixin, {
  findAll: function(store, typeClass) {
    debug('findAll online', typeClass.modelName);
    return this._super.apply(this, arguments);
  },

  find: function(store, typeClass, id, snapshot, fromJob) {
    let onlineResp = this._super.apply(this, arguments);
    return onlineResp.then(resp => {

      //TODO move all this to online job
      if (!fromJob && store.get('isOfflineEnabled')) {
        this.createOfflineJob('find', [store, typeClass, id], store);
      }
      return resp;
    });
  },

  findQuery: function(store, type, query, recordArray, fromJob) {
    let onlineResp = this._super.apply(this, arguments);
    return onlineResp.then(resp => {
      if (!fromJob && store.get('isOfflineEnabled')) {
        this.createOfflineJob('findQuery', [store, type, query, resp, true], store);
      }
      return resp;
    });
  },

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

  createRecord() {
    return this._super.apply(this, arguments);
  },

  updateRecord() {
    return this._super.apply(this, arguments);
  },

  deleteRecord() {
    return this._super.apply(this, arguments);
  }
});
