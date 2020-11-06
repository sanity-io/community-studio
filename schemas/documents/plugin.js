import React from 'react';
import Icon from '../components/icon';
import PathInput from '../components/PathInput';

export default {
  name: 'plugin',
  type: 'document',
  title: 'Plugin or tool',
  icon: () => <Icon emoji="🔌" />,
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
      name: 'headline',
      title: 'Headline / short description for the tool',
      description:
        'Use this space to explain briefly what it is and how it may help other Sanity community members.',
      type: 'text',
      rows: 1,
    },
    {
      name: 'slug',
      title: 'Where should it appear on the sanity community?',
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
      title: 'Author(s)',
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
      title: 'URL to the raw readme file',
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
    // @TODO: turn these into documents
    {
      title: 'Categories',
      name: 'categories',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
        list: [
          {value: 'inputComponent', title: 'Input component'},
          {value: 'studioTool', title: 'Studio tool'},
          {value: 'assetSource', title: 'Asset source'},
          {value: 'dashboardWidget', title: 'Dashboard widget'},
          {value: 'importAndMigration', title: 'Import and migration'},
          {value: 'clients', title: 'Clients and SDKs'},
          {value: 'portableText', title: 'Portable Text'},
          {value: 'groq', title: 'GROQ'},
          {value: 'other', title: 'Other'},
        ],
      },
    },
    // @TODO: turn these into documents
    {
      name: 'solutions',
      title: 'Solutions',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'logo',
      type: 'image',
      title: 'Logo',
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
