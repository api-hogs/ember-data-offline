/* global start */
/* global stop */

import Ember from 'ember';
import JobMixin from 'ember-data-offline/mixins/job';
import { module, test } from 'qunit';

const { RSVP } = Ember;

var subject;

module('Unit | Mixin | Job',  {
    beforeEach: function(){
      subject = Ember.Object.createWithMixins(JobMixin, {
        retryCount: 1,
      });
    },
    afterEach: function(){
      subject = null;
    }
});

test('it works', function(assert) {
  assert.expect(1);
  assert.ok(subject);
});

test('it computes needRetry', function(assert) {
  assert.expect(2);
  assert.equal(subject.get('needRetry'), true, 'needRetry true when retryCount > 0');
  subject.decrementProperty('retryCount');
  assert.equal(subject.get('needRetry'), false, 'needRetry false when retryCount == 0');
});

test('#perform returns resolving Promise on default', function(assert) {
  assert.expect(1);

  stop();
  subject.perform().then(() => {
    assert.ok(true, 'perform always resolves');
    start();
  });
});

test('#perform runs task function', function(assert) {
  assert.expect(6);

  let passThisTest = function() {
    assert.ok(true, 'calls from success task');
    return true;
  };
  let successJob = Ember.Object.createWithMixins(JobMixin, {
    task: passThisTest,
  });

  stop();
  successJob.perform().then(() => {
    assert.ok(true, 'perform always resolves');
    start();
  });

  let failedTask = function() {
    assert.ok(true, 'calls from failing task');
    return RSVP.Promise.reject();
  };
  let failJob = Ember.Object.createWithMixins(JobMixin, {
    task: failedTask,
  });

  stop();
  failJob.perform().catch(() => {
    assert.ok(true, 'task fails');
    start();
  });

  let returnValue = function() {
    assert.ok(true, 'calls from value task');
    return RSVP.Promise.resolve('value');
  };
  let returnValueJob = Ember.Object.createWithMixins(JobMixin, {
    task: returnValue,
  });

  stop();
  returnValueJob.perform().then(val => {
    assert.equal('value', val, 'values are equal');
    start();
  });
});
