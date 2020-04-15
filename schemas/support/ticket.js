import React from 'react'
import Icon from '../../src/Icon'
import LabelPicker from '../components/labelPicker'
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
      title: 'Labels',
      type: 'array',
      name: 'labels',
      of: [{ type: 'label' }],
      options: {
        layout: 'tags'
      },
      inputComponent: LabelPicker
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
    },
    prepare({ thread, summary, channelName }) {
      return {
        title: summary || thread,
        subtitle: channelName && `#${channelName}`,
      };
    },
  },
};
