import Ember from 'ember';
import jobMixin from 'ember-data-offline/mixins/job';
import persistOffline from 'ember-data-offline/utils/persist-offline';

const { isEmpty, RSVP } = Ember;

export default Ember.Object.extend(jobMixin, {
  task() {
    if (this[this.get('method')]){
      return this[this.get('method')].apply(this, this.get('params'));
    }
    return this.get('adapter')[this.get('method')].apply(this.get('adapter'), this.get('params'));
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
        persistOffline(offlineAdapter, store, typeClass, onlineRecord, method);
      }).catch(() => {
        onlineResp.then(onlineRecord => {
          persistOffline(offlineAdapter, store, typeClass, onlineRecord, method);
        });
      });
    }
  },

  findAll(store, typeClass, sinceToken, adapterResp) {
    adapterResp.then(records => {
      persistOffline(this.get('adapter'), store, typeClass, records, 'findAll');
    });
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
