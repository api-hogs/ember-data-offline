import Ember from 'ember';
import baseMixin from 'ember-data-offline/mixins/base';

export default Ember.Object.create(baseMixin, {
  init: function(){
    this.set('offlineAdapter', this);
    this.set('onlineAdapter', this);
  },
  get: function(url){
    if (this.get('online')){
      //setup Job for offline after fetch with method
    }
    else{
     //setup Job online....
    }
  },

  _makeOnlineRequest: function(url){

  },

  fetchOffline: function(url){

  }
});
