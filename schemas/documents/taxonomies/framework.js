import {getTaxonomySchema} from './getTaxonomy';

export default getTaxonomySchema({
  name: 'framework',
  title: 'Framework',
  extraFields: [
    {
      name: 'language',
      title: 'Language',
      type: 'reference',
      to: [{type: 'taxonomy.language'}],
    },
  ],
});
