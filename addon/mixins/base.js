/**
@module ember-data-offline
**/

import Ember from 'ember';
import onlineJob from 'ember-data-offline/jobs/rest';
import offlineJob from 'ember-data-offline/jobs/localforage';
import moment from 'moment';

const { Mixin, $, on,  computed, get, isPresent } = Ember;

/**
@class Base
@constructor
**/
export default Mixin.create({
  /**
  Shows if adapter is offline.
  @property isOffline
  @type {boolean}
  **/
  isOffline: computed.not('isOnline'),
  /**
  @private
  @property onlineJob
  @type {Job}
  **/
  onlineJob: onlineJob,
  /**
  @private
  @property offlineJob
  @type {Job}
  **/
  offlineJob: offlineJob,
  /**
  The period of time during which record is considered to be not expired.
  @property recordTTL
  @type {Object}
  **/
  recordTTL: moment.duration(12, 'hours'),
  /**
  Used by adapter to get queue.

  Returns the working queue from an adapter. If there is no queue in adapter then returns queue from passed store.
  @private
  @method _workingQueue
  @param store {DS.Store}
  @returns {Queue}
  **/
  _workingQueue(store) {
    if (isPresent(get(this, 'EDOQueue'))) {
      return get(this, 'EDOQueue');
    } else {
      return get(store, 'EDOQueue');
    }
  },

  /**
  Adds job to queue. If onDemandKey param was passed, then job will be stored as 'onDemand'
  and will be processed on demand.

  @method addToQueue
  @param job {Job} job to add to queue.
  @param store {DS.Store}
  @param onDemandKey {String}
  **/
  addToQueue(job, store, onDemandKey) {
    this._workingQueue(store).add(job, onDemandKey);
  },

  /**
  Used by classes which use this class.

  Creates the online job and addes it to queue. If onDemandKey param was passed, then job will be stored as 'onDemand'
  and will be processed on demand.

  @method createOnlineJob
  @param method {String} the name of method which will be runned by job.
  @param params {Array}
  @param onDemandKey {String}
  **/
  createOnlineJob(method, params, onDemandKey) {
    let [store, typeClass] = params;
    let job = this.get('onlineJob').create({
      adapter: store.lookupAdapter(typeClass.modelName) || this.get('onlineAdapter'),
      method: method,
      params: params,
      retryCount: 3,
    });
    this.addToQueue(job, store, onDemandKey);
  },
  /**
  Used by classes which use this class.

  Creates the offline job and addes it to queue. If onDemandKey param was passed, then job will be stored as 'onDemand'
  and will be processed on demand.

  @method createOfflineJob
  @param method {String} the name of method which will be runned by job.
  @param params {Array}
  @param onDemandKey {String}
  **/
  createOfflineJob(method, params, store) {
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
