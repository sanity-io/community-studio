export const slackAuthor = {
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
      hidden: ({currentUser}) => !currentUser.roles.find(({name}) => name == 'administrator'),
    },
    {
      name: 'isSanity',
      title: 'Sanity team',
      type: 'boolean',
      hidden: ({currentUser}) => !currentUser.roles.find(({name}) => name == 'administrator'),
    },
  ],
  preview: {
    select: {
      title: 'slackName',
      subtitle: 'slackId',
    },
  },
};
