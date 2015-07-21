import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  name: faker.address.city,
  office: function(i) {
    let id = i + 1;
    return id;
  }
});
