import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  _id: function(i) {
    return i + 1;
  },
  firstName: faker.name.firstName,
  lastName: faker.name.lastName,
  gender: faker.list.cycle('male', 'female'),
  cars: function(i) {
    let id = i + 1;
    return [2 * id - 1, 2 * id];
  },
  skills: function(i) {
    let id = i + 1;
    return [{id: id, title: `Skill#${i}`}, {id: id + 1, title: `Skill#${i + 1}`}];
  }
});
