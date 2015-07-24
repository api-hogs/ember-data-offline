/* global start */
/* global stop */

import Ember from 'ember';
import { module, test } from 'qunit';
import { localstorageJobMock } from '../../helpers/job';

const { RSVP } = Ember;

var subject;

module('Unit | Job | Localstorage',  {
    beforeEach: function(){
    },
    afterEach: function(){
    }
});


test('#find call adapter #createRecord', function(assert) {
  assert.expect(2);

  let job = localstorageJobMock(assert, null,{name : 'find', args : 'foo'});

  stop();
  job.perform().then(() => {
    assert.ok(true,"job.perform");
    start();
  });
});

test('#find pass when there is record in store', function(assert) {
  assert.expect(2);
  //in store : {id:foo} -> assert for createRecord + job.perform
  let job = localstorageJobMock(assert, null, {name : 'find', args : 'foo'});

  stop();
  job.perform().then(() => {
    assert.ok(true,"job.perform");
    start();
  });
});

test('#find pass when there is no record in store', function(assert) {
  assert.expect(1);
  //in store : {id:foo} -> assert for job.perform only
  let job = localstorageJobMock(assert, null, {name : 'find', args : 1});

  stop();
  job.perform().then(() => {
    assert.ok(true,"job.perform");
    start();
  });
});

test('#findAll pass', function(assert) {
  assert.expect(2);
  //in store : {id:foo} -> assert for createRecord + job.perform
  let job = localstorageJobMock(assert, null, {name : 'findAll'});

  stop();
  job.perform().then(() => {
    assert.ok(true,"job.perform");
    start();
  });
});


test('#findMany pass ', function(assert) {
   assert.expect(2);
   //in store : {id:foo} -> assert for createRecord + job.perform
   let job = localstorageJobMock(assert, null, {name : 'findMany', args : ['foo', 'foo2']});

   stop();
   job.perform().then(() => {
     assert.ok(true,"job.perform");
     start();
   });
 });


 test('adapter #updateRecord is successfully by offline job #deleteRecord', function(assert){
   assert.expect(2);

   let job = localstorageJobMock(assert, RSVP.Promise.resolve({id:1}), { name : 'updateRecord'});

   stop();
   job.perform().then(() => {
     assert.ok(true,"job.perform");
     start();
   });
 });

 test('adapter #deleteRecord is successfully invoked by offline job #deleteRecord', function(assert){
   assert.expect(2);

   let job = localstorageJobMock(assert, RSVP.Promise.resolve({id:1}), { name : 'deleteRecord'});

   stop();
   job.perform().then(() => {
     assert.ok(true,"job.perform");
     start();
   });
 });


test('pass unhadled function through localforage to adapter', function(assert){
  assert.expect(2);
  let job = localstorageJobMock(assert, RSVP.Promise.resolve({id:1}), { name : 'unhadled'});

  stop();
  job.perform().then(() => {
    assert.ok(true,"job.perform");
    start();
  });
});


 //test('#findQuery pass', function(assert) {
//   assert.expect(2);
   //in store : {id:foo} -> assert for createRecord + job.perform
//   let job = mockLocastorageJob(assert, RSVP.Promise.resolve({ bar: {id : 'foo', name :'foo'}}), {name : 'findQuery', args: {name : 'foo'}});

//   stop();
//   job.perform().then(() => {
//     assert.ok(true);
//     start();
//   });
// });


// test('#find persists when there is record from online storage that absent in offline', function(assert) {
//   assert.expect(2);

//   let job = mockLocastorageJob(RSVP.Promise.resolve(null), RSVP.Promise.resolve({bar: {id: 'foo'}}), assert);

//   stop();
//   job.perform().then(() => {
//     assert.ok(true);
//     start();
//   });
// });

// test('#find pass when empty response from online', function(assert) {
//   assert.expect(1);

//   let job = mockLocastorageJob(RSVP.Promise.resolve(null), null, assert);

//   stop();
//   job.perform().then(() => {
//     assert.ok(true);
//     start();
//   });
// });

// test('#find pass when error in offline and no online record', function(assert) {
//   assert.expect(1);

//   let job = mockLocastorageJob(RSVP.Promise.reject(), RSVP.Promise.resolve(null), assert);

//   stop();
//   job.perform().then(() => {
//     assert.ok(true);
//     start();
//   });
// });

// test('#find persists when error in offline and found online record', function(assert) {
//   assert.expect(2);

//   let job = mockLocastorageJob(RSVP.Promise.reject(), RSVP.Promise.resolve({bar: {id: 'foo'}}), assert);

//   stop();
//   job.perform().then(() => {
//     assert.ok(true);
//     start();
//   });
// });

// test('#findAll persists when there are online records', function(assert) {
//   assert.expect(2);

//   let job = mockLocastorageJob(null, RSVP.Promise.resolve({id: 'foo'}), assert, 'findAll');

//   stop();
//   job.perform().then(() => {
//     assert.ok(true);
//     start();
//   });
// });

// test('#findAll pass when there are not online records', function(assert) {
//   assert.expect(1);

//   let job = mockLocastorageJob(null, RSVP.Promise.resolve(null), assert, 'findAll');

//   stop();
//   job.perform().then(() => {
//     assert.ok(true);
//     start();
//   });
// });

// test('#findQuery pass when there is record from offline storage', function(assert) {
//   assert.expect(1);

//   let job = mockLocastorageJob(RSVP.Promise.resolve({id: 2}), null, assert, 'findQuery');

//   stop();
//   job.perform().then(() => {
//     assert.ok(true);
//     start();
//   });
// });

// test('#findQuery persists when there is record from online storage that absent in offline', function(assert) {
//   assert.expect(2);

//   let job = mockLocastorageJob(RSVP.Promise.resolve(null), {id: 'foo'}, assert, 'findQuery');

//   stop();
//   job.perform().then(() => {
//     assert.ok(true);
//     start();
//   });
// });

// test('#findQuery pass when empty response from online', function(assert) {
//   assert.expect(1);

//   let job = mockLocastorageJob(RSVP.Promise.resolve(null), null, assert, 'findQuery');

//   stop();
//   job.perform().then(() => {
//     assert.ok(true);
//     start();
//   });
// });

// test('#findQuery pass when error in offline and no online record', function(assert) {
//   assert.expect(1);

//   let job = mockLocastorageJob(RSVP.Promise.reject(), RSVP.Promise.resolve(null), assert, 'findQuery');

//   stop();
//   job.perform().then(() => {
//     assert.ok(true);
//     start();
//   });
// });

// test('#findQuery persists when error in offline and found online record', function(assert) {
//   assert.expect(2);

//   let job = mockLocastorageJob(RSVP.Promise.reject(), RSVP.Promise.resolve({id: 'foo'}), assert, 'findQuery');

//   stop();
//   job.perform().then(() => {
//     assert.ok(true);
//     start();
//   });
// });

// test('#findMany pass when there is record from offline storage', function(assert) {
//   assert.expect(1);

//   let job = mockLocastorageJob(RSVP.Promise.resolve({id: 2}), null, assert, 'findMany');

//   stop();
//   job.perform().then(() => {
//     assert.ok(true);
//     start();
//   });
// });

// test('#findMany persists when there is record from online storage that absent in offline', function(assert) {
//   assert.expect(2);

//   let job = mockLocastorageJob(RSVP.Promise.resolve(null), {id: 'foo'}, assert, 'findMany');

//   stop();
//   job.perform().then(() => {
//     assert.ok(true);
//     start();
//   });
// });

// test('#findMany pass when empty response from online', function(assert) {
//   assert.expect(1);

//   let job = mockLocastorageJob(RSVP.Promise.resolve(null), null, assert, 'findMany');

//   stop();
//   job.perform().then(() => {
//     assert.ok(true);
//     start();
//   });
// });

// test('#findMany pass when error in offline and no online record', function(assert) {
//   assert.expect(1);

//   let job = mockLocastorageJob(RSVP.Promise.reject(), RSVP.Promise.resolve(null), assert, 'findMany');

//   stop();
//   job.perform().then(() => {
//     assert.ok(true);
//     start();
//   });
// });

// test('#findMany persists when error in offline and found online record', function(assert) {
//   assert.expect(2);

//   let job = mockLocastorageJob(RSVP.Promise.reject(), RSVP.Promise.resolve({id: 'foo'}), assert, 'findMany');

//   stop();
//   job.perform().then(() => {
//     assert.ok(true);
//     start();
//   });
// });
