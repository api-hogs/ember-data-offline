import Ember from 'ember';
import jobMixin from 'ember-data-offline/mixins/job';

const { isEmpty, RSVP } = Ember;

export default Ember.Object.extend(jobMixin, {
  task() {
    return this[this.get('method')].apply(this, this.get('params'));
  },

  findAll(store, typeClass, sinceToken, adapterResp) {
    let offlineAdapter = this.get('adapter');
    adapterResp.then(records => {
      let fromStore = store.all(typeClass);
      if (!Ember.isEmpty(fromStore)) {
        fromStore.forEach(record => {
          let snapshot = record._createSnapshot();
          offlineAdapter.createRecord(store, typeClass, snapshot);
        });
      }
    });
  },

  _persistOne(store, typeClass, onlineRecord){
    let fromStore = store.all(typeClass);
    if (!Ember.isEmpty(fromStore)) {
      let recordFromStore = fromStore.find(record => {
        return record.id === onlineRecord[typeClass.modelName].id;
      });
      let snapshot = recordFromStore._createSnapshot();
      this.get('adapter').createRecord(store, typeClass, snapshot);
    }
  },

  _findWithCheck: function(onlineResp, store, typeClass, ...params) {
    let offlineAdapter = this.get('adapter');

    RSVP.resolve().then(() => {
      return offlineAdapter.find(store, typeClass, ...params);
    }).then(offineRecord => {
      if (isEmpty(offineRecord)) {
        return onlineResp;
      }
    }).then(onlineRecord => {
      this._persistOne(store, typeClass, onlineRecord);
    }).catch(() => {
      onlineResp.then(onlineRecord => {
        this._persistOne(store, typeClass, onlineRecord);
      });
    });
  },

  find(store, typeClass, id, snapshot, onlineResp) {
    this._findWithCheck(onlineResp, store, typeClass, id, snapshot);
  },

  findQuery(store, typeClass, query, onlineResp) {
    this._findWithCheck(onlineResp, store, typeClass, query);
  },

  findMany(store, typeClass, ids, snapshots, onlineResp) {
    this._findWithCheck(onlineResp, store, typeClass, ids, snapshots);
  },

  createRecord(store, type, snapshot, onlineResp){
    onlineResp.then(createdFromOnline => {
      return this.get('adapter').persistData(type, createdFromOnline);
    }).catch(console.log.bind(console));
  },

  updateRecord(store, type, snapshot, onlineResp){
    onlineResp.then(updatedFromOnline => {
      return this.get('adapter').persistData(type, updatedFromOnline);
    }).catch(console.log.bind(console));
  },

  deleteRecord(store, type, snapshot, onlineResp){
    onlineResp.then(() => {
      return this.get('adapter').deleteRecord(store, type, snapshot);
    }).catch(console.log.bind(console));
  },
});
