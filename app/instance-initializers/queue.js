import Ember from 'ember';

var findAllObject = Ember.Object.create({});
var findObject = Ember.Object.create({});
var findQueryObject = Ember.Object.create({});

var syncLoads = Ember.Object.create({
  findAll: findAllObject,
  find: findObject,
  findQuery: findQueryObject
});

export function initialize(instance) {

  let store = instance.container.lookup('store:main');
  let queue = instance.container.lookup('queue:main');

  store.reopen({
    queue: queue,
    syncLoads: syncLoads,

    adapterFor: function(typeClass) {
      let superResp = this._super.apply(this, arguments);

      return superResp.get('offlineAdapter');
    },
    //this can be removed, it is only for make error more silent
    find() {
      return Ember.RSVP.resolve().then(() => {
        return this._super.apply(this, arguments);
      }).then(resp => {
        return record;
      }).catch(console.log.bind(console));
    }
  });
};

export default {
  name: 'queue-in-store',
  initialize: initialize
};
