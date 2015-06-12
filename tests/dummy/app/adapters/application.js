import DS from 'ember-data';
import Ember from 'ember';
import offlineMixin from 'ember-data-offline/mixins/offline';
import onlineMixin from 'ember-data-offline/mixins/online';

var localAdapter = DS.LSAdapter.extend({
  namespace: 'dummy'
});
var adapter = DS.RESTAdapter.extend(onlineMixin, {
  ajaxError: function(jqXHR, responseText, errorThrown) {
    var isObject = jqXHR !== null && typeof jqXHR === 'object';

    console.log('NDKKDKDKDKD')
    if (isObject) {
      jqXHR.then = null;
      if (!jqXHR.errorThrown) {
        if (typeof errorThrown === 'string') {
          jqXHR.errorThrown = new Error(errorThrown);
        } else {
          jqXHR.errorThrown = errorThrown;
        }
      }
    }

    return jqXHR;
  },
  offlineAdapter: Ember.computed(function() {
    let adapter = this;
    return localAdapter.extend(offlineMixin).create({
      onlineAdapter: adapter,
      container: this.container,
      serializer: DS.LSSerializer.extend().create({
        container: this.container,
      }),
      findQuery: function (store, type, query, recordArray) {
        var namespace = this._namespaceForType(type);
        var _results = this.query(namespace.records, query);

        let results = Ember.A(_results);

        if (results.get('length')) {
          return this.loadRelationshipsForMany(type, results);
        } else {
          return Ember.RSVP.reject();
        }
      },
    });
  }),
});
export default adapter;
