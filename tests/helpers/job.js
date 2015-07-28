import Ember from 'ember';
import LocalstorageJob from 'ember-data-offline/jobs/localforage';
import RESTJob from 'ember-data-offline/jobs/rest';

const { RSVP } = Ember;

var resolveMock = function(dataMock){
  return dataMock;
};
var emberModelMock = Ember.Object.extend({
  _createSnapshot(){
    return snapshotMock.reopen({ id : 'foo'});
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
  },
  metadataFor(){
    return Ember.Object.create();
  }
});

var snapshotMock = Ember.Object.create({
  record : Ember.Object.create({
    store : storeMock.create(),
    __data_offline_meta__ : Ember.Object.create()
  }),
  _internalModel : {
    modelName : 'bar'
  }
});

var adapterСlass = Ember.Object.extend({
  createRecord() {
    this.get('assert').ok(true, this.get('adapterType') + " adapter.createRecord was invoked.");
    return RSVP.Promise.resolve({bar : {id : 'foo'}});
  },
  updateRecord() {
    this.get('assert').ok(true, this.get('adapterType') +  " adapter.updateRecord was invoked.");
    return RSVP.Promise.resolve({bar : {id : 'foo'}});
  },
  deleteRecord(){
    this.get('assert').ok(true, this.get('adapterType') +  " adapter.deleteRecoed was invoked.");
    return RSVP.Promise.resolve({bar : {id : 'foo'}});
  },
  unhandled(){
    this.get('assert').ok(true, this.get('adapterType') +  " adapter.unhandled was invoked.");
    return RSVP.Promise.resolve({bar : {id : 'foo'}});
  },
  queue : {
    attach: callback => {
      callback(function(){ });
    }
  },
  _namespaceForType(typeClass){
    this.get('assert').ok(true, this.get('adapterType') +  " adapter._namespaceForType was invoked.");
    return RSVP.Promise.resolve({ records : Ember.A(), __data_offline_meta__ : Ember.Object.create()});
  },
  persistData(){
    this.get('assert').ok(true, this.get('adapterType') +  " adapter.persistData was invoked.");
    return RSVP.Promise.resolve();
  },
  serializer : Ember.Object.create({
    serialize(snapshot){
      return {
        id : snapshot.id,
        __data_offline_meta__ : snapshot.record.get('__data_offline_meta__')
      };
    }
  })
});

var typeClassMock = {
  modelName: 'bar',
};


var localstorageJobMock = function(assert, onlineAdapterResp, method = { name : 'find', args : 1}) {
  let offlineAdapter = adapterСlass.create({
    assert : assert,
    adapterType : "offline"
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

  if (method.name === 'deleteRecord' || method.name === 'updateRecord'){
    job.set('params', [_storeMock, typeClassMock, snapshotMock, onlineAdapterResp]);
    return job;
  }

  return job;
};

var restJobMock = function function_name(assert, method = { name : 'find', args : 1}) {

let onlineAdapter = adapterСlass.create({
    assert : assert,
    adapterType : "rest",
    findAll(){
      this.get('assert').ok(true, this.get('adapterType') + " adapter.findAll was invoked.");
      return Ember.RSVP.Promise.resolve({bar : {id : 'foo'}});
    },
    find(){
      this.get('assert').ok(true, this.get('adapterType') + " adapter.find was invoked.");
      return Ember.RSVP.Promise.resolve({bar : {id : 'foo'}});
    },
    findQuery(){
      this.get('assert').ok(true, this.get('adapterType') + " adapter.findQuery was invoked.");
      return Ember.RSVP.Promise.resolve({bar : {id : 'foo'}});
    },
    findMany(){
      this.get('assert').ok(true, this.get('adapterType') + " adapter.findMany was invoked.");
      return Ember.RSVP.Promise.resolve({bar : {id : 'foo'}});
    },
    offlineAdapter : adapterСlass.create({
        assert : assert,
        adapterType : "offline"
    }),
    createOfflineJob(){
      this.get('assert').ok(true, this.get('adapterType') + " adapter.createOfflineJob was invoked.");
      return Ember.RSVP.Promise.resolve('foo');
    }
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
      assert.ok(true, "store.unloadRecord was invoked");
    },
    deleteRecord(){
      assert.ok(true, "store.deleteRecord was invoked");
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
