/* global start */
/* global stop */

import Ember from 'ember';
import OfflineMixin from 'ember-data-offline/mixins/offline';
import Queue from 'ember-data-offline/queue';
import { module, test } from 'qunit';
import { getStoreMock, getQueueMock } from '../../helpers/base';
import { storeMock, snapshotMock} from '../../helpers/job';
import moment from 'moment';


var subject;

var singleResultMock = {
  name : 'foo'
};

var resultFromPayload = {
  name : 'foo2'
};

var typeClassMock = Ember.Object.create({
  modelName : 'bar'
});

module('Unit | Mixin | offline',  {
    beforeEach: function(){
      subject = Ember.Object.extend( {
        __adapterName__: "OFFLINE",
        findAll(){
          this.get('assert').ok(true, 'findAll was invoked @ offline adapter');
          return Ember.RSVP.Promise.resolve(Ember.A([singleResultMock]));
        },
        find(){
          this.get('assert').ok(true, 'find was invoked @ offline adapter');
          //simulate if param id equals 2 then return empty record
          return (arguments[2] === 'no_record') ? Ember.RSVP.Promise.resolve() : Ember.RSVP.Promise.resolve(singleResultMock);
        },
        query(){
          this.get('assert').ok(true, 'query was invoked @ offline adapter');
          //simulate if param id equals 2 then return empty record
          return (arguments[2] === 'no_record') ? Ember.RSVP.Promise.resolve(Ember.A()) : Ember.RSVP.Promise.resolve(Ember.A([singleResultMock]));
        },
        findMany(){
          this.get('assert').ok(true, 'findMany was invoked @ offline adapter');
          //simulate if param id equals 2 then return empty record
          return (arguments[2][0] === 'no_record') ? Ember.RSVP.Promise.resolve(Ember.A()) : Ember.RSVP.Promise.resolve(Ember.A([singleResultMock]));
        },
        createRecord(){
          this.get('assert').ok(true, 'createRecord was invoked @ offline adapter');
          return Ember.RSVP.Promise.resolve(snapshotMock);
        },
        updateRecord(){
          this.get('assert').ok(true, 'udapteRecord was invoked @ offline adapter');
          return Ember.RSVP.Promise.resolve(snapshotMock);
        },
        deleteRecord(){
          this.get('assert').ok(true, 'deleteRecord was invoked @ offline adapter');
          return Ember.RSVP.Promise.resolve(snapshotMock);
        },
        _namespaceForType(){
          this.get('assert').ok(true, '_namespaceForType was invoked @ offline adapter');
          return Ember.RSVP.Promise.resolve({
            __data_offline_meta__ : {
              fetchedAt: moment().subtract(13, 'hours').calendar() //outdated because ttl = 12 hours
            }
          });
        },
        onlineAdapter : Ember.Object.create({
          //assert : this.get('assert'),
          findQuery(){
            this.get('assert').ok(true, 'query was invoked @ online adapter');
            return Ember.RSVP.Promise.resolve({ bar: Ember.A([resultFromPayload])});
          }
        })
      }).extend(OfflineMixin).create();

    },
    afterEach: function(){
      subject = null;
    }
});


test('findAll',(assert) => {
  assert.expect(2);

  let store = storeMock.create();
  subject.set('assert', assert);

  //2 asserts : adapter.findAll + equal
  stop();
  subject.findAll(store, typeClassMock, 'sinceToken', { id: 'foo'}, true).then((result)=>{
    assert.equal(result[0], singleResultMock, "returns result");
    start();
  });

  //TODO TEST WITH fromJom parameter
});

test('find', (assert)=>{
  assert.expect(4);

  let store = storeMock.create();
  subject.set('assert', assert);

  //2 asserts : adapter.find + equal
  stop();
  subject.find(store, typeClassMock, 'foo', { id: 'foo'}, true).then((result)=>{
    assert.equal(result, singleResultMock, "returns result");
    start();
  });

  //2 asserts : adapter.find + equal
  stop();
  subject.find(store, typeClassMock, 'no_record', { id: 'foo'}, true).then((result)=>{
    assert.equal(result.id, 'no_record', "returns stub");
    start();
  });
  //TODO TEST WITH fromJom parameter
});

test('query', (assert)=>{
  assert.expect(5);

  let store = storeMock.create();
  subject.set('assert', assert);

  //2 asserts : adapter.query + equal
  stop();
  subject.query(store, typeClassMock, {name : 'foo'}, [{ id: 'foo'}], true).then((result)=>{
    assert.equal(result[0], singleResultMock, "returns result");
    start();
  });

  subject.get('onlineAdapter').set('assert', assert);

  //3 asserts : adapter.query + onlineAdapter.findQuery + equal
  stop();
  subject.query(store, typeClassMock, 'no_record', [{ id: 'foo'}], true).then((result)=>{
    assert.equal(result[0], resultFromPayload, "returns result");
    start();
  });
  //TODO TEST WITH fromJom parameter=false
});


test('findMany', (assert)=>{
  assert.expect(4);

  let store = storeMock.create();
  subject.set('assert', assert);

  //2 asserts : adapter.findMany + equal
  stop();
  subject.findMany(store, typeClassMock, ['foo'], [{ id: 'foo'}], true).then((result)=>{
    assert.equal(result[0], singleResultMock, "returns result");
    start();
  });

  //3 asserts : adapter.findMany  + equal
  stop();
  subject.findMany(store, typeClassMock, ['no_record'], [{ id: 'foo'}], true).then((result)=>{
    assert.equal(result[0].id, 'no_record', "returns stub");
    start();
  });
  //TODO TEST WITH fromJom parameter=false
});


test('createRecord', (assert)=>{
  assert.expect(5);

  let store = storeMock.create();

  subject.set('assert', assert);

  //2 asserts : adapter.createRecord + equal
  stop();
  subject.createRecord(store, typeClassMock, snapshotMock, true).then((result)=>{
    assert.equal(result,snapshotMock, "returns result");
    start();
  });

  //3 asserts : adapter.createRecord + queue.add + equal
  subject.set('EDOQueue', getQueueMock(assert,'oflineMixin'));
  stop();
  subject.createRecord(store, typeClassMock, snapshotMock, false).then((result)=>{
    assert.equal(result,snapshotMock, "returns result");
    start();
  });

});


test('updateRecord', (assert)=>{
  assert.expect(5);

  let store = storeMock.create();

  subject.set('assert', assert);

  //2 asserts : adapter.updateRecord + equal
  stop();
  subject.updateRecord(store, typeClassMock, snapshotMock, true).then((result)=>{
    assert.equal(result,snapshotMock, "returns result");
    start();
  });

  //3 asserts : adapter.updateRecord + queue.add + equal
  subject.set('EDOQueue', getQueueMock(assert,'oflineMixin'));
  stop();
  subject.updateRecord(store, typeClassMock, snapshotMock, false).then((result)=>{
    assert.equal(result,snapshotMock, "returns result");
    start();
  });

});


test('deleteRecord', (assert)=>{
  assert.expect(5);

  let store = storeMock.create();

  subject.set('assert', assert);

  //2 asserts : adapter.deleteRecord + equal
  stop();
  subject.deleteRecord(store, typeClassMock, snapshotMock, true).then((result)=>{
    assert.equal(result,snapshotMock, "returns result");
    start();
  });

  //3 asserts : adapter.deleteRecord + queue.add + equal
  subject.set('EDOQueue', getQueueMock(assert,'oflineMixin'));
  stop();
  subject.deleteRecord(store, typeClassMock, snapshotMock, false).then((result)=>{
    assert.equal(result,snapshotMock, "returns result");
    start();
  });

});
