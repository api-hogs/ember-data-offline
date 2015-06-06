import Ember from 'ember';
import LocalstorageJob from 'ember-data-offline/jobs/localstorage';

const { RSVP } = Ember;

var storeMock = Ember.Object.create({});
var snapshotMock = Ember.Object.create({});
var adapterKlass = Ember.Object.extend({
  find: function() {
    return RSVP.Promise.resolve();
  },
  persistData: function() {
    return true;
  },
});
var mockJob = function(offlineAdapterResponse, onlineAdapterResponse, assert, method='find') {
  let adapterMock = adapterKlass.create({
    offlineAdapter: adapterKlass.create({
      find() {
        return offlineAdapterResponse;
      },
      persistData() {
        assert.ok(true);
      },
    }),
  });
  let job = LocalstorageJob.create({
    adapter: adapterMock,
  });
  job.set('method', method);

  job.set('params', [storeMock, 'bar', 1, snapshotMock, onlineAdapterResponse]);

  if (method === 'findAll') {
    job.set('params', [storeMock, 'bar', 'sinceToken', onlineAdapterResponse]);
  }

  return job;
};

export { mockJob };
