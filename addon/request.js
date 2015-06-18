/* global localstorage */
import Ember from 'ember';
import baseMixin from 'ember-data-offline/mixins/base';
import jobMixin from 'ember-data-offline/mixins/job';

export default Ember.Object.createWithMixin(baseMixin, {
  init: function() {
    this.set('offlineAdapter', this);
    this.set('onlineAdapter', this);
  },

  createOfflineJob(url, onlineResp, store) {
    let caller = this;
    let job = Ember.Object.extend(jobMixin).create({
      task() {
        caller.persistOffline(url, onlineResp);
      }
    });
    this.addToQueue(job, store);
  },

  createOnlineJob(url, method, data, store) {
    let caller = this;
    let job = Ember.Object.extend(jobMixin).create({
      task() {
        caller.ajax(url, method, data);
      }
    });
    this.addToQueue(job, store);
  },

  get(url, store) {
    this.make(url, 'get', null, store);
  },

  post(url, data, store) {
    this.make(url, 'post', data, store);
  },

  put(url, data, store) {
    this.make(url, 'put', data, store);
  },

  delete(url, store) {
    this.make(url, 'delete', null, store);
  },

  //fetch stands for online requests and peek for offline ones

  make(url, method, data, store) {
    return Ember.RSVP.resolve().then(() => {
      if (this.get('isOnline')) {
        this.fetch(url, method, data, store);
      } else {
        this.peek(url, method, data, store);
      }
    }).catch(console.log.bind(console));
  },

  fetch(url, method, data, store) {
    let onlineResp = this.ajax(url, method, data);
    this.createOfflineJob(url, onlineResp, store);
    return onlineResp;
  },

  peek(url, method, data, store) {
    let offlineResp = this.requestOffline(url, method, data);
    this.createOnlineJob(url, method, data, store);
    return offlineResp;
  },

  requestOffline(url, method, data) {
    let _method = method.toLowerCase();
    if (_method === 'get') {
      localstorage.getItem(url);
    } else if (_method === 'post' || _method === 'put' || _method === 'patch') {
      localstorage.setItem(url, data);
    } else if (_method === 'delete') {
      localstorage.removeItem(url);
    }
    return Ember.RSVP.Promise.resolve();
  },

  persistOffline(key, onlineResp) {
    onlineResp.then((data) => {
      localstorage.setItem(key, data);
    });
  },

  _defaultParamsForOnline: Ember.computed({
    get() {
      let session = this.container.lookup('simple-auth-sesion:main');
      let defaults = {
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
      };
      if (session && session.get('isAuthenticated')) {
        defaults.headers = {
          "Authorization": 'UserId: ' + session.get('secure.userId'),
        };
      }
      return defaults;
    }
  }),
  ajax: function(url, method, data) {
    let opts = {
      url: url,
      type: method
    };
    let params = Ember.merge(this._defaultParamsForOnline, opts);
    if (data) {
      params.data = data;
    }
    return Ember.$.ajax(params);
  },
});
