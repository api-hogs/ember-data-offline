import Mirage, { faker } from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name: faker.address.city,
  office: function(i) {
    let office = {
      id: i + 1,
      address: faker.address.country(),
      city: i + 1,
      company: i + 1
    };
    return office;
  }
});
