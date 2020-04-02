import React from 'react'
import Icon from '../../src/Icon'
import statuses from './statuses'
import categories from './categories'

export default {
  type: 'document',
  name: 'ticket',
  title: 'Support Tickets',
  icon: () => <Icon emoji="🎫" />,
  fields: [
    {
      title: 'Summary',
      type: 'string',
      name: 'summary',
      description:
        'An ultra-concise description of what the question actually is about. E.g.: "Render image in portable text". Makes it easier to keep track in the tickets table'
    },
    {
      title: 'Channel name',
      type: 'string',
      name: 'channelName',
      readOnly: true
    },
    {
      title: 'Status',
      type: 'string',
      name: 'status',
      options: {
        list: statuses,
        layout: 'radio',
        direction: 'horizontal'
      }
    },
    {
      title: 'Category',
      type: 'string',
      name: 'category',
      options: {
        list: categories,
        layout: 'radio',
        direction: 'horizontal'
      }
    },
    {
      title: 'Author name',
      type: 'string',
      name: 'authorName',
      readOnly: true
    },
    {
      title: 'Agent',
      name: 'assigned',
      type: 'reference',
      weak: false,
      to: [{type: 'person'}]
    },
    {
      title: 'Message',
      type: 'text',
      name: 'message',
      readOnly: true
    },

    {
      title: 'Permalink',
      type: 'url',
      name: 'permalink',
      readOnly: true
    }
  ],
  initialValue: {status: 'open'},
  preview: {
    select: {
      message: 'message',
      summary: 'summary',
      channelName: 'channelName'
    },
    prepare({message, summary, channelName}) {
      return {
        title: summary || message,
        subtitle: channelName && `#${channelName}`
      }
    }
  }
}
