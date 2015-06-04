/* global start */
/* global stop */

import Ember from 'ember';
import OfflineMixin from 'ember-data-offline/mixins/offline';
import { module, test } from 'qunit';
import { goOnline, goOffline } from '../../helpers/offline';

const { Object: emberObject } = Ember;

var AdapterMock;
var RESTAdapterMock = emberObject.create({

});
var LSAdapterMock = emberObject.create({

});

module('Unit | Mixin | offline',  {
    beforeEach: function(){
      AdapterMock = Ember.Object.extend(OfflineMixin, {
       onlineAdapter: RESTAdapterMock,
       offlineAdapter: LSAdapterMock,
      });
    },
    afterEach: function(){
      AdapterMock = null;
      goOnline();
    }
});

test('it works', function(assert) {
  assert.expect(2);

  var subject = AdapterMock.create();
  assert.ok(subject);
  assert.ok(subject.get('isOnline'), true);
});

test('it checks online', function(assert) {
  assert.expect(3);

  var subject = AdapterMock.create();

  assert.equal(subject.get('isOnline'), true, 'isOnline true when navigator is online');
  stop();
  goOffline().then(() => {
    assert.equal(subject.get('isOffline'), true, 'isOffline true when navigator is offline');
    assert.equal(subject.get('isOnline'), false, 'isOnline false when navigator is offline');
    start();
  });
});
