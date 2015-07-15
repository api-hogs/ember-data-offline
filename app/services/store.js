import Ember from 'ember';
import DS from 'ember-data';
import syncLoads from 'ember-data-offline/logics/sync-loads';
import Queue from 'ember-data-offline/queue';

export default DS.Store.extend({
  syncLoads: syncLoads.create(),
  EDOQueue: Queue.create(),
  adapterFor() {
    return this._super.apply(this, arguments).get('offlineAdapter');
  }
});
