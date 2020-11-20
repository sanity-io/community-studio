import React from 'react'
import Icon from '../../components/icon'
import PathInput from '../../components/PathInput'

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
    };
  },
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      name: 'description',
      title: 'Headline / short description for the starter',
      description:
        'Use this space to explain briefly the features of the starter.',
      type: 'text',
      rows: 1,
    },
    {
      name: 'slug',
      type: 'slug',
      title: '📬 relative address in the community site',
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
      type: 'image',
      options: {
        hotspot: true
      },
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
      name: 'categories',
      title: 'Category(ies)',
      description: 'Get in touch if you don\'t find the category you were looking for',
      // @TODO: description & maybe input component that allows to submit new taxonomy draft inline
      type: 'array',
      of: [{
        type: 'reference',
        title: 'Reference to starter categories',
        to: [{ type: "taxonomy.category" }],
        options: {
          filter: "$type in applicableTo",
          filterParams: {
            type: "contribution.starter"
          }
        }
      }]
    },
    {
      name: 'frameworks',
      title: 'Framework(s) / tech used by this starter',
      description: 'Get in touch if you don\'t find the tech you were looking for',
      // @TODO: description & maybe input component that allows to submit new taxonomy draft inline
      type: 'array',
      of: [{
        type: 'reference',
        title: 'Reference to framework',
        to: [{ type: "taxonomy.framework" }],
      }]
    },
  ],
}
