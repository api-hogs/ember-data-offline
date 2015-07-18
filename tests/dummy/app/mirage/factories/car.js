import Mirage, {faker} from 'ember-cli-mirage';

export default Mirage.Factory.extend({
  label: function(i) {
    return "Car # " + (i + 1);
  },
  user: function(i) {
    let id = i + 1;
    return id % 2 === 0 ? id / 2 : (i === 0) ? 1 : i;
  }
});
