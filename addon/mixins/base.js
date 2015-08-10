/**
@module mixins
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
  Availability of the backend.
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
  Record cache expiration time. After expiration the record will be requested again
  rather than fetched from local storage.
  @property recordTTL
  @type {Object}
  **/
  recordTTL: moment.duration(12, 'hours'),
  /**
  Property that shows if you need to replace your record from record, extracted from payload or not
  @property skipCreateReplacing
  @type Boolean
  **/
  skipCreateReplacing: false,
  /**
  Used by adapter to get queue.

  Returns the syncronization job queue of an adapter or a store.
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
  Adds a job to the queue. If 'onDemandKey' param was passed, the job will be
  processed on-demand.

  @method addToQueue
  @param job {Job} job to add to queue.
  @param store {DS.Store}
  @param onDemandKey {String}
  **/
  addToQueue(job, store, onDemandKey) {
    this._workingQueue(store).add(job, onDemandKey);
  },

  /**
  Creates and adds an online job to the queue. If 'onDemandKey' param was passed, the job will be
  processed on-demand.

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
  Creates and adds an offline job to the queue. If 'onDemandKey' param was passed, the job will be
  processed on-demand.

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
