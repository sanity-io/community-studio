//Content type for Sanity partners

import brandColorList from '../../src/utils/brandColorList';
import PathInput from '../components/PathInput';

export default {
  title: 'Technology Partner',
  name: 'techPartner',
  type: 'document',

  fields: [
    {
      title: 'Company Name',
      name: 'companyName',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      title: 'One-liner about the product',
      name: 'oneLiner',
      description: 'In a short sentence, what does this product offer?',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Relative address in the site',
      description: 'Please avoid special characters, spaces and uppercase letters.',
      type: 'slug',
      inputComponent: PathInput,
      options: {
        basePath: 'sanity.io/technology-partners',
        source: 'companyName',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      title: '👀 Hide this partner?',
      name: 'hidden',
      type: 'boolean',
      description: 'Turn this on to stop this partnership from being seen while you work on it.',
    },
    {
      title: 'Short Description',
      description:
        'Brief introduction of how Sanity and this product play together. Keep it short, 3 lines maximum.',
      name: 'shortDesc',
      type: 'text',
      rows: 3,
    },
    {
      title: 'Partner Website',
      description: 'Link to partner website',
      name: 'partnerSite',
      type: 'url',
    },
    {
      title: 'Long Description',
      name: 'longDesc',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      title: 'Logos',
      name: 'partnerLogos',
      type: 'figure',
      description:
        'Ideally this image has a transparent background for use over other images or on non-white backgrounds.',
    },
    {
      name: 'color',
      title: 'Brand color',
      description:
        "In some applications of the logo, we'll put a background with this color behind it.",
      type: 'color',
      validation: (Rule) => Rule.required(),
    },
    // Start references
    {
      title: 'Community category',
      description:
        'Each product has its own taxonomy in the community which is used by contributors to tag their creations. If you want to automatically pull every contribution tagged with this product, just add it below. Else, feel free to leave it empty.',
      name: 'taxonomy',
      type: 'reference',
      to: [{type: 'taxonomy.integration'}, {type: 'taxonomy.framework'}],
    },
    {
      name: 'editors',
      type: 'array',
      title: '🖊️ Editor(s)',
      description: 'People from the team who should have edit access to this document.',
      of: [
        {
          type: 'reference',
          to: [{type: 'person'}],
        },
      ],
    },
    {
      name: 'officialContributions',
      type: 'array',
      title: 'Selection of tools, guides, starters, etc.',
      description:
        "Handpicked selection of official creations made with this product. If you don't find what you're looking for here, make sure to publish it as a contribution.",
      of: [
        {
          type: 'reference',
          to: [
            {type: 'contribution.showcaseProject'},
            {type: 'contribution.starter'},
            {type: 'contribution.tool'},
            {type: 'contribution.schema'},
            {type: 'contribution.guide'},
          ],
          title: 'Reference to published contributions',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'companyName',
      subtitle: 'oneLiner',
      media: 'partnerLogos.logoTransparent',
    },
  },
};
