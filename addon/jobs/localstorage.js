import Ember from 'ember';
import jobMixin from 'ember-data-offline/mixins/job';

export default Ember.Object.extend(jobMixin, {
  perform (){
    this[this.get('method')].apply(this.get('adapter'), this.get('params'));
  },

  findAll(store, typeClass, sinceToken, adapterResp){
    adapterResp.then(records => {
      this.persistData(typeClass, records);
    });
  },

  find(store, typeClass, id, snapshot, onlineResp){
    let adapter = this;
    //check offline storage
    Ember.RSVP.resolve().then(() => {
      return this.get('offlineAdapter').find(store, typeClass, id, snapshot);
    }).then(offineRecord => {
      if (Ember.isEmpty(offineRecord)) {
        return onlineResp;
      }
    }).then(onlineRecord => {
      if (!Ember.isEmpty(onlineRecord)) {
        this.persistData(typeClass, onlineRecord);
      }
    }).catch(() => {
        onlineResp.then(onlineRecord => {
          if (!Ember.isEmpty(onlineRecord)) {
            adapter.persistData(typeClass, onlineRecord);
          }
        });
    });
  }

});
