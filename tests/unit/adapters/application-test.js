import Ember from 'ember';
import OfflineAdapter from 'ember-data-offline/adapters/main';
import { module, test } from 'qunit';

const { Object: emberObject } = Ember;

var RESTAdapterMock = emberObject.create({

});
var LSAdapterMock = emberObject.create({

});

var Adapter;

module('Unit | Adapter | application', {
  beforeEach: function() {
    Adapter = OfflineAdapter.create({
      onlineAdapter: RESTAdapterMock,
      offlineAdapter: LSAdapterMock,
    });
  },
  afterEach: function() {
    Adapter = null;
  }
});

test('it exists', function(assert) {
  assert.expect(1);
  assert.ok(Adapter);
});
