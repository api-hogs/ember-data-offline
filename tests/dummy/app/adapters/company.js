import appAdapter from './application';
import moment from 'moment';

export default appAdapter.extend({
  collectionTTL: moment.duration(1, 'hour'),
  recordTTL: moment.duration(5, 'minutes'),
});
