var PromiseArray = Ember.ArrayProxy.extend(Ember.PromiseProxyMixin);
var promiseArray = function(promise, label) {
  return PromiseArray.create({
    promise: Promise.resolve(promise, label)
  });
};

export function initialize(instance) {
  let store = instance.container.lookup('store:main');
  let queue = instance.container.lookup('queue:main');
  store.reopen({
    queue: queue,
    requestRegistry: {}, 

    adapterFor: function(modelName) {
      let superResp = this._super.apply(this, arguments);

      // let currentModelRegistry = this.get('requestRegistry')[modelName];
      // if (Ember.isEmpty(currentModelRegistry)) {
      //   currentModelRegistry = [];       
      // }
      // currentModelRegistry.push(new Date());

      // let firstOfflineRequest = currentModelRegistry.length === 1;

      // if (firstOfflineRequest) {
      //    if (superResp.get('isOnline')) {
      // console.log('IWWIWIW', firstOfflineRequest)
      //      return superResp.get('offlineAdapter');
      //    }
      //    return superResp; 
      // }

      if(superResp.get('isOffline')) {
        console.log('WPPWPW')
        return superResp.get('offlineAdapter');
      }

      return superResp.get('offlineAdapter');
      // return superResp;
    }
  });
};

export default {
  name: 'queue-in-store',
  initialize: initialize
};
