import Ember from 'ember';
import jobMixin from 'ember-data-offline/mixins/job';

export default Ember.Object.extend(jobMixin, {
  task() {
    return this[this.get('method')].apply(this.get('adapter'), this.get('params'));
  },

  findAll(store, typeClass, sinceToken, adapterResp){
    let offlineAdapter = this.get('offlineAdapter');
    adapterResp.then(records => {
      if (!Ember.isEmpty(records)) {
        offlineAdapter.persistData(typeClass, records);
      }
    });
  },

  find(store, typeClass, id, snapshot, onlineResp){
    let adapter = this;
    let offlineAdapter = adapter.get('offlineAdapter');
    //check offline storage
    Ember.RSVP.resolve().then(() => {
      return offlineAdapter.find(store, typeClass, id, snapshot);
    }).then(offineRecord => {
      if (Ember.isEmpty(offineRecord)) {
        return onlineResp;
      }
    }).then(onlineRecord => {
      if (!Ember.isEmpty(onlineRecord)) {
        offlineAdapter.persistData(typeClass, onlineRecord);
      }
    }).catch(() => {
        onlineResp.then(onlineRecord => {
          if (!Ember.isEmpty(onlineRecord)) {
            offlineAdapter.persistData(typeClass, onlineRecord);
          }
        });
    });
  }

});
