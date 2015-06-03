import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  firstName: faker.name.firstName,
  lastName: faker.name.lastName,
  gender: faker.list.cycle('male', 'female'),
});
