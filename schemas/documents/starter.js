import React from 'react'
import Icon from '../components/icon'
import PathInput from '../components/PathInput'

export default {
  title: 'Starter',
  name: 'starter',
  type: 'document',
  icon: () => <Icon emoji="🚀" />,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Description',
      name: 'description',
      type: 'text',
      rows: 2,
    },
    {
      name: 'slug',
      type: 'slug',
      title: '📬 relative address in the community site site',
      description: '💡 avoid special characters, spaces and uppercase letters.',
      inputComponent: PathInput,
      options: {
        basePath: 'sanity.io/plugins',
        source: 'title'
      },
    },
    {
      title: 'Github repo ID',
      name: 'repoId',
      description:
        'A repo ID/slug for a GitHub repository (eg. sanity-io/some-template)',
      type: 'string',
      validation: Rule =>
        Rule.required().regex(/^[\w-]+\/[\w-]+$/, {name: 'repo id'})
    },
    {
      title: '📷 Image',
      name: 'image',
      description: 'Preferably SVG with aspect ratio 10/12 (portrait)',
      type: 'image'
    },
    {
      name: 'authors',
      type: 'array',
      title: '👤 Author(s)',
      of: [
        {
          type: 'reference',
          to: [{type: 'person'}],
        },
      ],
    },
    /**
     * Missing or debating:
     * branch
     * isPartner
     * staged
     * feed
     * hintsPackage
     * technologies
     * solutions
     */
  ],
}
