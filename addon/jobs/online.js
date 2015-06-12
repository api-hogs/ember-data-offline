import Ember from 'ember';
import jobMixin from 'ember-data-offline/mixins/job';

export default Ember.Object.extend(jobMixin, {
  task() {
    console.log('sync', this.get('method'));
    return this[this.get('method')].apply(this, this.get('params'));
  },

  createRecord(store, type, snapshot, fromJob) {
    let adapter = this.get('adapter');
    return adapter.createRecord(store, type, snapshot, fromJob);
  },

  updateRecord(store, type, snapshot, fromJob) {
    let adapter = this.get('adapter');
    return adapter.updateRecord(store, type, snapshot, fromJob);
  },

  deleteRecord(store, type, snapshot) {
    let adapter = this.get('adapter');
    return adapter.deleteRecord(store, type, snapshot, fromJob);
  },

});
