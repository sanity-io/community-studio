import AutoTag from '../components/AutoTag'
import SaveTicketButton from '../components/SaveTicketButton'
import StatusWithRoles from '../components/StatusWithRoles'
import { Icon } from '../components/icons/Icon'
import statuses from '../inputs/statuses'

export const ticket = {
  type: 'document',
  name: 'ticket',
  title: 'Ticket',
  icon: () => <Icon emoji="🎫" />,
  fields: [
    {
      name: 'saveTicket',
      type: 'string',
      components: {
        input: SaveTicketButton,
      },
    },
    {
      title: 'Status',
      type: 'string',
      name: 'status',
      components: {
        input: StatusWithRoles,
      },
      options: {
        list: statuses,
        layout: 'radio',
        direction: 'horizontal',
      },
    },
    {
      title: 'Tags',
      type: 'array',
      name: 'tags',
      of: [{ type: 'reference', to: { type: 'tag' } }],
      readOnly: ({ currentUser }) => !currentUser.roles.find(({ name }) => name == 'administrator'),
    },
    {
      name: 'addTags',
      title: 'Auto Tag',
      type: 'string',
      components: {
        input: AutoTag,
      },
      hidden: ({ currentUser }) => !currentUser.roles.find(({ name }) => name == 'administrator'),
    },
    {
      title: 'Channel name',
      type: 'string',
      name: 'channelName',
      readOnly: true,
    },
    {
      title: 'Author',
      type: 'slackAuthor',
      name: 'author',
      readOnly: true,
    },
    {
      title: 'Opened by',
      type: 'string',
      name: 'openedBy',
      readOnly: true,
      hidden: ({ currentUser }) => !currentUser.roles.find(({ name }) => name == 'administrator'),
    },
    {
      title: 'Thread',
      type: 'array',
      name: 'thread',
      of: [{ type: 'message' }],
      readOnly: true,
    },
    {
      name: 'threadCreated',
      type: 'datetime',
      title: 'Created',
      readOnly: true,
      hidden: true,
    },
    {
      name: 'threadUpdated',
      type: 'datetime',
      title: 'Last updated',
      readOnly: true,
      hidden: true,
    },
    {
      name: 'threadFirstClosed',
      type: 'datetime',
      title: 'Closed',
      readOnly: true,
      hidden: true,
    },
    {
      name: 'threadClosed',
      type: 'datetime',
      title: 'Closed',
      readOnly: true,
      hidden: true,
    },
  ],
  initialValue: {
    status: 'open',
  },
  preview: {
    select: {
      channelName: 'channelName',
      status: 'status',
      tags0: 'tags.0.value.current',
      tags1: 'tags.1.value.current',
      tags2: 'tags.2.value.current',
      tags3: 'tags.3.value.current',
      firstMessage: 'thread.0.content',
      thread: 'thread',
    },
    prepare({ channelName, status, tags0, tags1, tags2, tags3, firstMessage, thread }) {
      const tags = [tags0, tags1, tags2].filter(Boolean)
      const tagsList = tags.length ? `${tags.join(', ')}` : '[missing tags]'
      const hasMoreTags = Boolean(tags3)
      const label = status !== 'resolved' ? <Icon emoji="🎫" /> : <Icon emoji="✅" />

      return {
        title: firstMessage,
        subtitle: `${channelName ? `#${channelName},` : ''} ${tagsList}${hasMoreTags ? '...' : ''}`,
        media: label,
      }
    },
  },
}
