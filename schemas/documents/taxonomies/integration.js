import {getTaxonomySchema} from './getTaxonomy';

export default getTaxonomySchema({
  name: 'integration',
  title: 'Integration / service',
  extraFields: [
    {
      name: 'type',
      title: 'Integration type',
      type: 'reference',
      to: [{type: 'taxonomy.integrationType'}],
    },
  ],
});
