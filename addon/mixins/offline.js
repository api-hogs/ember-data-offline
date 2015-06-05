import Ember from 'ember';
import DS from 'ember-data';
const { Mixin, $, on, assert, computed, get, isPresent, run } = Ember;

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

  /*
   * `find()`
   * `createRecord()`
   * `updateRecord()`
   * `deleteRecord()`
   * `findAll()` -- done some
   * `findQuery()`
   */

  findAll: function(store, type, ...others) {
    if (this.get('isOnline')) {
      let adapterResp = this._super.apply(this, arguments);
      let typeClass = type.modelName;
      let adapter = this;
      let isPopulated = this.get('isPopulated');

      if (!isPopulated) {
        run.once(() => {
          console.log("Populate offline store")
          adapterResp.then(records => {
            let serializer = store.serializerFor(type.modelName);
            // TODO let serializedRecords = records[serializer.modelNameFromPayloadKey(typeClass)];
            for (var prop in records) {
              var modelName = prop;
              let array = records[modelName];
              array.forEach(record => {
                let storeRecord = store.createRecord(typeClass, record);
                let snapshot = new DS.Snapshot(storeRecord);

                adapter.get('offlineAdapter').createRecord(store, type, snapshot);
              });
            }
            this.set('isPopulated', true);
          });
        });
      }
      return adapterResp;
    } else {
      return this.get('offlineAdapter').findAll(arguments);
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
