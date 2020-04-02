import React from 'react';
import Icon from '../src/Icon';

export default {
  name: 'person',
  title: 'Person',
  type: 'document',
  icon: () => <Icon emoji="👤" />,

  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name',
    },
    {
      name: 'nickname',
      title: 'Nickname',
      type: 'string',
    },
    {
      name: 'sanityId',
      title: 'Sanity ID',
      type: 'string',
    },
    {
      name: 'github',
      title: 'GitHub Username',
      type: 'string',
    },
    {
      name: 'image',
      type: 'image',
      title: 'Image',
    },
    {
      name: 'bio',
      type: 'array',
      title: 'Bio',
      of: [
        {
          type: 'block',
        },
      ],
    },
  ],
};
