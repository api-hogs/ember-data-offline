import Ember from 'ember';
import baseMixin from 'ember-data-offline/mixins/base';

export default Ember.Mixin.create(baseMixin, {
  findAll: function(store, typeClass, sinceToken, fromJob) {
    store.get('requestRegistry').registerReq(typeClass.modelName);
    if (!fromJob) {
      if (store.isFirstRequestFor(typeClass.modelName)) {
        this.createOnlineJob('findAll', [store, typeClass, sinceToken, true], store);
      }
    }

    return this._super.apply(this, arguments);
  },

  find: function(store, typeClass, id, snapshot, fromJob) {
    if (!fromJob) {
      this.createOnlineJob('find', [store, typeClass, id, snapshot, true], store);
    }
    return this._super.apply(this, arguments);
  },

  findQuery: function(store, type, query, fromJob) {
    if (!fromJob) {
      this.createOnlineJob('findQuery', [store, type, query, true], store);
    }
    return this._super.apply(this, arguments);
  },

  findMany: function(store, type, ids, snapshots, fromJob) {
    if (!fromJob) {
      this.createOnlineJob('findMany', [store, type, ids, snapshots, true], store);
    }
    return this._super.apply(this, arguments);
  },

  createRecord(store, type, snapshot, fromJob) {
    //think about merge id....very important. maybe unload Record, and push Record...
    if (!fromJob) {
      this.createOnlineJob('createRecord', [store, type, snapshot, true], store);
    }
    return this._super.apply(this, arguments);
  },

  updateRecord(store, type, snapshot, fromJob) {
    if (!fromJob) {
      this.createOnlineJob('updateRecord', [store, type, snapshot, true], store);
    }
    return this._super.apply(this, arguments);
  },

  deleteRecord(store, type, snapshot, fromJob) {
    if (!fromJob) {
      this.createOnlineJob('deleteRecord', [store, type, snapshot, true], store);
    }
    return this._super.apply(this, arguments);
  }
});
