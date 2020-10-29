import React from 'react'
import Icon from '../components/icon'
import userAvatarPreview from '../components/userAvatarPreview'

export default {
  name: 'person',
  title: 'Person',
  type: 'document',
  icon: () => <Icon emoji="👤" />,
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name'
    },
    {
      name: 'public',
      type: 'boolean',
      title: 'Make my profile public',
      description:
        'Do you want to have your profile on sanity.io/community/people/@nickname?'
    },
    {
      name: 'nickname',
      title: 'Nickname',
      type: 'slug',
      // @todo: Add additional validation to avoid NSFW stuff?
      // @todo: Add an “are you sure” publish action if this changes
      description: 'If you change this your current URL will break',
      options: {
        source: 'name'
      }
    },
    {
      name: 'photo',
      type: 'image',
      title: 'Image',
      fields: [
        {
          name: 'alt',
          type: 'string',
          description: `Describe the photo for people who can't view it`
        }
      ]
    },
    {
      name: 'imageUrl',
      type: 'url',
      title: 'User avatar',
      inputComponent: userAvatarPreview
    },
    {
      name: 'email',
      type: 'email',
      title: 'Contact email',
      description:
        'Initial value from Auth0, but editable if you want to change it'
    },
    {
      name: 'bio',
      type: 'array',
      title: 'Bio',
      description:
        'Who are you? What do you do? What have you done? One unexpected thing about yourself.',
      of: [
        {
          type: 'block'
        }
      ]
    },
    {
      name: 'work',
      type: 'object',
      title: 'Work',
      fields: [
        {
          name: 'company',
          type: 'string',
          title: 'Company name',
          description:
            'Name of your workplace, your own company, or “Freelance” etc'
        },
        {
          name: 'url',
          type: 'url',
          title: 'Company URL'
        },
        {
          name: 'title',
          type: 'string',
          title: 'Job title'
        }
      ]
    },
    {
      name: 'social',
      type: 'object',
      title: 'Social links',
      fields: [
        'Dribbble',
        'GitLab',
        'Medium',
        'Behance',
        'LinkedIn',
        'StackOverflow',
        'Youtube',
        'Facebook',
        'Twitch',
        'Mastodon',
        'Instagram'
      ].map(vendor => ({
        name: vendor.toLowerCase(),
        title: vendor,
        type: 'string'
      }))
    },
    {
      name: 'slackId',
      title: 'Slack ID',
      type: 'string'
      // @todo: Instructions on how to find your slack id
      // description: ''
    },
    {
      name: 'sanityId',
      title: 'Sanity ID',
      type: 'string',
      description: 'Added automatically on document creation',
      hidden: true
    },
    {
      name: 'github',
      title: 'GitHub Username',
      type: 'string',
      description: 'Added by Auth0',
      hidden: true
    }
  ]
}
