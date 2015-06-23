import Ember from 'ember';

var findAllObject = Ember.Object.create({});
var findObject = Ember.Object.create({});
var findQueryObject = Ember.Object.create({});

var syncLoads = Ember.Object.create({
  findAll: findAllObject,
  find: findObject,
  findQuery: findQueryObject
});

var normalizeModelName = function(modelName) {
  return Ember.String.dasherize(modelName);
};

export function initialize(instance) {

  let store = instance.container.lookup('store:main');
  let queue = instance.container.lookup('data-offline-queue:main');

  store.reopen({
    EDOQueue: queue,
    syncLoads: syncLoads,

    adapterFor: function(typeClass) {
      let superResp = this._super.apply(this, arguments);

      return superResp.get('offlineAdapter');
    },
    modelFor: function(key) {
      var factory;

      if (typeof key === 'string') {
        factory = this.modelFactoryFor(key);
        if (!factory) {
          //Support looking up mixins as base types for polymorphic relationships
          factory = this._modelForMixin(key);
        }
        if (!factory) {
          throw new Ember.Error("No model was found for '" + key + "'");
        }
        factory.modelName = factory.modelName || normalizeModelName(key);
      } else {
        // A factory already supplied. Ensure it has a normalized key.
        factory = key;
        if (factory.modelName) {
          factory.modelName = normalizeModelName(factory.modelName);
        }
      }

      // deprecate typeKey
      if (!('typeKey' in factory)) {
        Ember.defineProperty(factory, 'typeKey', {
          enumerable: true,
          configurable: false,
          get: function() {
            Ember.deprecate('Usage of `typeKey` has been deprecated and will be removed in Ember Data 1.0. It has been replaced by `modelName` on the model class.');
            return Ember.String.camelize(this.modelName);
          },
          set: function() {
            Ember.assert('Setting typeKey is not supported. In addition, typeKey has also been deprecated in favor of modelName. Setting modelName is also not supported.');
          }
        });
      }

      factory.store = this;
      return factory;
    },
  });
};

export default {
  name: 'queue-in-store',
  initialize: initialize
};
