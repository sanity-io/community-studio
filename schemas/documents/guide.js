import React from 'react'
import Icon from '../components/icon'

export default {
  name: 'guide',
  type: 'document',
  title: 'Guide',
  icon: () => <Icon emoji="🧶" />,
  preview: {
    select: {
      title: 'title',
      hidden: 'hidden',
      type: '_type'
    },
    prepare: selection => {
      const {title, hidden, type} = selection
      const result = {title}
      const sub = [type]
      if (hidden) {
        sub.push('hidden')
      }
      result.subtitle = `[${sub.join('] [')}]`
      return result
    }
  },
  fieldsets: [
    {
      name: 'external',
      title: '🌐 Fields exclusive to external guides',
      description: '💡 use this if you\'re plugging an article hosted in another site. If you plan to write the content here, skip this section.',
      options: { collapsible: true, collapsed: true },
    },
    {
      name: 'internal',
      title: '📩 For internal guides',
      description: 'If will publish your content in the Sanity site, this section is for you 😉',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
    },
    {
      title: 'Hide it in the Sanity community?',
      name: 'hidden',
      type: 'boolean',
      description: 'Set this to conceal the article while you work on it.'
    },
    {
      name: 'authors',
      type: 'authors',
      title: 'Authors'
    },
    {
      title: 'Poster Image',
      name: 'poster',
      type: 'image',
      description: 'Give the guide a poster image if pertinent.',
      fields: [
        {
          title: 'Caption',
          name: 'caption',
          type: 'string',
          options: {
            isHighlighted: true
          }
        },
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Alternative text for screenreaders. Falls back on caption if not set',
          options: {
            isHighlighted: true
          }
        }
      ]
    },
    {
      title: 'Categories',
      name: 'categories',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
        list: [
          {value: 'portableText', title: 'Portable Text'},
          {value: 'groq', title: 'GROQ'},
          {value: 'frontEnd', title: 'Front End'},
          {value: 'dashboard', title: 'Dashboard'},
          {value: 'migration', title: 'Migration'},
          {value: 'schema', title: 'Schema'},
          {value: 'studio', title: 'Studio'},
          {value: 'contentModeling', title: 'Content Modeling'}
        ]
      }
    },
    {
      title: 'Description',
      name: 'description',
      type: 'string',
      description: 'Hints regarding article content. Used in previews etc.'
    },
    {
      title: 'Slug',
      name: 'slug',
      type: 'slug',
      fieldset: 'internal',
      required: true,
      options: {
        source: 'title',
        auto: true
      }
    },
    {
      title: 'Preamble',
      name: 'preamble',
      fieldset: 'internal',
      type: 'richText',
      description: 'Lead text for the guide'
    },
    {
      name: 'body',
      type: 'richText',
      fieldset: 'internal',
      title: 'Content'
    },
    {
      name: 'externalLink',
      type: 'url',
      title: 'External link',
      fieldset: 'external',
      description: 'For guides published elsewhere. This will override some of the fields.'
    },
    {
      title: 'Related',
      name: 'related',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'guide'}]}]
    },
  ],
  initialValue: {
    hidden: true
  },
}
