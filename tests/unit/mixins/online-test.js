/* global start */
/* global stop */

import Ember from 'ember';
import OnlineMixin from 'ember-data-offline/mixins/online';
import { module, test } from 'qunit';
import {
  getStoreMock, getQueueMock, getSnapshotMock, getAdapterMock,
  getTypeMock, getResultMock, getResultFromPayloadMock
} from '../../helpers/base';

var subject, store, typeClass, snapshot, expectedResult, expectedResultFromPayload;

store = getStoreMock();
typeClass = getTypeMock();

module('Unit | Mixin | online',  {
    beforeEach: function(){

      snapshot = getSnapshotMock();
      expectedResult = getResultMock();
      expectedResultFromPayload = getResultFromPayloadMock();

      let onlineAdapterMock = getAdapterMock("ONLINE");
      subject = Ember.Object.extend(onlineAdapterMock).extend(OnlineMixin).create();
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

  //asserts 2: findAll + equal
  stop();
  subject.findAll(store, typeClass).then((records)=>{
    assert.equal(records[0].name,expectedResult.name);
    start();
  });
});

test('find', (assert)=>{
  assert.expect(5);

  subject.set('assert',assert);

  store.set('isOfflineEnabled',false);
  //asserts 2: find call + equal
  stop();
  subject.find(store, typeClass, 'foo', snapshot, true).then((record)=>{
    assert.equal(record.name,expectedResult.name);
    start();
  });

  subject.set('EDOQueue', getQueueMock(assert,'onlineMixin'));
  store.set('isOfflineEnabled',true);
  //asserts 3: find call + queue.add + equal
  stop();
  subject.find(store, typeClass, 'foo', snapshot, false).then((record)=>{
    assert.equal(record.name,expectedResult.name);
    start();
  });
});

test('findQuery', (assert)=>{
  assert.expect(5);

  subject.set('assert',assert);

  store.set('isOfflineEnabled',false);
  //asserts 2: findQuery call + equal
  stop();
  subject.findQuery(store, typeClass,{name: 'foo'}, [snapshot], true).then((records)=>{
    assert.equal(records[0].name,expectedResult.name);
    start();
  });

  subject.set('EDOQueue', getQueueMock(assert,'onlineMixin'));
  store.set('isOfflineEnabled',true);
  //asserts 3: findQuery call + queue.add + equal
  stop();
  subject.findQuery(store, typeClass, {name: 'foo'}, [snapshot], false).then((records)=>{
    assert.equal(records[0].name,expectedResult.name);
    start();
  });
});

test('findMany', (assert)=>{
  assert.expect(5);

  subject.set('assert', assert);
  store.set('isOfflineEnabled',true);
  //2 asserts : findMany + equal
  stop();
  subject.findMany(store, typeClass, ['foo'], [snapshot], true).then((result)=>{
    assert.equal(result[0].name, expectedResult.name);
    start();
  });

  subject.set('EDOQueue', getQueueMock(assert,'onlineMixin'));
  store.set('isOfflineEnabled',true);
  //asserts 3: findMany call + queue.add + equal
  stop();
  subject.findMany(store, typeClass, ['foo'], [snapshot], false).then((records)=>{
    assert.equal(records[0].name,expectedResult.name);
    start();
  });

});

test('create, delete, update operations', (assert)=>{
  assert.expect(6);

  subject.set('assert', assert);
  //2 asserts : createRecord + ok
  stop();
  subject.createRecord().then((result)=>{
    assert.ok(result);
    start();
  });
  //2 asserts : updateRecord + ok
  stop();
  subject.updateRecord().then((result)=>{
    assert.ok(result);
    start();
  });
  //2 asserts : deleteRecord + ok
  stop();
  subject.deleteRecord().then((result)=>{
    assert.ok(result);
    start();
  });
});
