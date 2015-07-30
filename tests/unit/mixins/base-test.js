/* global start */
/* global stop */

import Ember from 'ember';
import BaseMixin from 'ember-data-offline/mixins/base';
import { module, test } from 'qunit';

const { RSVP } = Ember;

var subject;

var queueMock = Ember.Object.extend({
  add() {
    this.get('assert').ok(true, 'queue.add was invoked @' + this.get('encapsulatedIn'));
  }
});

var storeMock = Ember.Object.extend({
  lookupAdapter() {
    return Ember.Object.create({});
  }
});

module('Unit | Mixin | Base', {
  beforeEach: function() {
    subject = Ember.Object.createWithMixins(BaseMixin, { });
  },
  afterEach: function() {
    subject = null;
  }
});

test('#addToQueue with queue @ store ', (assert) => {
  assert.expect(1);

  let store = storeMock.create({
    EDOQueue: queueMock.create({
      assert: assert,
      encapsulatedIn: 'store'
    })
  });

  let job = Ember.Object.create({});
  subject.addToQueue(job, store, null);
});

test('#addToQueue with queue @ baseMixin ', (assert) => {
  assert.expect(1);

  let store = storeMock.create({});

  let job = Ember.Object.create({});

  subject.reopen({
    EDOQueue: queueMock.create({
      assert: assert,
      encapsulatedIn: 'baseMixin'
    })
  });

  subject.addToQueue(job, store, null);
});


test('creating jobs @ baseMixin ', (assert) => {
  assert.expect(2);

  let store = storeMock.create({
    EDOQueue: queueMock.create({
      assert: assert,
      encapsulatedIn: 'store'
    })
  });
  
  subject.createOnlineJob("find", [store, {modelName : 'bar'}, null, null], null);
  subject.createOfflineJob("find", [store, {modelName : 'bar'}, null, null], store);
});
