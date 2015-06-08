import Ember from 'ember';
import onlineJob from 'ember-data-offline/jobs/online';
import offlineJob from 'ember-data-offline/jobs/localstorage';
const { Mixin, $, on, assert, computed, get, isPresent } = Ember;

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
      adapter: this,
      method: method,
      params: params
    });
    this.addToQueue(job, store);
  },

  createOfflineJob(method, params, store){
    let job = this.get('offlineJob').create({
      adapter: this.get('offlineAdapter'),
      method: method,
      params: params
    });
    this.addToQueue(job, store);
  },

  findAll: function(store, typeClass, sinceToken) {
    if (this.get('isOffline')) {
      this.createOnlineJob('findAll', [store, typeClass, sinceToken], store);
      return this.get('offlineAdapter').findAll(store, typeClass, sinceToken);
    }

    let adapterResp = this._super.apply(this, arguments);
    this.createOfflineJob('findAll', [store, typeClass, sinceToken, adapterResp], store);
    return adapterResp;
  },

  find: function(store, typeClass, id, snapshot) {
    if (this.get('isOffline')) {
      return this.get('offlineAdapter').find(store, typeClass, id, snapshot);
    }
    let onlineResp = this._super.apply(this, arguments);
    this.createOfflineJob('find', [store, typeClass, id, snapshot, onlineResp], store);
    return onlineResp;
  },

  findQuery: function(store, type, query) {
    if (this.get('isOffline')) {
      return this.get('offlineAdapter').findQuery(store, type, query);
    }
    let onlineResp = this._super.apply(this, arguments);
    this.createOfflineJob('findQuery', [store, type, query, onlineResp], store);
    return onlineResp;
  },

  findMany: function(store, type, ids, snapshots) {
    if (this.get('isOffline')) {
      return this.get('offlineAdapter').find(store, type, ids, snapshots);
    }
    let onlineResp = this._super.apply(this, arguments);
    this.createOfflineJob('find', [store, type, ids, snapshots, onlineResp], store);
    return onlineResp;
  },

  createRecord(store, type, snapshot) {
    if (this.get('isOffline')) {
      //think about merge id....very important. maybe unload Record, and push Record...
      this.createOnlineJob('createRecord', [store, type, snapshot], store);
      return this.get('offlineAdapter').createRecord(store, type, snapshot);
    }

    let onlineResp = this._super.apply(this, arguments);
    this.createOfflineJob('createRecord', [store, type, snapshot, onlineResp], store);
    return onlineResp;
  },

  updateRecord(store, type, snapshot) {
    if (this.get('isOffline')) {
      this.createOnlineJob('updateRecord', [store, type, snapshot], store);
      return this.get('offlineAdapter').updateRecord(store, type, snapshot);
    }

    let onlineResp = this._super.apply(this, arguments);
    this.createOfflineJob('updateRecord', [store, type, snapshot, onlineResp], store);
    return onlineResp;
  },

  deleteRecord(store, type, snapshot) {
    if (this.get('isOffline')) {
      this.createOnlineJob('deleteRecord', [store, type, snapshot], store);
      return this.get('offlineAdapter').deleteRecord(store, type, snapshot);
    }

    let onlineResp = this._super.apply(this, arguments);
    this.createOfflineJob('deleteRecord', [store, type, snapshot, onlineResp], store);
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
