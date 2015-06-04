import Ember from 'ember';
const { Mixin, $, on, assert, computed, get } = Ember;

export default Mixin.create({
  isOffline: computed.not('isOnline'),

  checkOnline: function() {
    let isOnline = window.navigator.onLine;
    this.set('isOnline', isOnline);
    return isOnline;
  },

  assertRunner: on('init', function() {
    assert('[ember-data-offline] You should set offline adapter', get(this, 'offlineAdapter'));
    assert('[ember-data-offline] You should set online adapter', get(this, 'onlineAdapter'));
  }),
    
  setup: on('init', function() {
    $(window).on('online', () => {
      this.checkOnline();
    });
    $(window).on('offline', () => {
      this.checkOnline();
    });
    this.checkOnline();
  }),

  teardown: on('willDestroy', function() {
    $(window).off('online');
    $(window).off('offline');
  }),
});


