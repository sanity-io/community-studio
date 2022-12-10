import React from 'react';
import {Icon} from '../components/icons/Icon';
import statuses from '../inputs/statuses';
import AutoTag from '../components/AutoTag';
import StatusWithRoles from '../components/StatusWithRoles';
import SaveTicketButton from '../components/SaveTicketButton';
import {LiveIcon} from '../components/Icons/LiveIcon';
import {SlackUrlInput} from '../components/SlackUrlInput';

export default {
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
      title: 'Permalink',
      type: 'url',
      name: 'permalink',
      readOnly: true,
      components: {
        input: SlackUrlInput,
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
      of: [{type: 'reference', to: {type: 'tag'}}],
      readOnly: ({currentUser}) => !currentUser.roles.find(({name}) => name == 'administrator'),
    },
    {
      name: 'addTags',
      title: 'Auto Tag',
      type: 'string',
      components: {
        input: AutoTag,
      },
      hidden: ({currentUser}) => !currentUser.roles.find(({name}) => name == 'administrator'),
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
      hidden: ({currentUser}) => !currentUser.roles.find(({name}) => name == 'administrator'),
    },
    {
      title: 'Thread',
      type: 'array',
      name: 'thread',
      of: [{type: 'message'}],
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
    action: 'none',
  },
  preview: {
    select: {
      channelName: 'channelName',
      status: 'status',
      summary: 'summary',
      tags0: 'tags.0.value.current',
      tags1: 'tags.1.value.current',
      tags2: 'tags.2.value.current',
      tags3: 'tags.3.value.current',
      firstMessage: 'thread.0.content',
      thread: 'thread',
      slug: 'slug.current',
    },
    prepare({
      channelName,
      status,
      summary,
      tags0,
      tags1,
      tags2,
      tags3,
      firstMessage,
      thread,
      slug,
    }) {
      const tags = [tags0, tags1, tags2].filter(Boolean);
      const tagsList = tags.length ? `${tags.join(', ')}` : '[missing tags]';
      const hasMoreTags = Boolean(tags3);
      const label =
        status !== 'resolved' ? (
          slug ? (
            <>
              <Icon emoji="🎫" />
              <LiveIcon />
            </>
          ) : (
            <Icon emoji="🎫" />
          )
        ) : slug ? (
          <>
            <Icon emoji="✅" />
            <LiveIcon />
          </>
        ) : (
          <Icon emoji="✅" />
        );

      const regex = /[^\/]+\/([a-zA-Z0-9]+).*/;
      const pathSegment = window.location.pathname && regex.exec(window.location.pathname)[1];

      let altLabel = <Icon emoji="🗣️" />;
      if (pathSegment == 'alerts') {
        if (status !== 'resolved') {
          if (thread[1] == undefined) {
            altLabel = <Icon emoji="🥖" />;
          }
          if (thread[25]) {
            altLabel = <Icon emoji="🔥" />;
          }
        } else {
          altLabel = <Icon emoji="🕰️" />;
        }
      }
      return {
        title: summary || firstMessage,
        subtitle: `${channelName ? `#${channelName},` : ''} ${tagsList}${hasMoreTags ? '...' : ''}`,
        media: pathSegment == 'alerts' ? altLabel : label,
      };
    },
  },
};
