import React from 'react';
import Icon from '../../components/icon';

export default {
  name: 'contribution.showcaseProject',
  type: 'document',
  title: 'Project for the showcase',
  icon: () => <Icon emoji="💎" />,
  // Set the current logged user as an author of a new document
  initialValue: () => {
    const curUserId = window._sanityUser?.id;
    return {
      authors: curUserId
        ? [
            {
              _type: 'reference',
              _ref: curUserId,
            },
          ]
        : [],
    };
  },
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Project name',
    },
    {
      name: 'url',
      type: 'url',
      title: 'URL',
    },
    {
      name: 'authors',
      title: '👤 Author(s)',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            {
              type: 'person',
            },
          ],
        },
      ],
    },
    {
      name: 'studioScreenshots',
      type: 'array',
      title: 'Sanity Studio Screenshots',
      description:
        'Some suggestions for what to screenshot: your desk structure; the dashboard and other tools installed; your most interesting schema, etc.', // @todo: find instructions for how to take the best screenshot
      of: [
        {
          type: 'studioImage',
        },
      ],
    },
    {
      name: 'projectScreenshots',
      type: 'array',
      title: 'Screenshots of the project',
      // description: 'Here’s how to take a nice screenshot', // @todo: find instructions for how to take the best screenshot
      of: [
        {
          type: 'image',
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              options: {
                isHighlighted: true,
              },
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description:
                "Help people who for any reason can't download or see the image by providing a descriptive text about what it contains 😇",
              options: {
                isHighlighted: true,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'categories',
      title: 'Category(ies)',
      description: 'Get in touch if you don\'t find the category you were looking for',
      // @TODO: description & maybe input component that allows to submit new taxonomy draft inline
      type: 'array',
      of: [{
        type: 'reference',
        title: 'Reference to showcase categories',
        to: [{ type: "taxonomy.category" }],
        options: {
          filter: "$type in applicableTo",
          filterParams: {
            type: "contribution.showcaseProject"
          }
        }
      }]
    },
    {
      name: 'frameworks',
      title: 'Framework(s) / tech you used when creating this',
      description: 'Get in touch if you don\'t find the tech you were looking for',
      // @TODO: description & maybe input component that allows to submit new taxonomy draft inline
      type: 'array',
      of: [{
        type: 'reference',
        title: 'Reference to framework',
        to: [{ type: "taxonomy.framework" }],
      }]
    },
  ],
  preview: {
    select: {
      media: 'projectScreenshots.0',
      title: 'title',
      subtitle: 'url',
    },
  },
};