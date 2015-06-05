/* global start */
/* global stop */

import Ember from 'ember';
import Job from 'ember-data-offline/job';
import { module, test } from 'qunit';

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

test('#perform returns resolving Promise', function(assert) {
  assert.expect(1);

  stop();
  subject.perform().then(() => {
    assert.ok(true, 'perform always resolves');
    start();
  });
});
