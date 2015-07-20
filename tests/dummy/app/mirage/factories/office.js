import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  address: faker.address.streetAddress,
  company: function(i) {
    let id = i + 1;
    return id;
  }
});
