import {getTaxonomySchema} from './getTaxonomy';

export default getTaxonomySchema({
  name: 'contributionType',
  title: 'Contribution type',
  description:
    'Used by taxonomy.combination to create landing pages, as well as by each individual type page to fetch SEO fields',
  // Types' slugs are set in stone and won't change, no need for author control here
  includeSlug: false,
  extraFields: [
    {
      name: 'type',
      title: 'Type',
      description: "This is immutable, don't worry about it 😉",
      type: 'string',
      readOnly: true,
      // hidden: true,
      options: {
        layout: 'radio',
        list: [
          {
            value: 'guide',
            title: 'Guide',
          },
          {
            value: 'plugin',
            title: 'Plugin / tool',
          },
          {
            value: 'showcaseItem',
            title: 'Project for the showcase',
          },
          {
            value: 'starter',
            title: 'Starter',
          },
        ],
      },
    },
  ],
});
