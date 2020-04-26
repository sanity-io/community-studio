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
      title: 'Name',
    },
    {
      name: 'nickname',
      title: 'Nickname',
      type: 'string',
    },
    {
      name: 'sanityId',
      title: 'Sanity ID',
      type: 'string',
      desciption: 'Sanity UserID',
      readOnly: true
    },
    {
      name: 'github',
      title: 'GitHub Username',
      type: 'string',
    },
    {
      name: 'image',
      type: 'image',
      title: 'Image',
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
      title: 'email',
      readOnly: true
    },
    {
      name: 'bio',
      type: 'array',
      title: 'Bio',
      of: [
        {
          type: 'block',
        }
      ]
    }
  ]
}
