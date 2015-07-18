import Ember from 'ember';
import jobMixin from 'ember-data-offline/mixins/job';
import handleApiErrors from 'ember-data-offline/utils/handle-api-errors';
import { persistOne } from 'ember-data-offline/utils/persist-offline';
import { eraseOne } from 'ember-data-offline/utils/erase-offline';

export default Ember.Object.extend(jobMixin, {
  task() {
    if (this[this.get('method')]){
      return this[this.get('method')].apply(this, this.get('params'));
    }
    return this.get('adapter')[this.get('method')].apply(this.get('adapter'), this.get('params'));
  },

  findAll(store, typeClass, sinceToken) {
    let adapterResp = this.get('adapter').findAll(store, typeClass, sinceToken);
    store.set(`syncLoads.findAll.${typeClass.modelName}`, false);

    adapterResp.then(adapterPayload => {
      store.pushPayload(typeClass.modelName, adapterPayload);

      store.set(`syncLoads.findAll.${typeClass.modelName}`, true);
    });

    return adapterResp;
  },

  find(store, typeClass, id, snapshot) {
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

  findMany(store, typeClass, ids, snapshots) {
    let adapterResp = this.get('adapter').findMany(store, typeClass, ids, snapshots);

    adapterResp.then(adapterPayload => {
      store.pushPayload(typeClass.modelName, adapterPayload);
    });

    return adapterResp;
  },

  createRecord(store, type, snapshot, fromJob) {
    let adapter = this.get('adapter');

    return adapter.createRecord(store, type, snapshot, fromJob)
      .then(result => {
        eraseOne(adapter.get('offlineAdapter'), store, type, snapshot);
        store.pushPayload(type.modelName, result);
        persistOne(adapter.get('offlineAdapter'), store, type, result);
        return result;
      })
      .catch(handleApiErrors)
      .then(result => {
        if (Ember.isEmpty(result)) {
          eraseOne(adapter.get('offlineAdapter'), store, type, snapshot);
        }
        else {
          return Ember.RSVP.resolve(result);
        }
      }, () => {
        return Ember.RSVP.reject();
      });
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
