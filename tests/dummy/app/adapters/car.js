import appAdapter from './application';
import moment from 'moment';

export default appAdapter.extend({
  recordTTL: moment.duration(1, 'minute'),
  throttle: 100
});
