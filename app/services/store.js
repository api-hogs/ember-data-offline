import Ember from 'ember';
import DS from 'ember-data';
import syncLoads from 'ember-data-offline/logics/sync-loads';
import Queue from 'ember-data-offline/queue';
import Config from 'ember-data-offline/config';
import config from '../config/environment';

var mainConfig = Config.create({
  custom: Ember.getWithDefault(config, 'ember-data-offline', {})
});

DS.Model.reopen({
  save() {
    if (!mainConfig.get('isEnabled')) {
      return this._super.apply(this, arguments);
    }

    let modelName = this._internalModel.modelName;
    let store = this.store;
    return this._super.apply(this, arguments).then(resp => {
        let job = store.get(`EDOQueue.onDemandJobs.create$${modelName}`);
        if (!job) {
          return resp;
        }
        return job.perform();
      })
      .then(result => {
        return result;
      });
  }
});

export default DS.Store.extend({
  syncLoads: syncLoads.create(),
  EDOQueue: Queue.create(),
  isOfflineEnabled: mainConfig.get('isEnabled'),
  forceFetchAll(modelName) {
    this.adapterFor(modelName).createOnlineJob('findAll', [this, this.modelFor(modelName)]);
  },
  forceFetchRecord(modelName, id) {
    this.adapterFor(modelName).createOnlineJob('find', [this, this.modelFor(modelName), id]);
  },

  adapterFor() {
    if (!mainConfig.get('isEnabled')) {
      return this._super.apply(this, arguments);
    }
    return this._super.apply(this, arguments).get('offlineAdapter') || this._super.apply(this, arguments);
  },
});
