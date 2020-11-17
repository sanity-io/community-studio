import React from 'react';

import brandColorList from '../../../src/utils/brandColorList'
import Icon from '../../components/icon';
import PathInput from '../../components/PathInput';

export default {
  name: 'contribution.tool',
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
    {
      name: 'visuals',
      title: 'On-site visual customization',
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
      name: 'image',
      type: 'image',
      title: '📷 Logo / image for the tool',
      description:
        'Is there any image that describes your project? If you can, provide a transparent PNG to fit nicely in the community.',
      fieldset: 'visuals'
    },
    {
      title: "Color to complement the image",
      description: "We'll be used for the background of the image, so make sure it's not the same color as the PNG you set above.",
      name: "color",
      type: "colors", // custom color-list input
      fieldset: 'visuals',
      options: {
        borderradius: {
          outer: "100%",
          inner: "100%"
        },
        list: brandColorList
      }
    },
    {
      name: 'repositoryUrl',
      type: 'url',
      title: 'URL of the git repository',
      description: 'The repository where this code is stored.',
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
      name: 'packageUrl',
      type: 'url',
      title: 'Package URL on npm, crates, composer, etc.',
      description: 'In case you deployed it to a public package registry',
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
      name: 'categories',
      title: 'Category(ies)',
      description: 'Get in touch if you don\'t find the category you were looking for',
      // @TODO: description & maybe input component that allows to submit new taxonomy draft inline
      type: 'array',
      of: [{
        type: 'reference',
        title: 'Reference to tool categories',
        to: [{ type: "taxonomy.category" }],
        options: {
          filter: "$type in applicableTo",
          filterParams: {
            type: "contribution.tool"
          }
        }
      }]
    },
    {
      name: 'frameworks',
      title: 'Framework(s) / tech related to this tool',
      description: 'Get in touch if you don\'t find the tech you were looking for',
      // @TODO: description & maybe input component that allows to submit new taxonomy draft inline
      type: 'array',
      of: [{
        type: 'reference',
        title: 'Reference to framework',
        to: [{ type: "taxonomy.framework" }],
      }]
    },
    // Hidden fields populated automatically
    {
      name: 'readme',
      title: 'Readme',
      description: 'Populated from the readme URL above',
      type: 'markdown',
      hidden: true,
    },
  ],
};
