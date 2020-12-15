import { PlugIcon } from '@sanity/icons';

import brandColorList from '../../../src/utils/brandColorList'
import PathInput from '../../components/PathInput';

export default {
  name: 'contribution.tool',
  type: 'document',
  title: 'Plugin or tool',
  icon: PlugIcon,
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
      title: 'Source code',
      description:
      'Complete these to let others review your repo and use what you made.',
      options: {collapsible: true, collapsed: false},
    },
    {
      name: 'visuals',
      title: 'Main image',
      description:
      'Give your tool a memorable image and background for display.',
      options: {collapsible: true, collapsed: false},
    },
  ],
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      description:
        'Briefly explain what your tool does, and how it can help others in the community.',
      type: 'text',
      rows: 1,
      validation: (Rule) => [
        Rule.required(),
        Rule.max(300).warning('Try to keep your Description under 300 characters.'),
      ],
    },
    {
      name: 'slug',
      title: 'Relative address in the community site',
      description: 'Please avoid special characters, spaces and uppercase letters.',
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
      description: 'Credit yourself and others with a profile in the Sanity community who helped make this tool.',
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
      title: 'Logo / Icon',
      description:
        'Upload an image related to your tool for easy identification. SVG or transparent PNG logos work great. 300px x 300px for bitmap files if you can.',
      fieldset: 'visuals',
      options: {
        hotspot: true,
        storeOriginalFilename: false,
      },
    },
    {
      title: "Background color",
      description: "Choose a background color from one of the options below.",
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
      title: 'Git repository URL',
      description: 'The repository where this code is stored.',
      fieldset: 'code',
    },
    {
      name: 'readmeUrl',
      type: 'url',
      title: 'Raw README URL',
      description: "We need this to display contents from your tool's README.md in the Sanity site",
      validation: (Rule) => Rule.required(),
      fieldset: 'code',
    },
    {
      name: 'packageUrl',
      type: 'url',
      title: 'Package URL',
      description: 'If your tool lives in a public package directory like NPM, Crates, or Composer – list it here for others.',
      fieldset: 'code',
    },
    // @TODO: does it make sense to provide install commands for npm packages? Such as `npm i metalsmith-sanity`, which isn't applicable to the Sanity studio.
    {
      name: 'installWith',
      type: 'string',
      title: 'Installation command (for studio plugins)',
      description: 'E.g. "sanity install media". Only applicable to plugins.',
      fieldset: 'code',
    },
    {
      name: 'categories',
      title: 'Categories',
      description: 'Connect your tool to common themes in the Sanity community. Let us know if you have more great category ideas.',
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
      title: 'Frameworks used',
      description: 'If this tool relates to a framework like Gatsby & Vue, make the connection for others who also use it. If you can’t find your framework get in touch.',
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
