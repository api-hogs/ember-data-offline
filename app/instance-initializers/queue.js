export function initialize(instance) {
  let store = instance.container.lookup('store:main');
  let queue = instance.container.lookup('queue:main');
  store.reopen({
    queue: queue,
    adapterFor: function() {
      let superResp = this._super.apply(this, arguments);
      if(superResp.get('isOffline')) {
        return superResp.get('offlineAdapter');
      }
      return superResp;
    }
  });
};

export default {
  name: 'queue-in-store',
  initialize: initialize
};
