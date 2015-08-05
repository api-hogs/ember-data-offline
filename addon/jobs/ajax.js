import Ember from 'ember';
import jobMixin from 'ember-data-offline/mixins/job';

export default Ember.Object.extend(jobMixin, {
  task() {
    return this.get('ajax').apply(this, this.get('params'));
  },
});
