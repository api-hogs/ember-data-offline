import Ember from 'ember';
import baseMixin from 'ember-data-offline/mixins/base';
import jobMixin from 'ember-data-offline/mixins/job';
import ajaxJob from 'ember-data-offline/jobs/ajax';

export default Ember.Object.extend(baseMixin, {
  store: Ember.inject.service(),

  exec(url, method, data, params) {
    let store = this.get('store');

    if (this.get('isOffline')) {
      let job = ajaxJob.create({
        retryCount: 20,
        retryDelay: 1800000,
        ajax: this.ajax,
        params: [url, method, data]
      });
      store.EDOQueue.add(job);

      if (params && typeof params === 'function') {
        let job = Ember.Object.extend(jobMixin).create({
          task: params
        });
        store.EDOQueue.add(job);
      }
    }

    return this.ajax(url, method, data);
  },

  _defaultParamsForOnline: Ember.computed({
    get() {
      let session = this.container.lookup('simple-auth-sesion:main');
      let defaults = {
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
      };
      if (session && session.get('isAuthenticated')) {
        defaults.headers = {
          "Authorization": 'UserId: ' + session.get('secure.userId'),
        };
      }
      return defaults;
    }
  }),

  ajax: function(url, method, data) {
    let opts = {
      url: url,
      type: method
    };
    let params = Ember.merge(this._defaultParamsForOnline, opts);
    if (data) {
      params.data = data;
    }
    return Ember.$.ajax(params);
  },
});
