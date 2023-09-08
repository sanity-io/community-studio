import {CheckmarkCircleIcon} from '@sanity/icons';

export default {
  name: 'landing.getStarted',
  title: 'Landing get started',
  type: 'document',
  icon: CheckmarkCircleIcon,
  fieldsets: [
    {
      name: 'seo',
      title: '🔍 SEO-related fields',
      options: {collapsible: true, collapsed: false},
    },
  ],
  fields: [
    {
      name: 'headerTitle',
      title: 'Title visible on page',
      validation: (Rule) => Rule.required(),
      type: 'string',
    },
    {
      name: 'headerBody',
      title: 'Rich text below the header title',
      description: '❓ Optional',
      type: 'simpleBlockContent',
    },
    {
      name: 'seoTitle',
      title: 'Title for SEO',
      description:
        '⚡ Optional but highly encouraged to increase search engine rankings and conversion rates for this taxonomy',
      type: 'string',
      fieldset: 'seo',
    },
    {
      name: 'seoDescription',
      title: 'Description for SEO',
      description:
        '⚡ Optional but highly encouraged to increase search engine rankings and conversion rates for this taxonomy',
      type: 'string',
      fieldset: 'seo',
    },
    {
      name: 'ogImage',
      title: '📷 Social sharing image / open graph image',
      description:
        '⚡ Optional but highly encouraged to increase click rates in social media platforms',
      type: 'image',
      fieldset: 'seo',
      options: {
        storeOriginalFilename: false,
      },
    },
    {
      name: 'body',
      title: 'Content',
      type: 'array',
      of: [
        {type: 'handpickedContributions'},
        {type: 'getStartedCli'},
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Get Started landing page',
        subtitle: 'sanity.io/get-started',
      };
    },
  },
};
