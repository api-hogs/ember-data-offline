import Ember from 'ember';

export function initialize(instance) {

  let store = instance.container.lookup('service:store');
  let queue = instance.container.lookup('data-offline-queue:main');

  store.reopen({
    EDOQueue: queue
  });
}

export default {
  name: 'queue-in-store',
  initialize: initialize
};
