import React from 'react';
import Icon from '../components/icon';

export default {
  name: 'studioTutorial',
  title: 'Studio tutorial',
  icon: () => <Icon emoji="📃" />,
  type: 'document',
  fields: [
    // {
    //   name: 'internalTitle',
    //   title: 'Title for internal reference',
    //   description: '⚡ Optional but highly encouraged to make sure we find it later',
    //   type: 'string',
    // },
    {
      name: 'title',
      title: 'Descriptive, short title of the tutorial',
      description:
        '💡 this will show up for users on the tutorial page as well as on the documentation sidebar navigation',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      description:
        '❓ Optional. Use this to complement the title in case that will help users scan through tutorials',
      type: 'string',
    },
    {
      name: 'body',
      title: 'Content',
      description: "Do not include the title here, it's already included in the template",
      type: 'array',
      of: [
        {type: 'block'},
        {
          type: 'image',
          options: {
            storeOriginalFilename: false,
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      description: 'body',
    },
  },
};
