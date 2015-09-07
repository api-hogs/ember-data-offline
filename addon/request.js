import Ember from 'ember';
import baseMixin from 'ember-data-offline/mixins/base';
import jobMixin from 'ember-data-offline/mixins/job';
import ajaxJob from 'ember-data-offline/jobs/ajax';

export default Ember.Object.extend(baseMixin, {
  store: Ember.inject.service(),
  retryCount: 60,
  retryDelay: 30000,

  exec(url, method, data, params) {
    let store = this.get('store');

    if (this.get('isOffline')) {
      let job = ajaxJob.create({
        retryCount: this.get('retryCount'),
        retryDelay: this.get('retryDelay'),
        ajax: this.ajax,
        params: [url, method, data]
      });
      store.EDOQueue.add(job);

      if (params && typeof params === 'function') {
        let job = Ember.Object.extend(jobMixin).create({
          delay: 1,
          task: params
        });
        store.EDOQueue.add(job);
      }
    }

    return this.ajax(url, method, data);
  },

  _defaultParams() {
    let defaults = {
      type: "GET"
    };

    return Ember.merge(defaults/*this.sessionParams()*/);
  },

  sessionParams() {
    let session = this.container.lookup('simple-auth-sesion:main');
    if (!session || !session.get('isAuthenticated')) {
      return {};
    }
    return {
      headers: {
        "Authorization": 'UserId: ' + session.get('secure.userId'),
      }
    };
  },

  ajax: function(url, method, data) {
    let opts = {
      url: url,
      type: method
    };
    let params = Ember.merge(this._defaultParamsForOnline(), opts);
    if (data) {
      params.data = data;
    }
    return Ember.$.ajax(params);
  },
});
