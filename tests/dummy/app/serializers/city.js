import DS from 'ember-data';

export default DS.RESTSerializer.extend(DS.EmbeddedRecordsMixin, { 
  attrs: {
    office: { embedded: 'always' },
  },
});
