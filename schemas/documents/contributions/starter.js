import { RocketIcon } from '@sanity/icons';

import PathInput from '../../components/PathInput'

export default {
  title: 'Starter',
  name: 'contribution.starter',
  type: 'document',
  icon: RocketIcon,
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
      title: 'Description',
      description:
      'Briefly explain what your starter does, and how it can help others in the community.',
      type: 'text',
      rows: 1,
      validation: (Rule) => [
        Rule.required(),
        Rule.max(300).warning('Try to keep your Description under 300 characters.'),
      ],
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Relative address in the community site',
      description: 'Please avoid special characters, spaces and uppercase letters.',
      inputComponent: PathInput,
      options: {
        basePath: 'sanity.io/starters',
        source: 'title'
      },
    },
    {
      title: 'Github repository ID',
      name: 'repoId',
      description:
        'The repo ID or slug from your starter’s GitHub repository (eg. sanity-io/some-template)',
      type: 'string',
      validation: Rule =>
        Rule.required().regex(/^[\w-]+\/[\w-]+$/, {name: 'repo id'})
    },
    {
      title: '📷 Main image',
      name: 'image',
      description: 'An image or screenshot of your starter. 1200px wide x 750px high is ideal.',
      type: 'image',
      options: {
        hotspot: true,
        storeOriginalFilename: false,
      },
    },
    {
      name: 'authors',
      type: 'array',
      title: '👤 Author(s)',
      description: 'Credit yourself and others with a profile in the Sanity community who helped make this starter.',
      of: [
        {
          type: 'reference',
          to: [{type: 'person'}],
        },
      ],
    },
    {
      name: 'categories',
      title: 'Categories',
      description: 'Connect your starter to common themes in the Sanity community. Let us know if you have more great category ideas.',
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
      title: 'Frameworks used',
      description: 'If this starter is built with a framework like Gatsby & Vue, make the connection for others who also use it. If you can’t find your framework get in touch.',
      // @TODO: description & maybe input component that allows to submit new taxonomy draft inline
      type: 'array',
      of: [{
        type: 'reference',
        title: 'Reference to framework',
        to: [{ type: "taxonomy.framework" }],
      }]
    },
    {
      name: 'integrations',
      title: 'Services this starter integrates with',
      title: 'Integrations & services used',
      description: 'If your tool connects Sanity to other services and APIs. If you can’t find what you’re after get in touch.',
      // @TODO: description & maybe input component that allows to submit new taxonomy draft inline
      type: 'array',
      of: [{
        type: 'reference',
        title: 'Reference to integration',
        to: [{ type: "taxonomy.integration" }],
      }]
    },
    {
      name: 'tools',
      title: 'Sanity tools this starter relies on',
      description: 'Browse for plugins, asset sources, SDKs and other dependencies used in this starter.',
      // @TODO: description & maybe input component that allows to submit new taxonomy draft inline
      type: 'array',
      of: [{
        type: 'reference',
        title: 'Reference to community tools',
        to: [{ type: "contribution.tool" }],
      }]
    },
  ],
}
