import request from 'ember-data-offline/request';
import { module, test } from 'qunit';

module('Unit | Request');

test('it works', function(assert) {
  let subject = request.create();
  let res = subject._defaultParams();
  console.log('sfsdfs', res)
  assert.ok(true);
});
