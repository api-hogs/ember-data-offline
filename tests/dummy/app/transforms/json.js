import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize(serialized) {
    return serialized;
  },

  serialize(deserialized) {
    //TODO Mention this in README. This is quite important thing, that can break down persistance
    return JSON.parse(JSON.stringify(deserialized));
  }
});
