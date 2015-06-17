import Ember from 'ember';
import jobMixin from 'ember-data-offline/mixins/job';

export default Ember.Object.extend(jobMixin, {
  task() {
    console.log('sync', this.get('method'));
    if (this[this.get('method')]){
      return this[this.get('method')].apply(this, this.get('params'));
    }
    return this.get('adapter')[this.get('method')].apply(this.get('adapter'), this.get('params'));
  },

  findAll(store, typeClass, sinceToken, fromJob) {
    let adapterResp = this.get('adapter').findAll(store, typeClass, sinceToken);

    adapterResp.then(adapterPayload => {
      store.unloadAll(typeClass);
      console.log("WPPWPWPWPWPW", typeClass, adapterPayload)
      store.pushPayload(typeClass, adapterPayload);
    });

    return adapterResp;
  },

  find: function(store, typeClass, id, snapshot, fromJob) {
    let adapterResp = this.get('adapter').find(store, typeClass, id, snapshot);

    adapterResp.then(adapterPayload => {
      store.unloadRecord(typeClass, id);
      store.pushPayload(typeClass, adapterPayload);
    });

    return adapterResp;
  },

  findQuery(store, type, query, fromJob) {
    let adapterResp = this.get('adapter').findQuery(store, type, query);

    adapterResp.then(adapterPayload => {
      //TODO think about unload
      store.pushPayload(typeClass, adapterPayload);
    });

    return adapterResp;
  },

  findMany(store, type, ids, snapshots, fromJob) {
    let adapterResp = this.get('adapter').findMany(store, type, ids, snapshots);

    adapterResp.then(adapterPayload => {
      //TODO think about unload
      store.pushPayload(typeClass, adapterPayload);
    });

    return adapterResp;
  },

  createRecord(store, type, snapshot, fromJob) {
    let adapter = this.get('adapter');
    return adapter.createRecord(store, type, snapshot, fromJob);
  },

  updateRecord(store, type, snapshot, fromJob) {
    let adapter = this.get('adapter');
    return adapter.updateRecord(store, type, snapshot, fromJob);
  },

  deleteRecord(store, type, snapshot, fromJob) {
    let adapter = this.get('adapter');
    return adapter.deleteRecord(store, type, snapshot, fromJob);
  },

});
