import baseAdapter from 'ember-data-offline/adapters/base';
import config from '../config/environment';

export default baseAdapter.extend({
  offlineNamespace: config.ns,
});
