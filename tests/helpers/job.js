import Ember from 'ember';
import LocalstorageJob from 'ember-data-offline/jobs/localforage';
import RESTJob from 'ember-data-offline/jobs/rest';

const { RSVP } = Ember;

var resolveMock = function(dataMock){
  return dataMock;
};
var emberModelMock = Ember.Object.extend({
  _createSnapshot(){
    return { id : 'foo'};
  }
});
var storeMock = Ember.Object.extend({
  peekAll(){
    return Ember.A([
      emberModelMock.create({id: 'foo'})
    ]);
  },
  peekRecord(modelName, id){
    if(id === 'foo'){
      return emberModelMock.create({id: 'foo'});
    }
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
  }
});

var snapshotMock = Ember.Object.create({});
var adapterСlass = Ember.Object.extend({
  find: function() {
    return RSVP.Promise.resolve();
  },
});
var typeClassMock = {
  modelName: 'bar',
};

var resolve = function(){
  return true;
};



var localstorageJobMock = function(assert, onlineAdapterResp, method = { name : 'find', args : 1}) {
  let offlineAdapter = adapterСlass.create({
      createRecord() {
        assert.ok(true, "offline adapter.createRecord was invoked.");
        return Ember.RSVP.Promise.resolve(1);
      },
      updateRecord() {
        assert.ok(true, "offline adapter.updateRecord was invoked.");
        return Ember.RSVP.Promise.resolve(1);
      },
      deleteRecord(){
        assert.ok(true, "offline adapter.deleteRecoed was invoked.");
        return Ember.RSVP.Promise.resolve(1);
      },
      unhadled(){
        assert.ok(true, "offline adapter.unhadled was invoked.");
        return Ember.RSVP.Promise.resolve(1);
      }
  });

  let _storeMock = storeMock.create({});
  let job = LocalstorageJob.create({
    adapter: offlineAdapter,
  });
  job.set('method', method.name);

  job.set('params', [_storeMock, typeClassMock, method.args, snapshotMock]);

  if (method.name === 'findAll') {
    job.set('params', [_storeMock, typeClassMock, 'sinceToken']);
    return job;
  }

  if (method.name === 'findQuery') {
    job.set('params', [_storeMock, typeClassMock, method.args]);
    return job;
  }

  if (method.name === 'findMany') {
    job.set('params', [_storeMock, typeClassMock, method.args, 'sinceToken']);
    return job;
  }

  if (method.name === 'updateRecord'){
    job.set('params', [_storeMock, typeClassMock, snapshotMock, onlineAdapterResp]);
    return job;
  }

  if (method.name === 'deleteRecord'){
    job.set('params', [_storeMock, typeClassMock, snapshotMock, onlineAdapterResp]);
    return job;
  }

  return job;
};

var restJobMock = function function_name(assert, onlineAdapterResp, method = { name : 'find', args : 1}) {

let onlineAdapter = adapterСlass.create({
    createRecord() {
      assert.ok(true, "adapter.createRecord was invoked.");
      return Ember.RSVP.Promise.resolve(1);
    },
    updateRecord() {
      assert.ok(true, "adapter.updateRecord was invoked.");
      return Ember.RSVP.Promise.resolve(1);
    },
    deleteRecord(){
      assert.ok(true, "adapter.deleteRecoed was invoked.");
      return Ember.RSVP.Promise.resolve(1);
    },
    findAll(){
      assert.ok(true, "adapter.findAll was invoked.");
      return Ember.RSVP.Promise.resolve(1);
    },
    find(){
      assert.ok(true, "adapter.find was invoked.");
      return Ember.RSVP.Promise.resolve(1);
    },
    findQuery(){
      assert.ok(true, "adapter.findQuery was invoked.");
      return Ember.RSVP.Promise.resolve(1);
    },
    findMany(){
      assert.ok(true, "adapter.findMany was invoked.");
      return Ember.RSVP.Promise.resolve(1);
    },

    offlineAdapter : adapterСlass.create({
        createRecord() {
          assert.ok(true, "offline adapter.createRecord was invoked.");
          return Ember.RSVP.Promise.resolve(1);
        },
        updateRecord() {
          assert.ok(true, "offline adapter.updateRecord was invoked.");
          return Ember.RSVP.Promise.resolve(1);
        },
        deleteRecord(){
          assert.ok(true, "offline adapter.deleteRecoed was invoked.");
          return Ember.RSVP.Promise.resolve(1);
        },
        unhadled(){
          assert.ok(true, "offline adapter.unhadled was invoked.");
          return Ember.RSVP.Promise.resolve(1);
        }
    })

  });

  let _storeMosck = storeMock.create({
    syncLoads : {
      find : {},
      findAll: {},
      findMany: {},
      findQuery: {}
    },
    pushPayload(){
      assert.ok(true, "store.pushPayload was invoked");
    },
    unloadRecord(){

    }
  });

  let job = RESTJob.create({
    adapter: onlineAdapter,
  });

  job.set('method', method.name);

  job.set('params', [_storeMosck, typeClassMock, method.args, snapshotMock]);

  if (method.name === 'findAll') {
    job.set('params', [_storeMosck, typeClassMock, 'sinceToken']);
    return job;
  }

  if (method.name === 'findQuery') {
    job.set('params', [_storeMosck, typeClassMock, method.args]);
    return job;
  }

  if (method.name === 'findMany') {
    job.set('params', [_storeMosck, typeClassMock, method.args, 'sinceToken']);
    return job;
  }

  if(method.name ==='createRecord' || method.name ==='updateRecord' || method.name ==='deleteRecord' ){
    job.set('params', [_storeMosck, typeClassMock, snapshotMock, {}]);
    return job;
  }

  return job;
};
export {
  localstorageJobMock,
  restJobMock
};
