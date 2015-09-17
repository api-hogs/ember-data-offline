import DS from 'ember-data';
const { Model, attr, hasMany } = DS;

export default Model.extend({
  firstName: attr('string'),
  lastName: attr('string'),
  gender: attr('string'),
  cars:  hasMany('car', {async: true}),
  skills: attr('json')
});
