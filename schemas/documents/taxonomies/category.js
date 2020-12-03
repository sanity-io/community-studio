import {getTaxonomySchema} from './getTaxonomy';

export default getTaxonomySchema({
  name: 'category',
  title: 'Category',
  emoji: '📦',
  extraFields: [
    {
      name: 'applicableTo',
      title: 'Applicable to what types?',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {
            value: 'contribution.guide',
            title: 'Guides',
          },
          {
            value: 'contribution.tool',
            title: 'Plugins & tools',
          },
          {
            value: 'contribution.showcaseProject',
            title: 'Showcase projects',
          },
          {
            value: 'contribution.starter',
            title: 'Starters',
          },
          {
            value: 'contribution.schema',
            title: 'Schemas',
          },
          {
            value: 'contribution.snippet',
            title: 'Snippets',
          },
          {
            value: 'contribution.event',
            title: 'Events',
          },
          {
            value: 'person',
            title: 'Contributors / Authors / People',
          },
        ],
      },
    },
  ],
});
