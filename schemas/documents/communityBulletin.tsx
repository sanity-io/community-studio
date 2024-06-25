import { Rule } from 'sanity'
import { Icon } from '../components/icons/Icon'

export const communityBulletin = {
  name: 'communityBulletin',
  title: 'Community bulletin',
  icon: () => <Icon emoji="📰" />,
  type: 'document',
  fieldsets: [
    {
      name: 'seo',
      title: 'SEO, Social & Open Graph',
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    {
      name: 'headerTitle',
      title: 'Title in the header of the bulletin',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'headerBody',
      type: 'array',
      title: 'Paragraph below title. Keep it short!',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
        },
      ],
    },
    {
      name: 'seoTitle',
      title: 'Title for SEO',
      type: 'string',
      fieldset: 'seo',
    },
    {
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 1,
      fieldset: 'seo',
    },
    {
      name: 'ogImage',
      title: 'Open graph / sharing image',
      description: '⚡ Optional but highly encouraged',
      type: 'image',
      fieldset: 'seo',
    },
    {
      name: 'frameworks',
      title: 'Highlighted frameworks',
      description: 'Choose the 5 most popular',
      type: 'array',
      of: [
        {
          type: 'reference',
          title: 'Reference to framework',
          to: [{ type: 'taxonomy.framework' }],
        },
      ],
      validation: (rule: Rule) => [
        rule
          .required()
          .min(4)
          .max(5)
          .error('Required field with at least 4 and at most 5 entries.'),
        rule.unique(),
      ],
    },
    {
      name: 'contributorsForSpotlight',
      title: 'Contributor spotlight',
      description:
        "Choose as many people as you want and we'll choose a random person from the list at every visit",
      type: 'array',
      of: [
        {
          type: 'reference',
          title: 'Reference to person',
          to: [{ type: 'person' }],
          options: {
            filter: 'defined(slug.current) && defined(name) && defined(spotlightQuestion)',
          },
        },
      ],
      validation: (rule: Rule) => [
        // rule.required().min(2).error('Required field with at least 2 entries.'),
        rule.unique(),
      ],
    },
    {
      name: 'frameworksTitle',
      type: 'string',
      title: 'Title above frameworks',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'featuredProjectTitle',
      type: 'string',
      title: 'Title for featured project section',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'featuredProjectCta',
      type: 'string',
      title: 'CTA for projects page',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'latestToolsTitle',
      type: 'string',
      title: 'Title for latest tools section',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'latestToolsCta',
      type: 'string',
      title: 'CTA for tools page',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'latestStartersTitle',
      type: 'string',
      title: 'Title for latest starters section',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'latestStartersCta',
      type: 'string',
      title: 'CTA for starters page',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'latestGuidesTitle',
      type: 'string',
      title: 'Title for latest guides section',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'latestGuidesCta',
      type: 'string',
      title: 'CTA for all guides pages',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'activeContributorsTitle',
      type: 'string',
      title: 'Title for recently active contributors section',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'activeContributorsCta',
      type: 'string',
      title: 'CTA for people directory',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'joinCommunityCta',
      title: 'Join the community CTA',
      type: 'object',
      validation: (rule: Rule) => rule.required(),
      fields: [
        {
          name: 'title',
          title: 'Title of the section',
          type: 'string',
          validation: (rule: Rule) => rule.required(),
        },
        {
          name: 'image',
          title: 'Image below the title and above the title',
          type: 'image',
        },
        {
          name: 'becomeContributorCta',
          title: 'CTA text for becoming a contributor',
          type: 'string',
          validation: (rule: Rule) => rule.required(),
        },
        {
          name: 'joinSlackCta',
          title: 'CTA text for joining Slack',
          type: 'string',
          validation: (rule: Rule) => rule.required(),
        },
        {
          name: 'body',
          title: 'Body of content',
          type: 'simpleBlockContent',
          validation: (rule: Rule) => rule.required(),
        },
      ],
    },
    {
      name: 'body',
      type: 'array',
      title: 'Rich text below auto-generated content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
        },
        {
          type: 'image',
          fields: [
            {
              name: 'caption',
              title: 'Visible caption below the image',
              type: 'string',
            },
            {
              name: 'alt',
              title: 'Alternative text for screen readers',
              description:
                '⚡ Optional but highly encouraged to help make the content more accessible',
              type: 'string',
            },
          ],
          options: {
            storeOriginalFilename: false,
          },
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: `Community bulletin`,
      }
    },
  },
}
