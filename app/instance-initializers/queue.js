var PromiseArray = Ember.ArrayProxy.extend(Ember.PromiseProxyMixin);
var promiseArray = function(promise, label) {
  return PromiseArray.create({
    promise: Promise.resolve(promise, label)
  });
};

var registry = Ember.Object.create({
  genKey(modelName, method, params) {
    let baseKey = `${modelName}$${method}`;
    if (Ember.isEmpty(params)) {
     return baseKey; 
    }
    return `${baseKey}$${params}`;
  },
  isFirstRequestFor(modelName, method, params) {
    let key = this.genKey(modelName, method, params);
    return this.get(key).length <= 1;
  },
  registerReq(modelName, method, params) {
    let key = this.genKey(modelName, method, params);
    if (Ember.isEmpty(this.get(key))) {
      this.set(key, Ember.A());
    }
    this.get(key).pushObject(new Date());
  }
});

export function initialize(instance) {
  let store = instance.container.lookup('store:main');
  let queue = instance.container.lookup('queue:main');
  store.reopen({
    queue: queue,

    requestRegistry: registry,
    isFirstRequestFor(modelName, method, params) {
      return this.get('requestRegistry').isFirstRequestFor(modelName, method, params);
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
