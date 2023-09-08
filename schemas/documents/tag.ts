import {TagIcon} from '@sanity/icons';

export const tag = {
  name: 'tag',
  title: 'Tag',
  type: 'document',
  icon: TagIcon,
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
