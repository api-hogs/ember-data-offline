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

  findAll: function(store, typeClass, sinceToken) {
    if (this.get('isOnline')) {
      let adapterResp = this._super.apply(this, arguments);
      let isPopulated = this.get('isPopulated');
      let adapter = this;

      if (!isPopulated) {
        run.once(() => {
          adapterResp.then(records => {
            adapter.get('offlineAdapter').persistData(typeClass, records);
            this.set('isPopulated', true);
          });
        });
      }
      return adapterResp;
    } else {
      return this.get('offlineAdapter').findAll(store, typeClass, sinceToken);
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
