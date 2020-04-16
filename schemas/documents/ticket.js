import React from 'react'
import Icon from '../components/icon'
import TagPicker from '../components/tagPicker'
import statuses from '../inputs/statuses'
import categories from '../inputs/categories'

export default {
  type: 'document',
  name: 'ticket',
  title: 'Ticket',
  liveEdit: true,
  icon: () => <Icon emoji="🎫" />,
  fields: [
    {
      title: 'Summary',
      type: 'text',
      name: 'summary',
      description:
        'An ultra-concise description of what the question actually is about. E.g.: "Render image in portable text". Makes it easier to keep track in the tickets table',
    },
    {
      title: 'Channel name',
      type: 'string',
      name: 'channelName',
      readOnly: true,
    },
    {
      title: 'Status',
      type: 'string',
      name: 'status',
      options: {
        list: statuses,
        layout: 'radio',
        direction: 'horizontal',
      },
    },
    {
      title: 'Category',
      type: 'string',
      name: 'category',
      options: {
        list: categories,
        layout: 'radio',
        direction: 'horizontal',
      },
    },
    {
      title: 'Tags',
      type: 'array',
      name: 'tags',
      of: [{ type: 'tag' }],
      options: {
        layout: 'tags'
      },
      inputComponent: TagPicker
    },
    {
      title: 'Agent',
      name: 'assigned',
      type: 'reference',
      weak: false,
      to: [{ type: 'person' }],
    },
    {
      title: 'Author name',
      type: 'string',
      name: 'authorName',
      readOnly: true,
    },
    {
      title: 'Opened by',
      type: 'string',
      name: 'openedBy',
      readOnly: true,
    },
    {
      title: 'Thread',
      type: 'array',
      name: 'thread',
      of: [{ type: 'message' }],
      readOnly: true,
    },
    {
      title: 'Permalink',
      type: 'url',
      name: 'permalink',
      readOnly: true,
    },
  ],
  initialValue: { status: 'open' },
  preview: {
    select: {
      thread: 'thread.0.content',
      summary: 'summary',
      channelName: 'channelName',
      status: 'status'
    },
    prepare({ thread, summary, channelName, status }) {
      return {
        title: summary || thread,
        subtitle: channelName && `#${channelName}`,
        media: status !== 'resolved' ? <Icon emoji="🎫" /> : <Icon emoji="✅" />,
      };
    },
  },
};
