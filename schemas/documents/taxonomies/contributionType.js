import {GiftIcon} from '../../components/icons/GiftIcon';
import {getTaxonomySchema} from './getTaxonomy';

export default getTaxonomySchema({
  name: 'contributionType',
  title: 'Contribution type',
  icon: GiftIcon,
  description:
    'Used by taxonomy.combination to create landing pages, as well as by each individual type page to fetch SEO fields',
  // Types' slugs are set in stone and won't change, no need for author control here
  includeSlug: false,
  // These are always indexable
  includeIndexable: false,
  extraFields: [
    {
      name: 'contributionType',
      title: 'Applicable to what type of contribution?',
      description: "This isn't customizable, don't worry about this field :)",
      type: 'string',
      hidden: true,
      readOnly: true,
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
            value: 'contribution.event',
            title: 'Events',
          },
        ],
      },
    },
    //TODO add these fields when we have a use for them
    // {
    //   name: 'customSections',
    //   title: 'Custom sections before recent contributions',
    //   description:
    //     'Optional. Add if you want editorial control over the content before the most recent contributions feed.',
    //   type: 'array',
    //   of: [{type: 'handpickedContributions'}, {type: 'getStartedCli'}],
    // },
  ],
});
