import React from 'react'
import { defineField } from 'sanity'

import { PathInput } from '../components/PathInput'
import { SlackUrlInput } from '../components/SlackUrlInput'
import { Icon } from '../components/icons/Icon'
import { LiveIcon } from '../components/icons/LiveIcon'
import actions from '../inputs/actions'
import statuses from '../inputs/statuses'
import { getContributionTaxonomies } from './contributions/contributionUtils'

export const editorial = {
  name: 'editorial',
  type: 'document',
  title: 'Editorial',
  fields: [
    {
      name: 'ticket',
      type: 'reference',
      to: [{ type: 'ticket' }],
      readOnly: true,
    },
    defineField({
      name: 'permalink',
      title: 'Permalink',
      type: 'string',
      readOnly: true,
      components: {
        input: SlackUrlInput,
      },
    }),
    {
      name: 'relevancy',
      title: 'How relevant is this ticket for the sanity.io website?',
      description:
        'Will people extract value from finding this answer in Google and in the website today, tomorrow and a year from now?',
      type: 'number',
      options: {
        list: [
          { value: 0, title: "Won't help future users (don't index)" },
          { value: 25, title: 'Helps with edge cases (findable through Google)' },
          { value: 50, title: 'Answers a common problem (visible in the UI)' },
          { value: 100, title: 'Vital answer (highlighted in search and UI)' },
        ],
        layout: 'radio',
      },
    },
    {
      name: 'editorialTitle',
      title: 'Title to show up in the sanity.io site (if relevant)',
      description:
        "⚡ Optional but highly encouraged. We'll fallback to summary, but you can use this to make the question more surfaceable and search-ready.",
      type: 'text',
      rows: 1,
    },
    {
      name: 'featured',
      title: 'Is this thread featured?',
      type: 'boolean',
    },
    ...getContributionTaxonomies('', {
      solutions: {
        title: 'Related solutions',
      },
      frameworks: {
        title: 'Related frameworks',
      },
      integrations: {
        title: 'Related integrations/services',
      },
      tools: {
        title: 'Related community tools & plugins',
      },
    }).map((field) => ({ ...field, hidden: true })),
    {
      name: 'slug',
      title: '📬 relative address in the community site',
      description:
        "💡 avoid special characters, spaces and uppercase letters. This will be auto-generated in the publish action, so you only need to edit it if you're doing it for SEO and easier shareability.",
      type: 'slug',
      components: {
        input: PathInput,
      },
      options: {
        basePath: 'sanity.io/tickets',
        source: 'title',
        isUnique: () => true,
      },
      // This is auto-generated in the publish action, but authors can overwrite it
      // hidden: true,
    },
    {
      title: 'Summary',
      type: 'text',
      name: 'summary',
      rows: 5,
      description: 'An short description of what the question actually is about.',
    },
    {
      title: 'Next action',
      type: 'string',
      name: 'action',
      options: {
        list: actions,
        layout: 'radio',
        direction: 'horizontal',
      },
    },
    {
      name: 'solvedWith',
      type: 'object',
      title: 'Solved with…',
      description: 'How did we solve this issue? (Optional)',
      fields: [
        {
          name: 'url',
          type: 'url',
          title: 'URL',
          description: 'URL to documentation page, GitHub, demo, etc.',
        },
        {
          name: 'summary',
          type: 'text',
          title: 'Summary',
          rows: 5,
          description: 'Write a short summary if you want to elaborate more.',
        },
      ],
    },
  ],
  preview: {
    select: {
      channelName: 'ticket.channelName',
      status: 'ticket.status',
      summary: 'summary',
      tags0: 'ticket.tags.0.value.current',
      tags1: 'ticket.tags.1.value.current',
      tags2: 'ticket.tags.2.value.current',
      tags3: 'ticket.tags.3.value.current',
      firstMessage: 'ticket.thread.0.content',
      thread: 'ticket.thread',
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
      const tags = [tags0, tags1, tags2].filter(Boolean)
      const tagsList = tags.length ? `${tags.join(', ')}` : '[missing tags]'
      const hasMoreTags = Boolean(tags3)
      const label =
        status !== 'resolved' ? (
          slug ? (
            <div>
              <Icon emoji="🎫" />
              <LiveIcon
                style={{
                  position: 'absolute',
                  width: '10px',
                  height: '10px',
                  bottom: 0,
                  right: 0,
                  marginRight: 0,
                  padding: 0,
                }}
              />
            </div>
          ) : (
            <Icon emoji="🎫" />
          )
        ) : slug ? (
          <div>
            <Icon emoji="✅" />
            <LiveIcon
              style={{
                position: 'absolute',
                width: '18px',
                height: '18px',
                bottom: 0,
                right: 0,
                marginRight: 0,
                padding: 0,
              }}
            />
          </div>
        ) : (
          <Icon emoji="✅" />
        )

      return {
        title: summary || firstMessage,
        subtitle: `${channelName ? `#${channelName},` : ''} ${tagsList}${hasMoreTags ? '...' : ''}`,
        media: label,
      }
    },
  },
}
