import React from 'react';
import Icon from '../../components/icon';
import { taxonomiesReferenceField } from '../taxonomies';

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
      name: 'tags',
      title: 'Tags',
      // @TODO: better description & maybe input component that allows to submit new taxonomy draft inline
      description:
        "💡 choose coding languages, frameworks and more related to this project. If you can't find what you're looking for here, get in touch with Peter or Knut in the Sanity community and they'll add it for you :)",
      type: 'array',
      of: [taxonomiesReferenceField]
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