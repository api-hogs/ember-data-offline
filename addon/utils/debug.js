import Ember from 'ember';
const { debug } = Ember;

//Later we can remove this, but until stable release we need it
export default function() {
  let errors = Ember.A(arguments);
  let message = errors.reduce((p, n) => {
    return p + n + " :: ";
  }, "");
  debug(`[ember-data-offline]: ${message}`);
}
