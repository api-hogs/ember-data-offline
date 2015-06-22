import Ember from 'ember';
import { initialize } from 'dummy/initializers/queue';
import { module, test } from 'qunit';

var container, application;

module('Unit | Initializer | queue', {
  beforeEach: function() {
    Ember.run(function() {
      application = Ember.Application.create();
      container = application.__container__;
      application.deferReadiness();
    });
  }
});

test('it works', function(assert) {
  assert.expect(1);
  
  initialize(container, application);
  let queue = container.lookup('data-offline-queue:main');

  assert.ok(queue, 'Queue successfully registered in container');
});
