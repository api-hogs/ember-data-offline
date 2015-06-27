import Ember from 'ember';
import baseMixin from 'ember-data-offline/mixins/base';

export default Ember.Mixin.create(baseMixin, {
  findAll: function(store, typeClass, sinceToken, fromJob) {
    return this._super.apply(this, arguments).then(records => {
      if (!fromJob) {
        this.createOnlineJob('findAll', [store, typeClass, sinceToken, true], store);
      }
      return records;
    }).catch(console.log.bind(console));
  },

  find: function(store, typeClass, id, snapshot, fromJob) {
    return this._super.apply(this, arguments).then(record => {
      if (!fromJob) {
        this.createOnlineJob('find', [store, typeClass, id, snapshot, true], store);
      }
      if (Ember.isEmpty(record)) {
       return {id:id};
      }
      return record;
    }).catch(console.log.bind(console));
  },

  loadRelationships: function(store, type, record) {
    var adapter = this;
    if (record) {
      return new Ember.RSVP.Promise(function(resolve) {
        var relationshipNames, relationships,
          relationshipPromises = [];

        relationshipNames = Ember.get(type, 'relationshipNames');
        relationships = relationshipNames.belongsTo;
        relationships = relationships.concat(relationshipNames.hasMany);


        relationships.forEach(function(relationName) {
          var relationModel = type.typeForRelationship(relationName),
            relationEmbeddedId = record[relationName],
            relationProp = adapter.relationshipProperties(type, relationName),
            relationType = relationProp.kind,
            /**
             * This is the relationship field.
             */
            promise, embedPromise;

          var opts = {
            allowRecursive: false
          };

          /**
           * embeddedIds are ids of relations that are included in the main
           * payload, such as:
           *
           * {
           *    cart: {
           *      id: "s85fb",
           *      customer: "rld9u"
           *    }
           * }
           *
           * In this case, cart belongsTo customer and its id is present in the
           * main payload. We find each of these records and add them to _embedded.
           */
          var embeddedAlways = adapter.isEmbeddedAlways(store, type.modelName, relationProp.key);

          // For embeddedAlways-style data, we assume the data to be present already, so no further loading is needed.

          if (relationEmbeddedId && !embeddedAlways) {
            if (relationType === 'belongsTo' || relationType === 'hasOne') {
              promise = adapter.find(store, relationModel, relationEmbeddedId, opts, true);
            } else if (relationType === 'hasMany') {
              promise = adapter.findMany(store, relationModel, relationEmbeddedId, opts, true);
            }

            embedPromise = new Ember.RSVP.Promise(function(resolve) {
              promise.then(function(relationRecord) {
                if (relationRecord) {
                  var finalPayload = adapter.addEmbeddedPayload(record, relationName, relationRecord);
                  resolve(finalPayload);

                }

              });
            });

            relationshipPromises.push(embedPromise);
          }
        });

        Ember.RSVP.all(relationshipPromises).then(function() {
          resolve(record);
        });
      });

    }
    return Ember.RSVP.resolve();
  },

  addEmbeddedPayload: function(payload, relationshipName, relationshipRecord) {
    var objectHasId = (relationshipRecord && relationshipRecord.id),
      arrayHasIds = (relationshipRecord[0] && relationshipRecord.length && relationshipRecord.everyBy("id")),
      isValidRelationship = (objectHasId || arrayHasIds);

    if (isValidRelationship) {
      if (!payload._embedded) {
        payload._embedded = {};
      }

      payload._embedded[relationshipName] = relationshipRecord;
      if (relationshipRecord.length) {
        payload[relationshipName] = relationshipRecord.mapBy('id');
      } else {
        payload[relationshipName] = relationshipRecord.id;
      }
    }

    if (this.isArray(payload[relationshipName])) {
      payload[relationshipName] = payload[relationshipName].filter(function(id) {
        return id;
      });
    }

    return payload;
  },

  findQuery: function(store, type, query, fromJob) {
    return this._super.apply(this, arguments).then(record => {
      if (!fromJob) {
        this.createOnlineJob('findQuery', [store, type, query, true], store);
      }
      return record;
    }).catch(console.log.bind(console));
  },

  findMany: function(store, type, ids, snapshots, fromJob) {
    return this._super.apply(this, arguments).then(records => {
      if (!fromJob) {
        this.createOnlineJob('findMany', [store, type, ids, snapshots, true], store);
      }
      let isValidRecords = records.reduce((p, n) => {
        return p && n;
      }, true);
      if (Ember.isEmpty(isValidRecords)) {
        return []; 
      }
      return records;
    }).catch(console.log.bind(console));
  },

  createRecord(store, type, snapshot, fromJob) {
    //think about merge id....very important. maybe unload Record, and push Record...
    if (!fromJob) {
      this.createOnlineJob('createRecord', [store, type, snapshot, true], store);
    }
    return this._super.apply(this, arguments);
  },

  updateRecord(store, type, snapshot, fromJob) {
    if (!fromJob) {
      this.createOnlineJob('updateRecord', [store, type, snapshot, true], store);
    }
    return this._super.apply(this, arguments);
  },

  deleteRecord(store, type, snapshot, fromJob) {
    if (!fromJob) {
      this.createOnlineJob('deleteRecord', [store, type, snapshot, true], store);
    }
    return this._super.apply(this, arguments);
  }
});
