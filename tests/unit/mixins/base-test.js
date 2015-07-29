/* global start */
/* global stop */

import Ember from 'ember';
import BaseMixin from 'ember-data-offline/mixins/base';
import { module, test } from 'qunit';
import { goOnline, goOffline, getStoreMock, getQueueMock } from '../../helpers/base';


const { RSVP } = Ember;

var subject;

module('Unit | Mixin | Base', {
  beforeEach: function() {
    subject = Ember.Object.createWithMixins(BaseMixin);
    goOnline();
  },
  afterEach: function() {
    subject = null;
  }
});

test('it checks online/offline', (assert) => {
  assert.expect(3);

  assert.equal(subject.get('isOnline'), true, 'isOnline true when navigator is online');
  stop();
  goOffline().then(() => {
    assert.equal(subject.get('isOffline'), true, 'isOffline true when navigator is offline');
    assert.equal(subject.get('isOnline'), false, 'isOnline false when navigator is offline');
    start();
  });
});

test('#addToQueue adds job to queue @ store ', (assert) => {
  assert.expect(1);

  let store = getStoreMock();
  store.EDOQueue = getQueueMock(assert, 'store');

  let job = Ember.Object.create({});

  subject.addToQueue(job, store, null);
});

test('#addToQueue adds job to queue @ baseMixin ', (assert) => {
  assert.expect(1);

  let job = Ember.Object.create({});
  let store = getStoreMock();
  subject.EDOQueue = getQueueMock(assert,'baseMixin');

  subject.addToQueue(job, store, null);
});


test('it creates jobs', (assert) => {
  assert.expect(2);

  let store = getStoreMock();
  store.EDOQueue = getQueueMock(assert, store);

  subject.createOnlineJob("find", [store, {modelName : 'bar'}, null, null], null);
  subject.createOfflineJob("find", [store, {modelName : 'bar'}, null, null], store);
});
