import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import { assertRecordMeta, assertCollectionMeta } from '../helpers/assert-meta';
import { getLFObjectInfo } from '../helpers/lf-utils';

var App, store;

module('Acceptance: Stress Test', {
  beforeEach: function() {
    Ember.run(() => {
      window.localforage.clear();
    });
    App = startApp();

    server.createList('user', 1000);
    server.createList('car', 1000);
    server.createList('company', 1000);
    server.createList('office', 1000);
    server.createList('city', 1000);

    store = App.__container__.lookup('service:store');
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('findAll', function(assert) {
  assert.expect(10);

  visit('/stress');

  waitForRecordingModel('car', 3);

  andThen(() => {
    return window.localforage.getItem('foo').then(result => {
      assert.equal(getLFObjectInfo(result.car.records).length, 1000);
      assertCollectionMeta(result.car, assert);

      assert.equal(getLFObjectInfo(result.city.records).length, 1000);
      assertCollectionMeta(result.city, assert);

      assert.equal(getLFObjectInfo(result.company.records).length, 1000);
      assertCollectionMeta(result.company, assert);
    });
  });

  waitForRecordingModel('user');

  andThen(() => {
    return window.localforage.getItem('foo').then(result => {
      assert.equal(getLFObjectInfo(result.user.records).length, 1000);
      assertCollectionMeta(result.user, assert);
    });
  });

  waitForRecordingModel('office');

  andThen(() => {
    return window.localforage.getItem('foo').then(result => {
      assert.equal(getLFObjectInfo(result.office.records).length, 1000);
      assertCollectionMeta(result.office, assert);
    });
  });
});
