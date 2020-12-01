import React from 'react';
import Icon from "../components/icon";

export default {
  name: 'communityBulletin',
  title: 'Community bulletin',
  icon: () => <Icon emoji="📰" />,
  type: 'document',
  fields: [
    {
      name: 'frameworks',
      title: 'Highlighted frameworks',
      description: 'Choose the 5 most popular',
      type: 'array',
      of: [
        {
          type: 'reference',
          title: 'Reference to framework',
          to: [{type: 'taxonomy.framework'}],
        },
      ],
      validation: (Rule) => [
        Rule.required()
          .min(4)
          .max(5)
          .error('Required field with at least 4 and at most 5 entries.'),
        Rule.unique(),
      ],
    },
    {
      name: 'featuredProjectTitle',
      type: 'string',
      title: 'Title for featured project section',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'latestToolsTitle',
      type: 'string',
      title: 'Title for latest tools section',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'latestStartersTitle',
      type: 'string',
      title: 'Title for latest starters',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'latestGuidesTitle',
      type: 'string',
      title: 'Title for latest guides section',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'body',
      type: 'array',
      title: 'Rich text below auto-generated content',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading 2', value: 'h2'},
            {title: 'Heading 3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
        },
        {
          type: 'image',
          fields: [
            {
              name: 'caption',
              title: 'Visible caption below the image',
              type: 'string',
              options: {
                isHighlighted: true,
              },
            },
            {
              name: 'alt',
              title: 'Alternative text for screen readers',
              description:
                '⚡ Optional but highly encouraged to help make the content more accessible',
              type: 'string',
              options: {
                isHighlighted: true,
              },
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
      };
    },
  },
};
