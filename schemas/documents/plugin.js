import React from 'react';
import Icon from '../components/icon';
import PathInput from '../components/PathInput';
import { taxonomiesReferenceField } from './taxonomies';

export default {
  name: 'plugin',
  type: 'document',
  title: 'Plugin or tool',
  icon: () => <Icon emoji="🔌" />,
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
  fieldsets: [
    {
      name: 'code',
      title: 'Source code, npm and readme information',
      options: {collapsible: true, collapsed: false},
    },
  ],
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Plugin/tool name',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Headline / short description for the tool',
      description:
        'Use this space to explain briefly what it is and how it may help other Sanity community members.',
      type: 'text',
      rows: 1,
    },
    {
      name: 'slug',
      title: '📬 relative address in the community site site',
      description: '💡 avoid special characters, spaces and uppercase letters.',
      type: 'slug',
      inputComponent: PathInput,
      options: {
        basePath: 'sanity.io/plugins',
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
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
      name: 'gitUrl',
      type: 'url',
      title: 'Github or Gitlab URL of the repository',
      description: 'The repository for where this code is stored.',
      fieldset: 'code',
    },
    {
      name: 'readmeUrl',
      type: 'url',
      title: '📖 URL to the raw readme file',
      description: "We'll use that to render your tool's readme in the Sanity site",
      validation: (Rule) => Rule.required(),
      fieldset: 'code',
    },
    {
      name: 'npmUrl',
      type: 'url',
      title: 'npm package URL',
      description: 'In case you deployed it to npm',
      fieldset: 'code',
    },
    // @TODO: does it make sense to provide install commands for npm packages? Such as `npm i metalsmith-sanity`, which isn't applicable to the Sanity studio.
    {
      name: 'installWith',
      type: 'string',
      title: 'Command to install it in Sanity studio (for studio plugins)',
      description: 'Ex: sanity install media. Feel free to ignore this if not applicable.',
      fieldset: 'code',
    },
    {
      name: 'tags',
      title: 'Tags',
      // @TODO: better description & maybe input component that allows to submit new taxonomy draft inline
      description:
        "💡 choose coding languages, frameworks and more related to this plugin. If you can't find what you're looking for here, get in touch with Peter or Knut in the Sanity community and they'll add it for you :)",
      type: 'array',
      of: [taxonomiesReferenceField]
    },
    {
      name: 'image',
      type: 'image',
      title: '📷 Logo',
      description:
        'Is there any image that describes your project? If you can, provide a transparent PNG to fit nicely in the community.',
    },
    // Hidden fields populated automatically
    {
      name: 'readme',
      title: 'Readme',
      description: 'Populated from the readme URL above',
      type: 'markdown',
      hidden: true,
    },
    /**
     * Missing / debating:
     * npm - I think only the markdown portion is valuable
     * screenshots - wasn't being used, so I removed it
     * lengthier description - wasn't being used, so I removed it
     * brandColor - is it truly necessary? What if we generate them automatically?
     * color - I think this was replaced by brandColor
     */
  ],
};
