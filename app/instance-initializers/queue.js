var PromiseArray = Ember.ArrayProxy.extend(Ember.PromiseProxyMixin);
var promiseArray = function(promise, label) {
  return PromiseArray.create({
    promise: Promise.resolve(promise, label)
  });
};

var registry = Ember.Object.create({
  isFirstRequestFor(modelName) {
    return this.get(modelName).length <= 1;
  },
  registerReq(modelName) {
    this.get(modelName);
    if (Ember.isEmpty(this.get(modelName))) {
      this.set(modelName, Ember.A());
    }
    this.get(modelName).pushObject(new Date());
  }
});

export function initialize(instance) {
  let store = instance.container.lookup('store:main');
  let queue = instance.container.lookup('queue:main');
  store.reopen({
    queue: queue,

    requestRegistry: registry,
    isFirstRequestFor(modelName) {
      return this.get('requestRegistry').isFirstRequestFor(modelName);
    },

    adapterFor: function(typeClass) {
      let superResp = this._super.apply(this, arguments);

      return superResp.get('offlineAdapter');
    }
  });
};

export default {
  name: 'queue-in-store',
  initialize: initialize
};
