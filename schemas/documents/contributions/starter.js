import React from 'react'
import Icon from '../../components/icon'
import PathInput from '../../components/PathInput'
import { taxonomiesReferenceField } from '../taxonomies';

export default {
  title: 'Starter',
  name: 'contribution.starter',
  type: 'document',
  icon: () => <Icon emoji="🚀" />,
  // Set the current logged user as an author of a new document
  initialValue: () => {
    const curUserId = window._sanityUser?.id;
    return {
      authors: curUserId
        ? [
            {
              _type: 'reference',
              _ref: curUserId,
            },
          ]
        : [],
      hidden: true,
    };
  },
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
        basePath: 'sanity.io/starters',
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
    {
      name: 'tags',
      title: 'Tags',
      // @TODO: better description & maybe input component that allows to submit new taxonomy draft inline
      description:
        "💡 choose coding languages, frameworks and more related to this starter. If you can't find what you're looking for here, get in touch with Peter or Knut in the Sanity community and they'll add it for you :)",
      type: 'array',
      of: [taxonomiesReferenceField]
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
