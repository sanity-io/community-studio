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
        basePath: 'sanity.io/partners',
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
      description: 'Brief introduction of how Sanity and this product play together. Keep it short, 3 lines maximum.',
      name: 'shortDesc',
      type: 'text',
      rows: 3,
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
      description: 'In some applications of the logo, we\'ll put a background with this color behind it.',
      type: 'color',
      validation: (Rule) => Rule.required(),
    },
    // Start references
    {
      title: 'Related taxonomy',
      name: 'taxonomy',
      type: 'reference',
      to: [
        {type: 'taxonomy.integration'},
        {type: 'taxonomy.framework'},
      ]
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
      name: 'techProjects',
      type: 'array',
      title: 'Partner Project(s)',
      description: 'Handpicked selection of the best community projects made with this product.',
      of: [
        {
          type: 'reference',
          to: [{type: 'contribution.showcaseProject'}],
          title: 'Partner Projects',
        },
      ],
    },
    {
      name: 'techStarters',
      type: 'array',
      title: 'Partner Starter(s)',
      description: 'Handpicked selection of the starters made with this product.',
      of: [
        {
          type: 'reference',
          to: [{type: 'contribution.starter'}],
          title: 'Partner Starters',
        },
      ],
    },
    {
      name: 'techPlugins',
      type: 'array',
      title: 'Partner Plugin(s)',
      description: 'Handpicked selection of plugins made with this product.',
      of: [
        {
          type: 'reference',
          to: [{type: 'contribution.tool'}],
          title: 'Partner Plugins',
        },
      ],
    },
    {
      name: 'techSnippets',
      type: 'array',
      title: 'Partner Snippet(s)',
      description: 'Handpicked selection of snippets made with this product.',
      of: [
        {
          type: 'reference',
          to: [{type: 'contribution.schema'}],
          title: 'Partner Snippets',
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
