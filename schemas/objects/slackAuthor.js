export default {
  name: 'slackAuthor',
  title: 'Slack author',
  type: 'object',
  fields: [
    {
      name: 'slackName',
      title: 'Slack name',
      type: 'string',
    },
    {
      name: 'slackId',
      title: 'Slack ID',
      type: 'string',
    },
    {
      name: 'isSanity',
      title: 'Sanity team',
      type: 'boolean',
    },
  ],
  preview: {
    select: {
      title: 'slackName',
      subtitle: 'slackId',
    },
  },
};
