import Ember from 'ember';
import jobMixin from 'ember-data-offline/mixins/job';
import handleApiErrors from 'ember-data-offline/utils/handle-api-errors';
import { persistOne } from 'ember-data-offline/utils/persist-offline';
import { eraseOne } from 'ember-data-offline/utils/erase-offline';
import extractTargetRecordFromPayload from 'ember-data-offline/utils/extract-online';

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
      new Ember.RSVP.Promise(resolve => {
        store.pushPayload(typeClass.modelName, adapterPayload);
        return resolve();
      }).then(() => {
        this.get('adapter').createOfflineJob('findAll', [store, typeClass, sinceToken, null, true], store);
        store.set(`syncLoads.findAll.${typeClass.modelName}`, true);
      });

    });

    return adapterResp;
  },

  find(store, typeClass, id) {
    let adapterResp = this.get('adapter').find(store, typeClass, id);
    store.set(`syncLoads.find.${typeClass.modelName}`, false);

    adapterResp.then(adapterPayload => {
      new Ember.RSVP.Promise(resolve => {
        store.pushPayload(typeClass.modelName, adapterPayload);
        return resolve();
      }).then(() => {
        this.get('adapter').createOfflineJob('find', [store, typeClass, id, null, true], store);
        store.set(`syncLoads.find.${typeClass.modelName}`, true);
      });

    });

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
    let apiHandler = handleApiErrors(function() {
      eraseOne(adapter.get('offlineAdapter'), store, type, snapshot);
    });

    return adapter.createRecord(store, type, snapshot, fromJob)
      .then(result => {
        eraseOne(adapter.get('offlineAdapter'), store, type, snapshot);
        store.pushPayload(type.modelName, result);
        let recordId = extractTargetRecordFromPayload(store, type, result).id;
        persistOne(adapter.get('offlineAdapter'), store, type, recordId);

        return result;
      })
      .catch(apiHandler);
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
