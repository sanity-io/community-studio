import React from 'react';
import {Icon} from '../components/icons/Icon';

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
      name: 'author',
      title: 'Author',
      type: 'slackAuthor',
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
      author: 'author.slackName',
      timestamp: 'timestamp',
    },
    prepare({title, author, timestamp}) {
      const ts = new Date(timestamp * 1000);
      return {
        title,
        subtitle: `${author}, ${ts.toDateString()} ${ts.toLocaleTimeString([], {
          hour12: true,
          hour: 'numeric',
          minute: '2-digit',
        })}`,
      };
    },
  },
};
