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
      title: 'Name',
      type: 'string'
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
      type: 'string'
    },
    {
      name: 'photo',
      title: 'Image',
      type: 'image',
      fields: [
        {
          name: 'alt',
          type: 'string',
          description: `Describe the photo for people who can't view it.`
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
        'Initial value from Auth0, but editable if you want to change it.'
    },
    {
      name: 'location',
      type: 'string',
      title: 'Location',
      description:
        'Where are you based?'
    },
    {
      name: 'headline',
      type: 'string',
      title: 'Headline',
      description:
        'This will appear directly under your name on your profile, blog posts, etc.',
    },
    {
      name: 'bio',
      type: 'array',
      title: 'Bio',
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
          title: 'Company name',
          type: 'string',
          description:
            'Name of your workplace, your own company, or "Freelance" etc.'
        },
        {
          name: 'url',
          title: 'Company URL',
          type: 'url'
        },
        {
          name: 'title',
          title: 'Job title',
          type: 'string'
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
      description: 'Added automatically on document creation.',
      hidden: true
    },
    {
      name: 'github',
      title: 'GitHub username',
      type: 'string',
      description: 'Added by Auth0.',
      hidden: true
    },
    {
      name: 'joinedDate',
      type: 'date',
      title: 'Joined date',
      hidden: true
    }
  ]
}
