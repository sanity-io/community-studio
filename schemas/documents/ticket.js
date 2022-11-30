import React from 'react';
import Icon from '../components/icon';
import statuses from '../inputs/statuses';
import AutoTag from '../components/AutoTag';
import StatusWithRoles from '../components/StatusWithRoles';

const LiveIcon = () => (
  <svg
    width="12px"
    viewBox="0 0 96 72"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      backgroundColor: '#2276fc',
      borderRadius: '8px',
      padding: '2px',
      position: 'absolute',
      top: '0',
      right: '0',
      height: '12px',
    }}
  >
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g fill="#FFFFFF" fillRule="nonzero">
        <path
          d="M81.6,2.4 C79.5,0.3 76,0.3 73.8,2.4 C71.7,4.5 71.7,8 73.8,10.2 C80.7,17.1 84.5,26.3 84.5,36 C84.5,45.7 80.7,54.9 73.8,61.8 C71.7,63.9 71.7,67.4 73.8,69.6 C74.9,70.7 76.3,71.2 77.7,71.2 C79.1,71.2 80.5,70.7 81.6,69.6 C90.6,60.6 95.5,48.7 95.5,36.1 C95.5,23.3 90.6,11.4 81.6,2.4 Z"
          id="Path"
        ></path>
        <path
          d="M11.5,36 C11.5,26.2 15.3,17.1 22.2,10.2 C24.3,8.1 24.3,4.6 22.2,2.4 C20.1,0.3 16.6,0.3 14.4,2.4 C5.4,11.4 0.5,23.3 0.5,36 C0.5,48.6 5.6,60.8 14.5,69.6 C15.6,70.7 17,71.2 18.4,71.2 C19.8,71.2 21.2,70.7 22.3,69.6 C24.4,67.4 24.4,64 22.2,61.8 C15.4,55.1 11.5,45.7 11.5,36 Z"
          id="Path"
        ></path>
        <path
          d="M67.8,16.3 C65.7,14.1 62.2,14.1 60,16.2 C57.8,18.3 57.8,21.8 59.9,24 C63.1,27.2 64.9,31.5 64.9,36 C64.9,40.5 63.1,44.8 59.9,48 C57.8,50.2 57.8,53.6 60,55.8 C61.1,56.9 62.5,57.4 63.9,57.4 C65.3,57.4 66.7,56.9 67.8,55.8 C73.1,50.5 76,43.5 76,36 C76,28.6 73.1,21.6 67.8,16.3 Z"
          id="Path"
        ></path>
        <path
          d="M36,16.2 C33.9,14.1 30.4,14.1 28.2,16.2 C22.9,21.5 20,28.6 20,36 C20,43.5 22.9,50.5 28.2,55.8 C29.3,56.9 30.7,57.4 32.1,57.4 C33.5,57.4 34.9,56.9 36,55.8 C38.1,53.7 38.1,50.2 36,48 C32.8,44.8 31,40.5 31,36 C31,31.5 32.8,27.2 36,24 C38.2,21.9 38.2,18.4 36,16.2 Z"
          id="Path"
        ></path>
        <circle id="Oval" cx="48" cy="36" r="8.4"></circle>
      </g>
    </g>
  </svg>
);

export default {
  type: 'document',
  name: 'ticket',
  title: 'Ticket',
  icon: () => <Icon emoji="🎫" />,
  fields: [
    {
      title: 'Status',
      type: 'string',
      name: 'status',
      inputComponent: StatusWithRoles,
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
      inputComponent: AutoTag,
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
