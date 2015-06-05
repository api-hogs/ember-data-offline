import Ember from 'ember';
import { initialize } from '../../../initializers/queue';
import { initialize as initializeInstance  } from '../../../instance-initializers/queue';
import { module, test } from 'qunit';

var container, application, instance;

module('Unit | Instance initializer | queue', {
  beforeEach: function() {
    Ember.run(function() {
      application = Ember.Application.create();
      container = application.__container__;
      instance = application.__deprecatedInstance__;
      initialize(container, application);
      application.deferReadiness();
    });
  }
});

test('it works', function(assert) {
  assert.expect(1);
  
  initializeInstance(instance);
  let queue = container.lookup('store:main').get('queue');

  assert.ok(queue, 'Queue successfully injected in store');
});
