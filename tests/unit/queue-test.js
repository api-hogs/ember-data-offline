import Ember from 'ember';
import Subject from 'ember-data-offline/queue';
import { module, test } from 'qunit';

const { Object: emberObject } = Ember;

var Job;
Job = Ember.Object.create({needRetry: false, retryCount: 0});

module('Unit | Queue',  {
    beforeEach: function(){
    },
    afterEach: function(){
    }
});

test('base setup success', function(assert) {
  assert.expect(4);
  let queue = Subject.create();
  assert.ok(queue);
  assert.equal(queue.get('pendingJobs').length, 0);
  assert.equal(queue.get('faltureJobs').length, 0);
  assert.equal(queue.get('retryJobs').length, 0);
});
