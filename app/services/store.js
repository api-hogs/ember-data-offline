import Ember from 'ember';
import DS from 'ember-data';
import syncLoads from 'ember-data-offline/logics/sync-loads';

export default DS.Store.extend({
  syncLoads: syncLoads.create(),

  adapterFor: function() {
    return this._super.apply(this, arguments).get('offlineAdapter');
  },
});
