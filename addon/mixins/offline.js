import Ember from 'ember';
import onlineJob from 'ember-data-offline/jobs/online';
import offlineJob from 'ember-data-offline/jobs/localstorage';
// import DS from 'ember-data';
const { Mixin, $, on, assert, computed, get, isPresent } = Ember;

export default Mixin.create({
  isOffline: computed.not('isOnline'),
  onlineJob: onlineJob,
  offlineJob: offlineJob,

  store: computed({
    get() {
      return this.container.lookup('store:main');
    }
  }),
  _workingQueue: computed('queue', {
    get() {
      if (isPresent(get(this, 'queue'))) {
        return get(this, 'queue');
      } else {
        return get(this, 'store.queue');
      }
    }
  }),

  addToQueue(job){
    console.log(job);
  },

  createOnlineJob(method, params){
    let job = this.get('onlineJob').create({
      adapter: this,
      method: method,
      params: params
    });
    this.addToQueue(job);
  },

  createOfflineJob(method, params){
    let job = this.get('offlineJob').create({
      adapter: this.get('offlineAdapter'),
      method: method,
      params: params
    });
    this.addToQueue(job);
  },

  /*
   * `find()`
   * `createRecord()`
   * `updateRecord()`
   * `deleteRecord()`
   * `findAll()` -- done some
   * `findQuery()`
   */

  findAll: function(store, typeClass, sinceToken) {
    if (this.get('isOffline')) {
      this.createOnlineJob('findAll', [store, typeClass, sinceToken]);
      return this.get('offlineAdapter').findAll(store, typeClass, sinceToken);
    }

    let adapterResp = this._super.apply(this, arguments);
    this.createOfflineJob('findAll', [store, typeClass, sinceToken, adapterResp]);
    return adapterResp;
  },

  find: function(store, typeClass, id, snapshot) {
    if (this.get('isOffline')) {
      return this.get('offlineAdapter').find(store, typeClass, id, snapshot);
    }
    let onlineResp = this._super.apply(this, arguments);
    this.createOfflineJob('find', [store, typeClass, id, snapshot, onlineResp]);
    return onlineResp;
  },

  assertRunner: on('init', function() {
    assert('[ember-data-offline] You should set offline adapter', get(this, 'offlineAdapter'));
  }),

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
