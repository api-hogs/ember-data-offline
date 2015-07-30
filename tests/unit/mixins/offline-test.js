/* global start */
/* global stop */

import Ember from 'ember';
import OfflineMixin from 'ember-data-offline/mixins/offline';
import Queue from 'ember-data-offline/queue';
import { module, test } from 'qunit';
import {
  getStoreMock, getQueueMock, getSnapshotMock, getAdapterMock,
  getTypeMock, getResultMock, getResultFromPayloadMock
} from '../../helpers/base';
import moment from 'moment';

var subject, store, typeClass, snapshot, expectedResult, expectedResultFromPayload;

store = getStoreMock();
typeClass = getTypeMock();

module('Unit | Mixin | offline',  {
    beforeEach: function(){

      snapshot = getSnapshotMock();
      expectedResult = getResultMock();
      expectedResultFromPayload = getResultFromPayloadMock();

      let offlineAdapterMock = getAdapterMock("OFFLINE");

      subject = Ember.Object.extend(offlineAdapterMock,{
        onlineAdapter : Ember.Object.create({
          //assert : this.get('assert'),
          findQuery(){
            this.get('assert').ok(true, 'query was invoked @ online adapter');
            return Ember.RSVP.Promise.resolve({ bar: Ember.A([expectedResultFromPayload])});
          }
        })
      }).extend(OfflineMixin).create();
    },
    afterEach: function(){
      subject = null;
      snapshot = null;
      expectedResult = null;
      expectedResultFromPayload = null;
    }
});



test('findAll', (assert)=>{
  assert.expect(2);
  subject.set('assert', assert);

  //2 asserts : adapter.findAll + equal
  stop();
  subject.findAll(store, typeClass, 'sinceToken', [snapshot], true).then((result)=>{
    assert.equal(result[0].name, expectedResult.name);
    start();
  });
  //TODO TEST WITH fromJom parameter
});

test('find', (assert)=>{
  assert.expect(4);

  subject.set('assert', assert);

  //2 asserts : adapter.find + equal
  stop();
  subject.find(store, typeClass, 'foo', snapshot, true).then((result)=>{
    assert.equal(result.name, expectedResult.name);
    start();
  });

  //2 asserts : adapter.find + equal
  stop();
  subject.find(store, typeClass, 'no_record', snapshot, true).then((result)=>{
    assert.equal(result.id, 'no_record');
    start();
  });
  //TODO TEST WITH fromJom parameter
});

test('query', (assert)=>{
  assert.expect(5);

  subject.set('assert', assert);

  //2 asserts : adapter.query + equal
  stop();
  subject.query(store, typeClass, {name : 'foo'}, [snapshot], true).then((result)=>{
    assert.equal(result[0].name, expectedResult.name);
    start();
  });

  subject.get('onlineAdapter').set('assert', assert);

  //3 asserts : adapter.query + onlineAdapter.findQuery + equal
  stop();
  subject.query(store, typeClass, 'no_record', [snapshot], true).then((result)=>{
    assert.equal(result[0].name, expectedResultFromPayload.name);
    start();
  });
  //TODO TEST WITH fromJom parameter=false
});


test('findMany', (assert)=>{
  assert.expect(4);

  subject.set('assert', assert);

  //2 asserts : adapter.findMany + equal
  stop();
  subject.findMany(store, typeClass, ['foo'], [snapshot], true).then((result)=>{
    assert.equal(result[0].name, expectedResult.name);
    start();
  });

  //2 asserts : adapter.findMany  + equal
  stop();
  subject.findMany(store, typeClass, ['no_record'], [snapshot], true).then((result)=>{
    assert.equal(result[0].id, 'no_record', "returns stub");
    start();
  });
  //TODO TEST WITH fromJom parameter=false
});


test('createRecord', (assert) => {
  assert.expect(5);

  subject.set('assert', assert);

  //2 asserts : adapter.createRecord + equal
  stop();
  subject.createRecord(store, typeClass, snapshot, true).then((result) => {
    assert.ok(result);
    start();
  });

  //3 asserts : adapter.createRecord + queue.add + equal
  subject.set('EDOQueue', getQueueMock(assert, 'oflineMixin'));
  stop();
  subject.createRecord(store, typeClass, snapshot, false).then((result) => {
    assert.ok(result);
    start();
  });
});

test('updateRecord', (assert) => {
  assert.expect(5);

  subject.set('assert', assert);

  //2 asserts : adapter.updateRecord + equal
  stop();
  subject.updateRecord(store, typeClass, snapshot, true).then((result) => {
    assert.ok(result);
    start();
  });

  //3 asserts : adapter.updateRecord + queue.add + equal
  subject.set('EDOQueue', getQueueMock(assert, 'oflineMixin'));
  stop();
  subject.updateRecord(store, typeClass, snapshot, false).then((result) => {
    assert.ok(result);
    start();
  });
});

test('deleteRecord', (assert) => {
  assert.expect(5);

  subject.set('assert', assert);

  stop();
  subject.deleteRecord(store, typeClass, snapshot, true).then((result) => {
    assert.ok(result);
    start();
  });

  //3 asserts : adapter.deleteRecord + queue.add + equal
  subject.set('EDOQueue', getQueueMock(assert, 'oflineMixin'));
  stop();
  subject.deleteRecord(store, typeClass, snapshot, false).then((result) => {
    assert.ok(result);
    start();
  });
});
