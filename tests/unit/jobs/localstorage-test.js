/* global start */
/* global stop */

import Ember from 'ember';
import LocalstorageJob from 'ember-data-offline/jobs/localstorage';
import { module, test } from 'qunit';

const { RSVP } = Ember;

var subject;
var storeMock = Ember.Object.create({
});
var snapshotMock = Ember.Object.create({
});
var adapterKlass = Ember.Object.extend({
  find: function() {
    return RSVP.Promise.resolve();
  },
  persistData: function() {
    return true;
  },
});

module('Unit | Job | Localstorage',  {
    beforeEach: function(){
    },
    afterEach: function(){
    }
});

test('it pass when there is record from offline storage', function(assert) {
  assert.expect(1);

  let adapterMock = adapterKlass.create({
    offlineAdapter: adapterKlass.create({
      find() {
        return RSVP.Promise.resolve({id: 2});
      },
      persistData() {
        assert.ok(true);
      },
    }),
  });
  let job = LocalstorageJob.create({
    adapter: adapterMock,
  });
  job.set('method', 'find');
  job.set('params', [storeMock, 'bar', 1, snapshotMock, null]);

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('it persists when there is record from online storage that absent in offline', function(assert) {
  assert.expect(2);

  let adapterMock = adapterKlass.create({
    offlineAdapter: adapterKlass.create({
      find() {
        return RSVP.Promise.resolve(null);
      },
      persistData() {
        assert.ok(true);
      },
    }),
  });
  let job = LocalstorageJob.create({
    adapter: adapterMock,
  });
  let onlineRespMock = RSVP.Promise.resolve({id: 'foo'});
  job.set('method', 'find');
  job.set('params', [storeMock, 'bar', 1, snapshotMock, onlineRespMock]);

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('it pass when empty response from online', function(assert) {
  assert.expect(1);

  let adapterMock = adapterKlass.create({
    offlineAdapter: adapterKlass.create({
      find() {
        return RSVP.Promise.resolve(null);
      },
      persistData() {
        assert.ok(true);
      },
    }),
  });
  let job = LocalstorageJob.create({
    adapter: adapterMock,
  });
  job.set('method', 'find');
  job.set('params', [storeMock, 'bar', 1, snapshotMock, null]);

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('it pass when error in offline and no online record', function(assert) {
  assert.expect(1);

  let adapterMock = adapterKlass.create({
    offlineAdapter: adapterKlass.create({
      find() {
        return RSVP.Promise.reject();
      },
      persistData() {
        assert.ok(true);
      },
    }),
  });
  let job = LocalstorageJob.create({
    adapter: adapterMock,
  });
  job.set('method', 'find');
  job.set('params', [storeMock, 'bar', 1, snapshotMock, RSVP.Promise.resolve(null)]);

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});

test('it persists when error in offline and found online record', function(assert) {
  assert.expect(2);

  let adapterMock = adapterKlass.create({
    offlineAdapter: adapterKlass.create({
      find() {
        return RSVP.Promise.reject();
      },
      persistData() {
        assert.ok(true);
      },
    }),
  });
  let job = LocalstorageJob.create({
    adapter: adapterMock,
  });
  job.set('method', 'find');
  job.set('params', [storeMock, 'bar', 1, snapshotMock, RSVP.Promise.resolve({id: 1})]);

  stop();
  job.perform().then(() => {
    assert.ok(true);
    start();
  });
});
