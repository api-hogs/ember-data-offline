import Ember from 'ember';
import onlineJob from 'ember-data-offline/jobs/online';
// import DS from 'ember-data';
const { Mixin, $, on, assert, computed, get, isPresent } = Ember;

export default Mixin.create({
  isOffline: computed.not('isOnline'),

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

  populatedLog: Ember.Object.create({}),
  persistData(typeClass, records){
    this.get('offlineAdapter').persistData(typeClass, records);
  },

  createOnlineJob(method, params){
    onlineJob.create({
      adapter: this,
      method: method,
      params: params
    });
  },

  createOfflineJob(){
    //for create, update...or maybe this we don't need
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
    let isPopulated = this.get(`populatedLog.${typeClass}`);
    if (this.get('isOffline')) {
      this.createOnlineJob('findAll', [store, typeClass, sinceToken]);
      return this.get('offlineAdapter').findAll(store, typeClass, sinceToken);
    }

    let adapterResp = this._super.apply(this, arguments);

    if (isPopulated){
      return adapterResp;
    }
    adapterResp.then(records => {
      this.persistData(typeClass, records);
      this.set(`populatedLog.${typeClass}`, true);
    });
    return adapterResp;
  },

  find: function(store, type, id, snapshot) {
    if (this.get('isOnline')) {
      let onlineResp = this._super.apply(this, arguments);
      let adapter = this;
      //check offline storage
      Ember.RSVP.resolve().then(() => {
        return this.get('offlineAdapter').find(store, type, id, snapshot);
      }).then(offineRecord => {
        if (Ember.isEmpty(offineRecord)) {
          return adapterResp;
        }
      }).then(onlineRecord => {
        if (!Ember.isEmpty(onlineRecord)) {
          this.get('offlineAdapter').persistData(typeClass, onlineRecord);
        }
      }).catch(() => {
          onlineResp.then(onlineRecord => {
            if (!Ember.isEmpty(onlineRecord)) {
              adapter.get('offlineAdapter').persistData(typeClass, onlineRecord);
            }
          });
      });

      return onlineResp;
    } else {
      return this.get('offlineAdapter').find(store, type, id, snapshot);
    }
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
