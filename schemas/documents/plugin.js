import React from 'react'
import Icon from '../components/Icon'

export default {
  name: 'plugin',
  type: 'document',
  title: 'Plugin or tool',
  icon: () => <Icon emoji="🔌" />,
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Plugin/tool name',
    },
    {
      name: 'url',
      type: 'url',
      title: 'URL'
    },
    {
      name: 'authors',
      type: 'array',
      title: 'Authors',
      of: [
        {
          type: 'reference', to: [{type: 'person'}]
        }
      ]
    }
  ]
}
