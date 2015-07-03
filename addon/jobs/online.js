import Ember from 'ember';
import jobMixin from 'ember-data-offline/mixins/job';

export default Ember.Object.extend(jobMixin, {
  task() {
    if (this[this.get('method')]){
      return this[this.get('method')].apply(this, this.get('params'));
    }
    return this.get('adapter')[this.get('method')].apply(this.get('adapter'), this.get('params'));
  },

  findAll(store, typeClass, sinceToken) {
      console.log('findAll online job', typeClass)
    let adapterResp = this.get('adapter').findAll(store, typeClass, sinceToken);
    store.set(`syncLoads.findAll.${typeClass.modelName}`, false);

    adapterResp.then(adapterPayload => {
      console.log('findAll online job then', typeClass, adapterPayload)
      store.pushPayload(typeClass.modelName, adapterPayload);

      store.set(`syncLoads.findAll.${typeClass.modelName}`, true);
    });

    return adapterResp;
  },

  find: function(store, typeClass, id, snapshot) {
    let adapterResp = this.get('adapter').find(store, typeClass, id, snapshot);
    store.set(`syncLoads.find.${typeClass.modelName}`, false);

    adapterResp.then(adapterPayload => {
      if (!Ember.isEmpty(adapterPayload)) {
        store.pushPayload(typeClass.modelName, adapterPayload);

        store.set(`syncLoads.find.${typeClass.modelName}`, true);
      }
    }).catch(console.log.bind(console));

    return adapterResp;
  },

  findQuery(store, type, query) {
    let adapterResp = this.get('adapter').findQuery(store, type, query);
    store.set(`syncLoads.findQuery.${type.modelName}`, false);

    adapterResp.then(adapterPayload => {
      store.pushPayload(type.modelName, adapterPayload);
      store.set(`syncLoads.findQuery.${type.modelName}`, true);
    });

    return adapterResp;
  },

  findMany(store, type, ids, snapshots) {
    let adapterResp = this.get('adapter').findMany(store, type, ids, snapshots);

    adapterResp.then(adapterPayload => {
      store.pushPayload(type.modelName, adapterPayload);
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
