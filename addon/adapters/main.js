import offlineMixin from 'ember-data-offline/mixins/offline';
import DS from 'ember-data';
const { Adapter } = DS;

export default Adapter.extend(offlineMixin, {

});
