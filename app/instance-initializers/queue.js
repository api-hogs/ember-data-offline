export function initialize(instance) {
  let store = instance.container.lookup('store:main');
  let queue = instance.container.lookup('queue:main');
  store.reopen({
    queue: queue,
  });
}

export default {
  name: 'queue-in-store',
  initialize: initialize
};
