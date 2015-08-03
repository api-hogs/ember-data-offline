/* global start */
/* global stop */

import Ember from 'ember';
import { module, test } from 'qunit';
import { restJobMock } from '../../helpers/job';

const { RSVP } = Ember;

var subject;

module('Unit | Job | REST',  {
    beforeEach: function(){
    },
    afterEach: function(){
    }
});

test('rest job #find call adapter #find', function(assert) {
  assert.expect(4);
  //adapter.find was invoked.
  //store.pushPayload was invoked
  //job.perform
  //adapter.createOfflineJob was invoked.

  let job = restJobMock(assert, {name : 'find', args : 'foo'});

  stop();
  job.perform().then(() => {
    assert.ok(true,"job.perform");
    start();
  });
});

test('rest job #findAll call adapter #findAll', function(assert) {
  assert.expect(4);
  //adapter.find was invoked.
  //store.pushPayload was invoked
  //job.perform
  //adapter.createOfflineJob was invoked.

  let job = restJobMock(assert, {name : 'find'});

  stop();
  job.perform().then(() => {
    assert.ok(true,"job.perform");
    start();
  });
});

test('rest job #findAll call adapter #findAll', function(assert) {
  assert.expect(4);

  let job = restJobMock(assert, {name : 'findAll'});

  stop();
  job.perform().then(() => {
    assert.ok(true,"job.perform");
    start();
  });
});

test('rest job #findQuery call adapter #findQuery ', function(assert) {
  assert.expect(3);

  let job = restJobMock(assert, {name : 'findQuery', args  : { name : 'foo'}});

  stop();
  job.perform().then(() => {
    assert.ok(true,"job.perform");
    start();
  });
});

test('rest job #findMany call adapter #findMany', function(assert) {
  assert.expect(3);

  let job = restJobMock(assert, {name : 'findMany', args  : { name : 'foo', args: [1,2]}});

  stop();
  job.perform().then(() => {
    assert.ok(true,"job.perform");
    start();
  });
});

test('rest job #createRecord pass', function(assert) {
  assert.expect(6);

  let job = restJobMock(assert, {name : 'createRecord'});

  stop();
  job.perform().then(() => {
    assert.ok(true,"job.perform");
    start();
  });
});

test('rest job #updateRecord pass', function(assert) {
  assert.expect(2);

  let job = restJobMock(assert, {name : 'updateRecord'});

  stop();
  job.perform().then(() => {
    assert.ok(true,"job.perform");
    start();
  });
});

test('rest job #deleteRecord pass', function(assert) {
  assert.expect(2);

  let job = restJobMock(assert, {name : 'updateRecord'});

  stop();
  job.perform().then(() => {
    assert.ok(true,"job.perform");
    start();
  });
});
