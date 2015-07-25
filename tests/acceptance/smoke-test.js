import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var App, users, cars, store;

module('Acceptance: Smoke Test', {
  beforeEach: function() {
    Ember.run(() => {
      window.localforage.clear();
    });
    App = startApp();
    users = server.createList('user', 2);
    cars = server.createList('car', 4);
    server.createList('city', 4);
    store = App.__container__.lookup('service:store');
  },
  afterEach: function() {
    Ember.run(App, 'destroy');
  }
});

test('localforage is populated on #findAll', function(assert) {
  assert.expect(6);

  visit('/');

  waitForRecordingModel('user');

  andThen(() => {
    return window.localforage.getItem('foo').then(result => {
      assert.equal(result.user.records[1].firstName, users[0].firstName, "Record 1 from server === record 1 in locaclforage");
      assert.equal(result.user.records[2].firstName, users[1].firstName, "Record 2 from server === record 2 in locaclforage");
      assert.equal(store.peekAll('user').get('firstObject').get('firstName'), users[0].firstName, "Record 1 in store === record 1 from server ");
      assert.equal(store.peekAll('user').get('lastObject').get('firstName'), users[1].firstName, "Record 2 in store === record 2 from server ");
      assert.equal(store.peekAll('user').get('firstObject').get('firstName'), result.user.records[1].firstName, "Record 1 in store === record 1 in localforage");
      assert.equal(store.peekAll('user').get('lastObject').get('firstName'), result.user.records[2].firstName, "Record 2 in store === record 2 in localforage");
    });
  });
});

test('localforage is populated on #find', function(assert) {
  assert.expect(3);

  visit('/users/1');

  waitForRecordingModel('user');

  andThen(() => {
    return window.localforage.getItem('foo').then(result => {
      assert.equal(result.user.records[1].firstName, users[0].firstName);
    });
  });

  waitForRecordingModel('car');

  andThen(() => {
    return window.localforage.getItem('foo').then(result => {
      assert.equal(result.car.records[1].label, cars[0].label);
      assert.equal(result.car.records[2].label, cars[1].label);
    });
  });
});
