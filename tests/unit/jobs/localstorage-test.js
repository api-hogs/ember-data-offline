/* global start */
/* global stop */

import Ember from 'ember';
import { module, test } from 'qunit';
import { mockLocastorageJob } from '../../helpers/job';
import LocalstorageJob from 'ember-data-offline/jobs/localstorage';

const { RSVP } = Ember;

var subject;

module('Unit | Job | Localstorage',  {
    beforeEach: function(){
    },
    afterEach: function(){
    }
});

test('#find pass when there is record from offline storage', function(assert) {
  assert.expect(1);

  let job = mockLocastorageJob(RSVP.Promise.resolve({id: 2}), null, assert);

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('#find persists when there is record from online storage that absent in offline', function(assert) {
  assert.expect(2);

  let job = mockLocastorageJob(RSVP.Promise.resolve(null), {id: 'foo'}, assert);

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('#find pass when empty response from online', function(assert) {
  assert.expect(1);

  let job = mockLocastorageJob(RSVP.Promise.resolve(null), null, assert);

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('#find pass when error in offline and no online record', function(assert) {
  assert.expect(1);

  let job = mockLocastorageJob(RSVP.Promise.reject(), RSVP.Promise.resolve(null), assert);

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('#find persists when error in offline and found online record', function(assert) {
  assert.expect(2);

  let job = mockLocastorageJob(RSVP.Promise.reject(), RSVP.Promise.resolve({id: 'foo'}), assert);

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('#findAll persists when there are online records', function(assert) {
  assert.expect(2);

  let job = mockLocastorageJob(null, RSVP.Promise.resolve({id: 'foo'}), assert, 'findAll');

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('#findAll pass when there are not online records', function(assert) {
  assert.expect(1);

  let job = mockLocastorageJob(null, RSVP.Promise.resolve(null), assert, 'findAll');

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('#findQuery pass when there is record from offline storage', function(assert) {
  assert.expect(1);

  let job = mockLocastorageJob(RSVP.Promise.resolve({id: 2}), null, assert, 'findQuery');

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('#findQuery persists when there is record from online storage that absent in offline', function(assert) {
  assert.expect(2);

  let job = mockLocastorageJob(RSVP.Promise.resolve(null), {id: 'foo'}, assert, 'findQuery');

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('#findQuery pass when empty response from online', function(assert) {
  assert.expect(1);

  let job = mockLocastorageJob(RSVP.Promise.resolve(null), null, assert, 'findQuery');

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('#findQuery pass when error in offline and no online record', function(assert) {
  assert.expect(1);

  let job = mockLocastorageJob(RSVP.Promise.reject(), RSVP.Promise.resolve(null), assert, 'findQuery');

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('#findQuery persists when error in offline and found online record', function(assert) {
  assert.expect(2);

  let job = mockLocastorageJob(RSVP.Promise.reject(), RSVP.Promise.resolve({id: 'foo'}), assert, 'findQuery');

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('#findMany pass when there is record from offline storage', function(assert) {
  assert.expect(1);

  let job = mockLocastorageJob(RSVP.Promise.resolve({id: 2}), null, assert, 'findMany');

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('#findMany persists when there is record from online storage that absent in offline', function(assert) {
  assert.expect(2);

  let job = mockLocastorageJob(RSVP.Promise.resolve(null), {id: 'foo'}, assert, 'findMany');

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('#findMany pass when empty response from online', function(assert) {
  assert.expect(1);

  let job = mockLocastorageJob(RSVP.Promise.resolve(null), null, assert, 'findMany');

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('#findMany pass when error in offline and no online record', function(assert) {
  assert.expect(1);

  let job = mockLocastorageJob(RSVP.Promise.reject(), RSVP.Promise.resolve(null), assert, 'findMany');

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('#findMany persists when error in offline and found online record', function(assert) {
  assert.expect(2);

  let job = mockLocastorageJob(RSVP.Promise.reject(), RSVP.Promise.resolve({id: 'foo'}), assert, 'findMany');

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});
