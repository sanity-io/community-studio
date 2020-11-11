import {getTaxonomySchema} from './getTaxonomy';

export default getTaxonomySchema({
  name: 'category',
  title: 'Category',
  emoji: "📦",
  extraFields: [
    {
      name: 'applicableTo',
      title: 'Applicable to what types?',
      type: 'array',
      of: [{ type: 'string'}],
      options: {
        list: [
          {
            value: 'guide',
            title: 'Guides',
          },
          {
            value: 'plugin',
            title: 'Plugins & tools',
          },
          {
            value: 'showcaseItem',
            title: 'Showcase projects',
          },
          {
            value: 'starter',
            title: 'Starters',
          },
        ]
      }
    },
  ],
});
