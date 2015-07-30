import Ember from 'ember';

var defaults = {
  enabled: true,
};

export default Ember.Object.extend({
  withCustom: Ember.computed('custom', function() {
    return Ember.merge(defaults, this.get('custom'));
  }),
  isEnabled: Ember.computed('withCustom', function() {
    return this.get('withCustom.enabled');
  })
});
