import React from 'react';
import Icon from '../components/icon';

export default {
  name: 'message',
  title: 'Message',
  type: 'object',
  icon: () => <Icon emoji="📄" />,
  fields: [
    {
      name: 'content',
      title: 'Content',
      type: 'text',
    },
    {
<<<<<<< HEAD
      title: 'Author',
      type: 'slackAuthor',
      name: 'author',
      readOnly: true,
=======
      name: 'author',
      title: 'Author',
      type: 'slackAuthor',
>>>>>>> 62f3a0d
    },
    {
      name: 'timestamp',
      title: 'Timestamp',
      type: 'string',
    },
  ],
  preview: {
    select: {
      title: 'content',
<<<<<<< HEAD
      author: 'author',
=======
      author: 'author.slackName',
>>>>>>> 62f3a0d
      timestamp: 'timestamp',
    },
    prepare({title, author, timestamp}) {
      const ts = new Date(timestamp * 1000);
      return {
        title,
<<<<<<< HEAD
        subtitle: `${
          author.slackName ? author.slackName : author
        }, ${ts.toDateString()} ${ts.toLocaleTimeString([], {
=======
        subtitle: `${author}, ${ts.toDateString()} ${ts.toLocaleTimeString([], {
>>>>>>> 62f3a0d
          hour12: true,
          hour: 'numeric',
          minute: '2-digit',
        })}`,
      };
    },
  },
};
