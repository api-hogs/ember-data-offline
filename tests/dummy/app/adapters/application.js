import DS from 'ember-data';
import offlineMixin from 'ember-data-offline/mixins/offline';

var localAdapter = DS.LSAdapter.extend({
  namespace: 'dummy'
});
export default DS.RESTAdapter.extend(offlineMixin, {
  offlineAdapter: Ember.computed(function() {
    return localAdapter.create({
      container: this.container,
      serializer: DS.LSSerializer.extend().create({
        container: this.container,
      }),
    });
  }),
});
