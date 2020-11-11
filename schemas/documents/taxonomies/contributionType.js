import {getTaxonomySchema} from './getTaxonomy';

export default getTaxonomySchema({
  name: 'contributionType',
  title: 'Contribution type',
  emoji: "🎁",
  description:
    'Used by taxonomy.combination to create landing pages, as well as by each individual type page to fetch SEO fields',
  // Types' slugs are set in stone and won't change, no need for author control here
  includeSlug: false,
  extraFields: [
    {
      name: 'slug',
      title: 'Slug for this type',
      description: "This is immutable, don't worry about it 😉",
      type: 'slug',
      readOnly: true,
      // hidden: true,
    },
  ],
});
