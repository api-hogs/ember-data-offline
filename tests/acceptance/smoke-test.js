/* global start */
/* global stop */

import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

var App, users, cars, store;

module('Acceptance: Smoke Test', {
  beforeEach: function() {
    App = startApp();
    users = server.createList('user', 2);
    cars = server.createList('car', 4);
    store = App.__container__.lookup('service:store');
  },
  afterEach: function() {
    Ember.run(() => {
      window.localforage.setItem("foo", "");
    });
    Ember.run(App, 'destroy');
  }
});

test('localforage is populated on #findAll', function(assert) {
  assert.expect(6);

  visit('/');
  stop();
  andThen(() => {


    Ember.run.later(() => {
      store = App.__container__.lookup('service:store');

      let lfItems = window.localforage.getItem("foo");

      return lfItems.then(result => {
        assert.equal(result.user.records[1].firstName, users[0].firstName, "Record 1 from server === record 1 in locaclforage");
        assert.equal(result.user.records[2].firstName, users[1].firstName, "Record 2 from server === record 2 in locaclforage");
        assert.equal(store.peekAll('user').get('firstObject').get('firstName'), users[0].firstName, "Record 1 in store === record 1 from server ");
        assert.equal(store.peekAll('user').get('lastObject').get('firstName'), users[1].firstName, "Record 2 in store === record 2 from server ");
        assert.equal(store.peekAll('user').get('firstObject').get('firstName'), result.user.records[1].firstName, "Record 1 in store === record 1 in localforage");
        assert.equal(store.peekAll('user').get('lastObject').get('firstName'), result.user.records[2].firstName, "Record 2 in store === record 2 in localforage");
        start();
      });
    },3000);
  });
});

//test('localforage is populated on #find', function(assert) {
//  assert.expect(2);
//  visit('/users/1');

//  stop();
//  andThen(() => {

//    Ember.run.later(() => {
//      let lfItems = window.localforage.getItem("foo");
//      return lfItems.then(result => {
//        console.log(JSON.stringify(result));
//        assert.equal(result.car.records[1].label, cars[0].label);
//        assert.equal(result.car.records[2].label, cars[1].label);
//        start();
//      });
//    },4500);
//  });
//});
