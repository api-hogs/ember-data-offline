import Ember from 'ember';
import onlineJob from 'ember-data-offline/jobs/online';
import offlineJob from 'ember-data-offline/jobs/localstorage';
const { Mixin, $, on,  computed, get, isPresent } = Ember;

export default Mixin.create({
  isOffline: computed.not('isOnline'),
  onlineJob: onlineJob,
  offlineJob: offlineJob,

  _workingQueue(store){
    if (isPresent(get(this, 'queue'))) {
      return get(this, 'queue');
    } else {
      return get(store, 'queue');
    }
  },

  addToQueue(job, store){
    this._workingQueue(store).add(job);
  },

  createOnlineJob(method, params, store){
    let job = this.get('onlineJob').create({
      adapter: this.get('onlineAdapter'),
      method: method,
      params: params
    });
    this.addToQueue(job, store);
  },

  createOfflineJob(method, params, store){
    let job = this.get('offlineJob').create({
      adapter: this.get('offlineAdapter'),
      store: store,
      method: method,
      params: params,
        delay: 20,
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

