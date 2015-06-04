import DS from 'ember-data';
const {Model, attr} = DS;

export default Model.extend({
  firstName: attr('string'),
  lastName: attr('string'),
  gender: attr('string'),
});
