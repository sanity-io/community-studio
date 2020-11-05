import React from 'react';
import Icon from '../components/Icon';
import PathInput from '../components/PathInput';

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
      name: 'slug',
      title: 'Where should it appear on the sanity community?',
      description: '💡 avoid special characters, spaces and uppercase letters.',
      type: 'slug',
      inputComponent: PathInput,
      options: {
        basePath: 'sanity.io/plugins',
      },
    },
    {
      name: 'gitUrl',
      type: 'url',
      title: 'Github or Gitlab URL of the repository',
      description: 'The repository for where this code is stored.',
    },
    {
      name: 'readmeUrl',
      type: 'url',
      title: 'URL to the raw readme file',
      description: "We'll use that to render your tool's readme in the Sanity site",
    },
    {
      name: 'npmUrl',
      type: 'url',
      title: 'npm package URL',
      description: 'In case you deployed it to npm',
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
      name: 'headline',
      title: 'Headline / short description for the tool',
      description:
        'Use this space to explain briefly what it is and how it may help other Sanity community members.',
      type: 'text',
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
      description: 'Populated from the git URL above',
      type: 'text',
    },
    /**
     * Missing:
     * npm (only got markdown so far)
     * solutions
     * screenshots
     * lengthier description
     * installWith
     * brandColor
     * color
     */
  ],
};
