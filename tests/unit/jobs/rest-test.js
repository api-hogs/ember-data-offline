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
  assert.expect(3);
  //adapter.find was invoked.
  //store.pushPayload was invoked
  //job.perform

  let job = restJobMock(assert, null,{name : 'find', args : 'foo'});

  stop();
  job.perform().then(() => {
    assert.ok(true,"job.perform");
    start();
  });
});

test('rest job #findAll call adapter #findAll', function(assert) {
  assert.expect(3);
  //adapter.find was invoked.
  //store.pushPayload was invoked
  //job.perform

  let job = restJobMock(assert, null,{name : 'find'});

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('rest job #findAll call adapter #findAll', function(assert) {
  assert.expect(3);

  let job = restJobMock(assert, null,{name : 'findAll'});

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('rest job #findQuery call adapter #findQuery ', function(assert) {
  assert.expect(3);

  let job = restJobMock(assert, null,{name : 'findQuery', args  : { name : 'foo'}});

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('rest job #findMany call adapter #findMany', function(assert) {
  assert.expect(3);

  let job = restJobMock(assert, null,{name : 'findMany', args  : { name : 'foo', args: [1,2]}});

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('rest job #createRecord pass', function(assert) {
  assert.expect(4);

  let job = restJobMock(assert, null,{name : 'createRecord'});

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('rest job #updateRecord pass', function(assert) {
  assert.expect(2);

  let job = restJobMock(assert, null,{name : 'updateRecord'});

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('rest job #deleteRecord pass', function(assert) {
  assert.expect(2);

  let job = restJobMock(assert, null,{name : 'updateRecord'});

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});
