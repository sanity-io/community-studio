import {IceCreamIcon} from '@sanity/icons';

export const contest = {
  name: 'taxonomy.contest',
  title: 'Contest',
  icon: IceCreamIcon,
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
  ],
};
