import Ember from 'ember';
import DS from 'ember-data';
import syncLoads from 'ember-data-offline/logics/sync-loads';
import Queue from 'ember-data-offline/queue';

DS.Model.reopen({
  save() {
    let modelName = this._internalModel.modelName;
    let store = this.store;
    return this._super.apply(this, arguments).then(resp => {
      let job = store.get(`EDOQueue.onDemandJobs.create$${modelName}`);
      console.log("OOOOOOOOOOOOOOOOOOOOOO", store.get('EDOQueue'))
      if (!job) {
        return resp;
      }
      return job.perform();
    })
    .then(result => {
      return result;
    })

    // console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOO", superResp)
    //   return superResp;
  }
});

export default DS.Store.extend({
  syncLoads: syncLoads.create(),
  EDOQueue: Queue.create(),
  adapterFor() {
    return this._super.apply(this, arguments).get('offlineAdapter') || this._super.apply(this, arguments);
  },
});
