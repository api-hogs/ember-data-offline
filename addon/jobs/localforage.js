import Ember from 'ember';
import jobMixin from 'ember-data-offline/mixins/job';
import persistOffline from 'ember-data-offline/utils/persist-offline';

// const { isEmpty, RSVP } = Ember;

export default Ember.Object.extend(jobMixin, {
  task() {
    if (this[this.get('method')]){
      return this[this.get('method')].apply(this, this.get('params'));
    }
    return this.get('adapter')[this.get('method')].apply(this.get('adapter'), this.get('params'));
  },

  findAll(store, typeClass, sinceToken, adapterResp) {
    // adapterResp.then(records => {
    persistOffline(this.get('adapter'), store, typeClass, null, 'findAll');
    // }).catch(console.log.bind(console));
  },

  find(store, typeClass, id) {
    let adapter = this.get('adapter');
    persistOffline(adapter, store, typeClass, id, "find");
  },

  findQuery(store, typeClass, query, onlineResp) {
    let adapter = this.get('adapter');
    persistOffline(adapter, store, typeClass, onlineResp, "findQuery");
  },

  findMany(store, typeClass, ids) {
    let adapter = this.get('adapter');
    //While we using findAll instead of findMany we better use this for persistance
    persistOffline(this.get('adapter'), store, typeClass, null, 'findAll');
    // persistOffline(adapter, store, typeClass, ids, "findMany");
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
