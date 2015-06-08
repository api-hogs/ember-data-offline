import Ember from 'ember';
import jobMixin from 'ember-data-offline/mixins/job';

const { isEmpty, RSVP } = Ember;

export default Ember.Object.extend(jobMixin, {
  task() {
    return this[this.get('method')].apply(this, this.get('params'));
  },

  findAll(store, typeClass, sinceToken, adapterResp) {
    let offlineAdapter = this.get('adapter');
    adapterResp.then(records => {
      if (!isEmpty(records)) {
        offlineAdapter.persistData(typeClass, records);
      }
    });
  },

  _findWithCheck: function(onlineResp, store, typeClass, ...params) {
    let offlineAdapter = this.get('adapter');

    RSVP.resolve().then(() => {
      return offlineAdapter.find(store, typeClass, ...params);
    }).then(offineRecord => {
      if (isEmpty(offineRecord)) {
        return onlineResp;
      }
    }).then(onlineRecord => {
      if (!isEmpty(onlineRecord)) {
        offlineAdapter.persistData(typeClass, onlineRecord);
      }
    }).catch(() => {
      onlineResp.then(onlineRecord => {
        if (!isEmpty(onlineRecord)) {
          offlineAdapter.persistData(typeClass, onlineRecord);
        }
      });
    });
  },

  find(store, typeClass, id, snapshot, onlineResp) {
    this._findWithCheck(onlineResp, store, typeClass, id, snapshot);
  },

  findQuery(store, typeClass, query, onlineResp) {
    this._findWithCheck(onlineResp, store, typeClass, query);
  },

  findMany(store, typeClass, ids, snapshots, onlineResp) {
    this._findWithCheck(onlineResp, store, typeClass, ids, snapshots);
  },
});
