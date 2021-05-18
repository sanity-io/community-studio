import React from 'react'
import TwitterIcon from './TwitterIcon'

import StaticTweet from './StaticTweet'
import TwitterEmbedInput from './TwitterEmbedInput'

export default {
  name: 'twitterEmbed',
  title: 'Twitter embed',
  type: 'object',
  icon: TwitterIcon,
  inputComponent: TwitterEmbedInput,
  preview: {
    select: {
      data: 'data',
      includes: 'includes',
      statusUrl: 'statusUrl',
    },
    component: ({value = {}}) => <StaticTweet {...value} />,
  },
  // @TODO: custom diff component
  // diffComponent: TwitterEmbedDiff,
  fields: [
    {
      name: 'statusUrl',
      title: 'URL of the tweet / status',
      type: 'url',
    },
    {
      name: 'data',
      title: 'Data (comes from API)',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Text',
          type: 'text',
        },
        {
          name: 'id',
          title: 'Tweet id',
          type: 'string',
        },
        {
          name: 'author_id',
          title: "Author's d",
          type: 'string',
        },
        {
          name: 'created_at',
          title: 'Created at',
          type: 'datetime',
        },
        {
          name: 'public_metrics',
          title: 'Metrics',
          type: 'object',
          fields: [
            {
              name: 'retweet_count',
              title: 'Retweet count',
              type: 'number',
            },
            {
              name: 'reply_count',
              title: 'reply count',
              type: 'number',
            },
            {
              name: 'like_count',
              title: 'like count',
              type: 'number',
            },
            {
              name: 'quote_count',
              title: 'quote count',
              type: 'number',
            },
          ],
        },
      ],
      hidden: true,
    },
    {
      name: 'includes',
      title: 'Includes (comes from API)',
      type: 'object',
      fields: [
        {
          name: 'media',
          title: 'Media',
          type: 'array',
          of: [
            {
              name: 'media_entry',
              title: 'Media entry',
              type: 'object',
              fields: [
                {
                  name: 'media_key',
                  title: 'Media key',
                  type: 'string',
                },
                {
                  name: 'preview_image_url',
                  title: 'Preview Image Url',
                  type: 'url',
                },
                {
                  name: 'type',
                  title: 'Media type',
                  type: 'string', // video, image
                },
              ],
            },
          ],
        },
        {
          name: 'users',
          title: 'Users',
          type: 'array',
          of: [
            {
              name: 'user_entry',
              title: 'User entry',
              type: 'object',
              fields: [
                {
                  name: 'username',
                  title: 'Username',
                  type: 'string',
                },
                {
                  name: 'name',
                  title: 'Name',
                  type: 'string',
                },
                {
                  name: 'id',
                  title: 'Id',
                  type: 'string',
                },
                {
                  name: 'profile_image_url',
                  title: 'profile Image Url',
                  type: 'url',
                },
              ],
            },
          ],
        },
      ],
      hidden: true,
    },
  ],
}
