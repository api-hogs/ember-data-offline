import Ember from 'ember';
import onlineJob from 'ember-data-offline/jobs/rest';
import offlineJob from 'ember-data-offline/jobs/localforage';
import moment from 'moment';

const { Mixin, $, on,  computed, get, isPresent } = Ember;

export default Mixin.create({
  isOffline: computed.not('isOnline'),
  onlineJob: onlineJob,
  offlineJob: offlineJob,

  recordTTL: moment.duration(12, 'hours'),

  lastTimeFetched: Ember.Object.create({}),

  _workingQueue(store){
    if (isPresent(get(this, 'EDOQueue'))) {
      return get(this, 'EDOQueue');
    } else {
      return get(store, 'EDOQueue');
    }
  },

  addToQueue(job, store){
    this._workingQueue(store).add(job);
  },

  createOnlineJob(method, params){
    let [store, typeClass] = params;
    let job = this.get('onlineJob').create({
      adapter: store.lookupAdapter(typeClass.modelName) || this.get('onlineAdapter'),
      method: method,
      params: params,
      retryCount: 3,
    });
    this.addToQueue(job, store);
  },

  createOfflineJob(method, params, store){
    let job = this.get('offlineJob').create({
      adapter: this.get('offlineAdapter'),
      store: store,
      method: method,
      params: params,
    });
    this.addToQueue(job, store);
  },

  setup: on('init', function() {
    $(window).on('online', () => {
      this.set('isOnline', true);
    });
    $(window).on('offline', () => {
      this.set('isOnline', false);
    });
    this.set('isOnline', window.navigator.onLine);
  }),

  teardown: on('willDestroy', function() {
    $(window).off('online');
    $(window).off('offline');
  }),
});

