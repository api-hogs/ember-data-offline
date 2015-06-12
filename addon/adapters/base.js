import DS from 'ember-data';
import Ember from 'ember';
import offlineMixin from 'ember-data-offline/mixins/offline';
import onlineMixin from 'ember-data-offline/mixins/online';

var localAdapter = DS.LSAdapter.extend({
  namespace: 'dummy'
});

export default DS.RESTAdapter.extend(onlineMixin, {
  offlineAdapter: Ember.computed(function() {
    let adapter = this;
    return localAdapter.extend(offlineMixin).create({
      onlineAdapter: adapter,
      container: this.container,
      serializer: DS.LSSerializer.extend().create({
        container: this.container,
      }),
    });
  }),
});
