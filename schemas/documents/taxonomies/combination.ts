import CombinationIcon from '../../components/icons/CombinationIcon';
import {getTaxonomySchema} from './getTaxonomy';

export default getTaxonomySchema({
  name: 'combination',
  title: 'Taxonomy combination',
  description: 'Used to generate SEO-ready landing pages for a combination of taxonomies',
  icon: CombinationIcon,
  // Combinations' slugs are auto-generated by the chosen taxonomies, so we hide the default one
  includeSlug: false,
  extraFields: [
    {
      name: 'taxonomies',
      title: 'Taxonomies combined',
      type: 'array',
      validation: (Rule) => [
        Rule.required().min(2).error('We need at least two taxonomies'),
        Rule.unique(),
      ],
      of: [
        {
          type: 'reference',
          title: 'Reference to a taxonomy',
          to: [
            {type: 'taxonomy.framework'},
            {type: 'taxonomy.language'},
            {type: 'taxonomy.cssframework'},
            {type: 'taxonomy.usecase'},
            {type: 'taxonomy.integration'},
            {type: 'taxonomy.category'},
            {type: 'taxonomy.solution'},
            {type: 'taxonomy.contributionType'},
          ],
        },
      ],
    },
  ],
});
