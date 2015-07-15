import Ember from 'ember';
const { debug } = Ember;

//Later we can remove this, but until stable release we need it
export default function() {
  let message = [].reduce.call(arguments, function(a, b) {
    return a + b + " :: ";
  }, "");
  debug(`[ember-data-offline]: ${message}`);
}
