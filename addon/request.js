import Ember from 'ember';
import baseMixin from 'ember-data-offline/mixins/base';
import jobMixin from 'ember-data-offline/mixins/job';
import ajaxJob from 'ember-data-offline/jobs/ajax';

export default Ember.Object.extend(baseMixin, {
  store: Ember.inject.service(),
  retryCount: 60,
  retryDelay: 30000,

  exec(opts, syncs) {
    let params = Ember.merge(this._defaultParams(), opts);

    if (this.get('isOnline')) {
      return Ember.$.ajax(params);
    }

    return this._offlineScenario(params, syncs);
  },

  _offlineScenario(params, syncs) {
    let store = this.get('store');

    let job = ajaxJob.create({
      retryCount: this.get('retryCount'),
      retryDelay: this.get('retryDelay'),
      params: params
    });
    store.EDOQueue.add(job);

    if (syncs && typeof syncs === 'function') {
      let job = Ember.Object.extend(jobMixin).create({
        delay: 1,
        task: syncs
      });
      store.EDOQueue.add(job);
    }

    return Ember.RSVP.Promise.resolve();
  },

  _defaultParams() {
    let defaults = {
      type: "GET"
    };

    return Ember.merge(defaults, this.sessionParams());
  },

  sessionParams() {
    return {};
  },
});
