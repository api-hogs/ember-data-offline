import DS from 'ember-data';
import Ember from 'ember';
import offlineMixin from 'ember-data-offline/mixins/offline';

var localAdapter = DS.LSAdapter.extend({
  namespace: 'dummy'
});
export default DS.RESTAdapter.extend(offlineMixin, {
  offlineAdapter: Ember.computed(function() {
    return localAdapter.extend(offlineMixin).create({
      container: this.container,
      serializer: DS.LSSerializer.extend().create({
        container: this.container,
      }),
    });
  }),
});
