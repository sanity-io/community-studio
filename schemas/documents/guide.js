import React from 'react'
import Icon from '../components/icon'

export default {
  name: 'guide',
  type: 'document',
  title: 'Guide',
  icon: () => <Icon emoji="🧶" />,
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
    },
    {
      name: 'authors',
      type: 'authors',
      title: 'Authors'
    },
    {
      name: 'content',
      type: 'richText',
      title: 'Content'
    }
  ]
}
