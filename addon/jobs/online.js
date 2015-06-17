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
