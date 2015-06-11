import Ember from 'ember';
import baseMixin from 'ember-data-offline/mixins/base';

export default Ember.Mixin.create(baseMixin,{
  findAll: function(store, typeClass, sinceToken, fromJob) {
    if (!fromJob){
      this.createOnlineJob('findAll', [store, typeClass, sinceToken, true], store);
    }
    return this.findAll(store, typeClass, sinceToken);
  },

  find: function(store, typeClass, id, snapshot, fromJob) {
    if (!fromJob){
      this.createOnlineJob('find', [store, typeClass, id, snapshot, true], store);
    }
    return this.find(store, typeClass, id, snapshot);
  },

  findQuery: function(store, type, query, fromJob) {
    if (!fromJob){
      this.createOnlineJob('findQuery', [store, type, query, true], store);
    }
    return this.findQuery(store, type, query);
  },

  findMany: function(store, type, ids, snapshots, fromJob) {
    if (!fromJob){
      this.createOnlineJob('findMany', [store, type, ids, snapshots, true], store);
    }
    return this.find(store, type, ids, snapshots);
  },

  createRecord(store, type, snapshot, fromJob) {
    //think about merge id....very important. maybe unload Record, and push Record...
    if (!fromJob){
      this.createOnlineJob('createRecord', [store, type, snapshot, true], store);
    }
    return this.createRecord(store, type, snapshot);
  },

  updateRecord(store, type, snapshot, fromJob) {
    if (!fromJob){
      this.createOnlineJob('updateRecord', [store, type, snapshot, true], store);
    }
    return this.updateRecord(store, type, snapshot);
  },

  deleteRecord(store, type, snapshot, fromJob) {
    if (!fromJob){
      this.createOnlineJob('deleteRecord', [store, type, snapshot, true], store);
    }
    return this.deleteRecord(store, type, snapshot);
  }
});
