import Ember from 'ember';
import Queue from 'ember-data-offline/queue';

export function initialize(container, application) {
  console.log("WWHHWH", Queue)
  container.register('queue:main', Queue);

  application.inject('store', 'queue', 'queue:main');
}

export default {
  name: 'data-offline-queue',
  after: 'store',
  initialize: initialize
};

