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
  peekRecord(){
    return emberModelMock.create({id: 'foo'});
  },
  serializerFor(){
    return {
      primaryKey: 'id',
      normalizePayload(payload) {
        return payload;
      },
      modelNameFromPayloadKey(key) {
        return key;
      }
    };
  },
});
var snapshotMock = Ember.Object.create({});
var adapterKlass = Ember.Object.extend({
  find: function() {
    return RSVP.Promise.resolve();
  },
});
var typeClassMock = {
  modelName: 'bar',
};
var mockLocastorageJob = function(assert, onlineAdapterResp, method = 'find') {
  let offlineAdapter = adapterKlass.create({
      createRecord() {
        assert.ok(true);
      },
  });
  let job = LocalstorageJob.create({
    adapter: offlineAdapter,
  });
  job.set('method', method);

  job.set('params', [storeMock, typeClassMock, 1, snapshotMock, onlineAdapterResp]);

  if (method === 'findAll') {
    job.set('params', [storeMock, typeClassMock, 'sinceToken', onlineAdapterResp]);
  }

  if (method === 'findQuery') {
    job.set('params', [storeMock, typeClassMock, {name: 'foo'}, onlineAdapterResp]);
  }

  if (method === 'findMany') {
    job.set('params', [storeMock, typeClassMock, [1,2,3], 'sinceToken', onlineAdapterResp]);
  }

  return job;
};

export {
  mockLocastorageJob
};
