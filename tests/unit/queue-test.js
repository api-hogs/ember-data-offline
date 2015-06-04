/* global stop, start */
import Ember from 'ember';
import Subject from 'ember-data-offline/queue';
import { module, test } from 'qunit';

const { Object: emberObject } = Ember;

var Job;
Job = Ember.Object.create({needRetry: false, retryCount: 0});
var queue;

module('Unit | Queue',  {
    beforeEach: function(){
      queue = Subject.create({
        retryOnFailureDelay: 0,
        delay: 0
      });
    },
    afterEach: function(){
      queue = null;
    }
});

test('base setup success', function(assert) {
  assert.expect(4);
  assert.ok(queue);
  assert.equal(queue.get('pendingJobs').length, 0);
  assert.equal(queue.get('faltureJobs').length, 0);
  assert.equal(queue.get('retryJobs').length, 0);
});

test('retry job in queue', function(assert){
  assert.expect(2);
  let queue = Subject.create({
        delay: 100,
        retryOnFailureDelay: 150,
  });
  let jobKlass = Ember.Object.extend({
    perform: function(){
      return Ember.RSVP.Promise.reject();
    }
  });
  let job = jobKlass.create({needRetry: true, retryCount: 1});
  queue.add(job);
  assert.equal(queue.get('pendingJobs').length, 1);
  stop();
  Ember.run.later(() => {
    assert.equal(queue.get('retryJobs').length, 1);
    start();
  }, 150);
});
