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
      name: 'public',
      type: 'boolean',
      title: 'Show on answers page',
      description: 'Whether this tag should be listed with tickets on the answers page',
      initialValue: false,
    },
    {
      name: 'alternatives',
      title: 'Alternative titles',
      type: 'array',
      of: [{type: 'string'}],
    },
  ],
};
