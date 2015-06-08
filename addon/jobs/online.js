import Ember from 'ember';
import jobMixin from 'ember-data-offline/mixins/job';

export default Ember.Object.extend(jobMixin, {
  task() {
    return this[this.get('method')].apply(this, this.get('params'));
  },

  createRecord(store, type, snapshot) {
    let adapter = this.get('adapter');
    return adapter.createRecord(store, type, snapshot);
  },

  updateRecord(store, type, snapshot) {
    let adapter = this.get('adapter');
    return adapter.updateRecord(store, type, snapshot);
  },

  deleteRecord(store, type, snapshot) {
    let adapter = this.get('adapter');
    return adapter.deleteRecord(store, type, snapshot);
  },

});
