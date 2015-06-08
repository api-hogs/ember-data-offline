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
   * `createRecord()`
   * `updateRecord()`
   * `deleteRecord()`
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

  findQuery: function(store, type, query) {
    if (this.get('isOffline')) {
      return this.get('offlineAdapter').findQuery(store, type, query);
    }
    let onlineResp = this._super.apply(this, arguments);
    this.createOfflineJob('findQuery', [store, type, query, onlineResp]);
    return onlineResp;
  },

  findMany: function(store, type, ids, snapshots) {
    if (this.get('isOffline')) {
      return this.get('offlineAdapter').find(store, type, ids, snapshots);
    }
    let onlineResp = this._super.apply(this, arguments);
    this.createOfflineJob('find', [store, type, ids, snapshots, onlineResp]);
    return onlineResp;
  },

  createRecord(store, type, snapshot) {
    //TODO check difference between online/offline there
    if (this.get('isOffline')) {
      this.createOnlineJob('createRecord', [store, type, snapshot]);
      return this.get('offlineAdapter').createRecord(store, type, snapshot);
    }
    this.createOnlineJob('createRecord', [store, type, snapshot]);
    return this.get('offlineAdapter').createRecord(store, type, snapshot);
  },

  updateRecord(store, type, snapshot) {
    //TODO check difference between online/offline there
    if (this.get('isOffline')) {
      this.createOnlineJob('updateRecord', [store, type, snapshot]);
      return this.get('offlineAdapter').updateRecord(store, type, snapshot);
    }
    this.createOnlineJob('updateRecord', [store, type, snapshot]);
    return this.get('offlineAdapter').updateRecord(store, type, snapshot);
  },

  deleteRecord(store, type, snapshot) {
    //TODO check difference between online/offline there
    if (this.get('isOffline')) {
      this.createOnlineJob('deleteRecord', [store, type, snapshot]);
      return this.get('offlineAdapter').deleteRecord(store, type, snapshot);
    }
    this.createOnlineJob('deleteRecord', [store, type, snapshot]);
    return this.get('offlineAdapter').deleteRecord(store, type, snapshot);
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
