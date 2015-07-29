/* global start */
/* global stop */

import Ember from 'ember';
import OfflineMixin from 'ember-data-offline/mixins/offline';
import Queue from 'ember-data-offline/queue';
import { module, test } from 'qunit';
import { getStoreMock, getQueueMock } from '../../helpers/base';
import moment from 'moment';


var subject;

var singleResultMock = Ember.Object.create({
  name : 'foo'
});

var typeClassMock = Ember.Object.create({
  modelName : 'bar'
});

var adapterMock = Ember.Object.create({
  findAll(){
    this.get('assert').ok(true, 'findAll was invoked @ adapter');
    return Ember.RSVP.Promise.resolve([singleResultMock]);
  },
});

module('Unit | Mixin | offline',  {
    beforeEach: function(){
      subject = Ember.Object.extend( {
        __adapterName__: "OFFLINE",
        findAll(){
          this.get('assert').ok(true, 'findAll was invoked @ adapter');
          return Ember.RSVP.Promise.resolve(Ember.A([singleResultMock]));
        },
        find(){
          this.get('assert').ok(true, 'find was invoked @ adapter');
          return Ember.RSVP.Promise.resolve(singleResultMock));
        },
        _namespaceForType(){
          this.get('assert').ok(true, '_namespaceForType was invoked @ adapter');
          return Ember.RSVP.Promise.resolve({
            __data_offline_meta__ : {
              fetchedAt: moment().subtract(13, 'hours').calendar() //outdated because ttl = 12 hours
            }
          });
        }
      }).extend(OfflineMixin).create();

    },
    afterEach: function(){
      subject = null;
    }
});


test('findAll',(assert) => {
  assert.expect(2);

  let store = getStoreMock();

  subject.set('EDOQueue', getQueueMock(assert, 'store'));
  subject.set('assert', assert);

  //2 asserts : adapter.findAll + equal
  stop();
  subject.findAll(store, typeClassMock, 'sinceToken', { _id: 'foo'}, true).then((result)=>{
    assert.equal(result.get('firstObject'), singleResultMock, 'returns result');
    start();
  });

  //TODO TEST WITH fromJom parameter
  // stop();
  // subject.findAll(store, typeClassMock, 'sinceToken', { _id: 'foo'}, 0).then((result)=>{
  //   assert.equal(result.get('firstObject'), singleResultMock, 'returns result');
  //   start();
  // });
});

test('find', (assert)=>{
  assert.expect(2);

  let store = getStoreMock();

  subject.set('EDOQueue', getQueueMock(assert, 'store'));
  subject.set('assert', assert);

  //2 asserts : adapter.findAll + equal
  stop();
  subject.find(store, typeClassMock, 'sinceToken', { _id: 'foo'}, true).then((result)=>{
    assert.equal(result.get('firstObject'), singleResultMock, 'returns result');
    start();
  });
});
