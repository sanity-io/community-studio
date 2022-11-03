import React from 'react';
import Icon from '../components/icon';

export default {
  name: 'tag',
  title: 'Tag',
  type: 'document',
  icon: () => <Icon emoji="🏷️" />,
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'value',
      title: 'Value',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'alternatives',
      title: 'Alternative titles',
      type: 'array',
      of: [{type: 'string'}],
    },
  ],
};
