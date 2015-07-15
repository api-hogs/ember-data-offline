import Ember from 'ember';
const { debug } = Ember.Logger;

//Later we can remove this, but until stable release we need it
export default function() {
  debug('[ember-data-offline]:', Array.prototype.slice.call(arguments, 0).toString());
}
