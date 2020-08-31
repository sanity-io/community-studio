import React from 'react'
import Icon from '../components/Icon'
export default {
  name: 'plugin',
  type: 'document',
  title: 'Plugin',
  icon: () => <Icon emoji="🔌" />,
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Plugin name',
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
