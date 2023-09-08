export const authors = {
  name: 'authors',
  type: 'array',
  title: 'Authors',
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
};
