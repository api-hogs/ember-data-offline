import Ember from 'ember';
import moment from 'moment';

const { RSVP } = Ember;

(function(global) {
  let fakeNavigator = {};
  for (let i in global.navigator) {
    fakeNavigator[i] = global.navigator[i];
  }
  global.navigator = fakeNavigator;
}(window));

var goOffline = function goOffline() {
  return new RSVP.Promise(resolve => {
    window.navigator.__defineGetter__('onLine', function() {
      return false;
    });
    $(window).trigger('offline');
    resolve();
  });
};

var goOnline = function goOnline() {
  window.navigator.__defineGetter__('onLine', function() {
    return true;
  });
  $(window).trigger('online');
};

var getStoreMock = function() {
  return Ember.Object.create({
    peekAll(){
      return Ember.A([
        getSnapshotMock()
      ]);
    },
    peekRecord(modelName, id){
      if(id === 'foo'){
        return getSnapshotMock();
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
    },
    lookupAdapter() {
      return Ember.Object.create({
        recordTTL : moment.duration(12, 'hours')
      });
    }
  });
};

var getResultMock = function() {
  return {
    name: 'foo'
  };
};

var getResultFromPayloadMock = function() {
  return {
    name: 'foo2'
  };
};

var getTypeMock = function(){
    return Ember.Object.create({
      modelName : 'bar'
    });
};

var getSnapshotMock = function() {
  return Ember.Object.create({
    record : Ember.Object.create({
      store : getStoreMock(),
      __data_offline_meta__ : Ember.Object.create()
    }),
    id : 'foo',
    _internalModel : getTypeMock()
  });
};

var getQueueMock = function(assert, encapsulatedIn) {
  return Ember.Object.create({
    _assert: assert,
    _encapsulatedIn: encapsulatedIn,
    add() {
      this.get('_assert').ok(true, `queue.add was invoked @ ${this.get('_encapsulatedIn')}`);
    }
  });
};

var getMetaMock = function(){
  return {
    __data_offline_meta__ : {
      fetchedAt : moment()
    }
  };
};

//setup assert
var getAdapterMock = function(adapterName){
  return Ember.Object.create({
    __adapterName__: adapterName,
    findAll(){
      this.get('assert').ok(true, `findAll was invoked @ ${this.get('__adapterName__')} adapter`);
      return Ember.RSVP.Promise.resolve(Ember.A([getResultMock()]));
    },
    find(){
      this.get('assert').ok(true, `find was invoked @ ${this.get('__adapterName__')} adapter`);
      //simulate if param id equals 2 then return empty record
      return (arguments[2] === 'no_record') ? Ember.RSVP.Promise.resolve() : Ember.RSVP.Promise.resolve(getResultMock());
    },
    query(){
      this.get('assert').ok(true, `query was invoked @ ${this.get('__adapterName__')} adapter`);
      //simulate if param id equals 2 then return empty record
      return (arguments[2] === 'no_record') ? Ember.RSVP.Promise.resolve(Ember.A()) : Ember.RSVP.Promise.resolve(Ember.A([getResultMock()]));
    },
    findMany(){
      this.get('assert').ok(true, `findMany was invoked @ ${this.get('__adapterName__')} adapter`);
      //simulate if param id equals 2 then return empty record
      return (arguments[2][0] === 'no_record') ? Ember.RSVP.Promise.resolve(Ember.A()) : Ember.RSVP.Promise.resolve(Ember.A([getResultMock()]));
    },
    createRecord(){
      this.get('assert').ok(true, `createRecord was invoked @ ${this.get('__adapterName__')} adapter`);
      return Ember.RSVP.Promise.resolve(getSnapshotMock());
    },
    updateRecord(){
      this.get('assert').ok(true, `updateRecord was invoked @ ${this.get('__adapterName__')} adapter`);
      return Ember.RSVP.Promise.resolve(getSnapshotMock());
    },
    deleteRecord(){
      this.get('assert').ok(true, `deleteRecord was invoked @ ${this.get('__adapterName__')} adapter`);
      return Ember.RSVP.Promise.resolve(getSnapshotMock());
    },
    _namespaceForType(){
      this.get('assert').ok(true, `_namespaceForType was invoked @ ${this.get('__adapterName__')} adapter`);
      let metaMock = getMetaMock();
      metaMock.fetchedAt = moment().subtract(13, 'hours').calendar(); //outdated because ttl = 12 hours
      return Ember.RSVP.Promise.resolve(metaMock);
    }
  });
};

export {
  goOnline, goOffline, getAdapterMock, getStoreMock, getQueueMock, getSnapshotMock, getMetaMock,
  getTypeMock, getResultMock, getResultFromPayloadMock
};
