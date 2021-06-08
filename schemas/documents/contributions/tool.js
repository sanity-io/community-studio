import {PlugIcon} from '@sanity/icons';
import client from 'part:@sanity/base/client';

import brandColorList from '../../../src/utils/brandColorList';
import PathInput from '../../components/PathInput';
import {contributionInitialValue, getContributionTaxonomies, ogImageField, publishedAtField} from './contributionUtils';

export default {
  name: 'contribution.tool',
  type: 'document',
  title: 'Plugin or tool',
  icon: PlugIcon,
  initialValue: contributionInitialValue,
  fieldsets: [
    {
      name: 'code',
      title: 'Source code',
      description: 'Complete these to let others review your repo and use what you made.',
      options: {collapsible: true, collapsed: false},
    },
    {
      name: 'visuals',
      title: 'Main image',
      description: 'Give your tool a memorable image and background for display.',
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
    ogImageField,
    publishedAtField,
    {
      name: 'authors',
      type: 'array',
      title: '👤 Author(s)',
      description:
        'Credit yourself and others with a profile in the Sanity community who helped make this tool.',
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
      title: 'Background color',
      description: 'Choose a background color from one of the options below.',
      name: 'color',
      type: 'colors', // custom color-list input
      fieldset: 'visuals',
      options: {
        borderradius: {
          outer: '100%',
          inner: '100%',
        },
        list: brandColorList,
      },
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
      description:
        "We need this to display contents from your tool's README.md in the Sanity site. Please provide the *raw* version of the file so that we can extract its markdown content. Example: https://raw.githubusercontent.com/sanity-io/community-studio/staging/README.md",
      validation: (Rule) => [
        Rule.required(),
        Rule.custom((value, {document}) => {
          if (typeof value !== 'string' || !value) {
            return true;
          }
          // Non-raw: https://github.com/sanity-io/community-studio/blob/staging/README.md
          // Raw: https://raw.githubusercontent.com/sanity-io/community-studio/staging/README.md
          if (value.includes('github.com')) {
            const ghUrlSegments = value.replace('https://github.com/', '').split('/');
            const repoId = ghUrlSegments.slice(0, 2).join('/');
            let filePath = ghUrlSegments
              .slice(2)
              // We don't care about the "blob" in the URL
              .filter((segment) => segment !== 'blob')
              .join('/');

            // If the person provided only the repository URL, we'll infer the file is master/README.md
            if (!filePath?.length) {
              filePath = 'master/README.md';
            }

            const finalUrl = `https://raw.githubusercontent.com/${repoId}/${filePath}`;

            client
              .patch(document._id)
              .set({
                readmeUrl: finalUrl,
              })
              .commit()
              .then(() => {
                return true;
              });
          }
          return true;
        }),
      ],
      fieldset: 'code',
    },
    {
      name: 'packageUrl',
      type: 'url',
      title: 'Package URL',
      description:
        'If your tool lives in a public package directory like NPM, Crates, or Composer – list it here for others.',
      fieldset: 'code',
    },
    {
      name: 'installWith',
      type: 'string',
      title: 'Installation command',
      description: 'In case your code can be installed with one command. E.g. "sanity install media", "npm i  @sanity/client", "cargo install sanity"',
      fieldset: 'code',
    },
    // Hidden fields populated automatically
    {
      name: 'readme',
      title: 'Readme',
      description: 'Populated from the readme URL above',
      type: 'markdown',
      hidden: true,
    },
    ...getContributionTaxonomies('tool', {
      solutions: {
        title: 'Categories',
        description: 'Connect your tool to common themes in the Sanity community.',
      },
      categories: {
        title: 'Categories',
        description: 'Connect your tool to common themes in the Sanity community.',
      },
      frameworks: {
        title: 'Frameworks used',
        description:
          'If this tool relates to a framework like Gatsby & Vue, make the connection for others who also use it. If you can’t find your framework get in touch.',
      },
      integrations: {
        title: 'Integrations & services used',
        description:
          'If your tool connects Sanity to other services and APIs. If you can’t find what you’re after get in touch.',
      },
    }),
    {
      title: 'Contest Tags',
      name: 'contests',
      type: 'array',
      description: "If you entered this in a contest, add the contest here",
      of: [
        {
          type: 'reference',
          to: [
            {type: 'taxonomy.contest'},
          ],
        },
      ],
    },
  ],
};
