import Ember from 'ember';
import jobMixin from 'ember-data-offline/mixins/job';

const { isEmpty, RSVP } = Ember;

export default Ember.Object.extend(jobMixin, {
  task() {
    console.log('sync offline');
    if (this[this.get('method')]){
      return this[this.get('method')].apply(this, this.get('params'));
    }
    return this.get('adapter')[this.get('method')].apply(this.get('adapter'), this.get('params'));
  },

  persistOffline(store, typeClass, onlineResp, method) {
    if (Ember.isEmpty(onlineResp)) {
     return;
    }
    if (method === 'find') {
     this._persistOne(store, typeClass, onlineResp);
    }
    else {
     this._persistMany(store, typeClass);
    }
  },

  _persistOne(store, typeClass, onlineRecord){
    let fromStore = store.all(typeClass);
    if (Ember.isEmpty(fromStore)) {
      return;
    }
    let recordFromStore = fromStore.find(record => {
      // let primaryKey = store.serializerFor(typeClass).primaryKey;
      // return record.id === onlineRecord[typeClass.modelName][primaryKey];
      if (record && record.id) {
        return record.id === onlineRecord[typeClass.modelName].id;
      }
    });
    if (recordFromStore) {
      let snapshot = recordFromStore._createSnapshot();
      return this.get('adapter').createRecord(store, typeClass, snapshot, true);
    }
    
  },

  _persistMany(store, typeClass){
    let fromStore = store.all(typeClass);
    if (Ember.isEmpty(fromStore)) {
      return;
    }
    fromStore.forEach(record => {
      let snapshot = record._createSnapshot();
      this.get('adapter').createRecord(store, typeClass, snapshot, true);
    });
  },

  _findWithCheck: function(fromJob, method, onlineResp, store, typeClass, ...params) {
    let offlineAdapter = this.get('adapter');
    if (!fromJob) {
      RSVP.resolve().then(() => { return offlineAdapter.find(store, typeClass, ...params);
      }).then(offineRecord => {
        if (isEmpty(offineRecord)) {
          return onlineResp;
        }
      }).then(onlineRecord => {
        this.persistOffline(store, typeClass, onlineRecord, method);
      }).catch(() => {
        onlineResp.then(onlineRecord => {
          this.persistOffline(store, typeClass, onlineRecord, method);
        });
      });
    }
  },

  findAll(store, typeClass, sinceToken, adapterResp, fromJob) {
    if (!fromJob) {
      console.log('FindAll from offline job', typeClass);

      adapterResp.then(records => {
        this.persistOffline(store, typeClass, records, 'findAll');
      });
    }
  },

  find(store, typeClass, id, snapshot, onlineResp, fromJob) {
    this._findWithCheck(fromJob, 'find', onlineResp, store, typeClass, id, snapshot);
  },

  findQuery(store, typeClass, query, onlineResp, fromJob) {
    this._findWithCheck(fromJob, 'findQuery', onlineResp, store, typeClass, query);
  },

  findMany(store, typeClass, ids, snapshots, onlineResp, fromJob) {
    this._findWithCheck(fromJob, 'findMany', onlineResp, store, typeClass, ids, snapshots);
  },

  createRecord(store, type, snapshot, onlineResp){
    onlineResp.then(() => {
      return this.get('adapter').createRecord(store, type, snapshot);
    }).catch(console.log.bind(console));
  },

  updateRecord(store, type, snapshot, onlineResp){
    onlineResp.then(() => {
      return this.get('adapter').updateRecord(store, type, snapshot);
    }).catch(console.log.bind(console));
  },

  deleteRecord(store, type, snapshot, onlineResp){
    onlineResp.then(() => {
      return this.get('adapter').deleteRecord(store, type, snapshot);
    }).catch(console.log.bind(console));
  },
});
