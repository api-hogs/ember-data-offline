import request from 'ember-data-offline/request';

export function initialize(container, app) {
  container.register('ember-data-offline:request', request);

  app.inject('EDORequest', 'store', 'service:store');
  app.inject('route', 'EDORequest', 'ember-data-offline:request');
  app.inject('controller', 'EDORequest', 'ember-data-offline:request');
  app.inject('model', 'EDORequest', 'ember-data-offline:request');
  app.inject('component', 'EDORequest', 'ember-data-offline:request');
};

export default {
  name: 'edo-request',
  initialize: initialize
};
