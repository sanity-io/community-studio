import React from 'react';
import Icon from '../components/icon';

export default {
  name: 'showcaseItem',
  type: 'document',
  title: 'Project for the showcase',
  icon: () => <Icon emoji="💎" />,
  /* initialValue: {
    author: getAuthor()
  }, */
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

    // @TODO: is this truly relevant? I imagine there are so many variations related to how people measure time that we won't see too much community value in having it here.
    // {
    //   name: 'duration',
    //   type: 'object',
    //   title: 'Duration',
    //   fields: [
    //     {
    //       name: 'from',
    //       type: 'date',
    //       title: 'From',
    //     },
    //     {
    //       name: 'to',
    //       type: 'date',
    //       title: 'To',
    //       validation: (Rule) => Rule.required().min(Rule.valueOfField('from')),
    //     },
    //   ],
    // },
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
      name: 'technologies',
      type: 'array',
      title: 'Technologies used',
      of: [
        {
          name: 'technology',
          type: 'string',
        },
      ],
    },
    /**
     * @todo: Figure out how best to connect this with solutions on admin.sanity.io
     */
    // {
    //   name: 'solutions',
    //   type: 'array',
    //   title: 'Solutions',
    //   of: [
    //     {
    //       name: 'solutions',
    //       type: 'string',
    //     },
    //   ],
    // },
  ],
  preview: {
    select: {
      media: 'projectScreenshots.0',
      title: 'title',
      subtitle: 'url',
    },
  },
};

/**
 * @todo:
 * - Add collaborators
 */
