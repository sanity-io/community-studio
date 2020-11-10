import {getTaxonomySchema} from './getTaxonomy';

export default getTaxonomySchema({
  name: 'combination',
  title: 'Taxonomy combination',
  description: 'Used to generate SEO-ready landing pages for a combination of taxonomies',
  emoji: '🧠',
  extraFields: [
    {
      name: 'taxonomies',
      title: 'Taxonomies combined',
      type: 'array',
      of: [
        {
          type: 'reference',
          title: 'Reference to a taxonomy',
          to: [
            {type: 'taxonomy.framework'},
            {type: 'taxonomy.language'},
            {type: 'taxonomy.integrationType'},
            {type: 'taxonomy.integration'},
            {type: 'taxonomy.projectType'},
            {type: 'taxonomy.solution'},
            {type: 'taxonomy.contributionType'},
          ],
        },
      ],
    },
  ],
});
