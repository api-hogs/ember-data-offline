import Ember from 'ember';
import LocalstorageJob from 'ember-data-offline/jobs/localstorage';

const { RSVP } = Ember;
var emberModelMock = Ember.Object.extend({
  _createSnapshot(){
    return {};
  }
});
var storeMock = Ember.Object.create({
  peekAll(){
    return Ember.A([
      emberModelMock.create({id: 'foo'})
    ]);
  },
  serializerFor(){
    return {
      primaryKey: 'id'
    };
  },
});
var snapshotMock = Ember.Object.create({});
var adapterKlass = Ember.Object.extend({
  find: function() {
    return RSVP.Promise.resolve();
  },
  persistData: function() {
    return true;
  },
});
var typeClassMock = {
  modelName: 'bar',
  typeKey: 'bar',
};
var mockLocastorageJob = function(offlineAdapterResponse, onlineAdapterResp, assert, method = 'find') {
  let offlineAdapter = adapterKlass.create({
      find() {
        return offlineAdapterResponse;
      },
      persistData() {
        assert.ok(true);
      },
      createRecord() {
        assert.ok(true);
      },
  });
  let job = LocalstorageJob.create({
    adapter: offlineAdapter,
  });
  job.set('method', method);

  let onlineAdapterResponse = RSVP.Promise.resolve(onlineAdapterResp);

  job.set('params', [storeMock, typeClassMock, 1, snapshotMock, onlineAdapterResponse]);

  if (method === 'findAll') {
    job.set('params', [storeMock, typeClassMock, 'sinceToken', onlineAdapterResponse]);
  }

  if (method === 'findQuery') {
    job.set('params', [storeMock, typeClassMock, {name: 'foo'}, onlineAdapterResponse]);
  }

  if (method === 'findMany') {
    job.set('params', [storeMock, typeClassMock, [1,2,3], 'sinceToken', onlineAdapterResponse]);
  }

  return job;
};

export {
  mockLocastorageJob
};
