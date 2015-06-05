/* global start */
/* global stop */

import Ember from 'ember';
import Job from 'ember-data-offline/job';
import { module, test } from 'qunit';

const { RSVP } = Ember;

var subject;

module('Unit | Job',  {
    beforeEach: function(){
      subject = Job.create({
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
  assert.expect(4);

  let passThisTest = function() {
    assert.ok(true, 'calls from success task');
    return true;
  };
  let successJob = Job.create({
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
  let failJob = Job.create({
    task: failedTask, 
  });
  
  stop();
  failJob.perform().catch(() => {
    assert.ok(true, 'task fails');
    start();
  });
});
