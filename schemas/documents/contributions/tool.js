import {PlugIcon} from '@sanity/icons';
import client from 'part:@sanity/base/client';

import brandColorList from '../../../src/utils/brandColorList';
import PathInput from '../../components/PathInput';
import {
  contributionInitialValue,
  getContributionTaxonomies,
  ogImageField,
  publishedAtField,
} from './contributionUtils';

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
      type: 'string', // custom color-list input
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
      name: 'studioVersion',
      title: 'Studio version',
      type: 'number',
      description: 'If this is installable in Sanity Studio, specify which version its for.',
      fieldset: 'code',
      initialValue: -1,
      options: {
        layout: 'radio',
        direction: 'horizontal',
        list: [
          {value: -1, title: 'N/A'},
          {value: 2, title: 'Studio V2'},
          {value: 3, title: 'Studio V3'},
        ],
      },
    },
    {
      name: 'packageUrl',
      type: 'url',
      title: 'Package URL',
      description:
        'If your tool lives in a public package directory like NPM, Crates, or Composer – list it here for others.',
      fieldset: 'code',
      hidden: ({document}) => document.studioVersion >= 2,
    },
    {
      name: 'installWith',
      type: 'string',
      title: 'Installation command',
      description:
        'In case your code can be installed with one command. E.g. "sanity install media", "npm i  @sanity/client", "cargo install sanity"',
      fieldset: 'code',
      hidden: ({document}) => document.studioVersion >= 2,
    },
    {
      name: 'packageName',
      type: 'string',
      title: 'NPM Package name',
      description: 'Used for generating info like "Installation command", links, etc.',
      fieldset: 'code',
      hidden: ({document}) => document.studioVersion < 2,
    },
    {
      name: 'v3DistTag',
      type: 'string',
      title: 'Test version for Studio V3',
      description: `If you've published a V3 ready version that can be installed using "npm install plugin-name@v3-studio" then enter "v3-studio" below.`,
      fieldset: 'code',
      hidden: ({document}) => document.studioVersion !== 2,
    },
    {
      name: 'studioV2Support',
      title: 'Studio V2 support',
      type: 'string',
      description:
        "If this plugin used to run on Studio V2, let your users know what the status is now that it's on V2. And make sure your V3 plugin implements https://github.com/sanity-io/incompatible-plugin in case they upgrade just your plugin but the Studio stays on V2.",
      fieldset: 'code',
      initialValue: '',
      hidden: ({document}) => document.studioVersion !== 3,
      options: {
        layout: 'radio',
        direction: 'horizontal',
        list: [
          {value: '', title: 'N/A'},
          {value: 'discontinued', title: 'Discontinued'},
          {value: 'continued', title: 'Continued'},
        ],
      },
    },
    {
      name: 'v2DistTag',
      type: 'string',
      title: 'Last version for Studio V2',
      description: `Specify the last version number that still works for V2 users. If you enter "2.1.3" we'll show a "yarn add plugin-name@2.1.3" to V2 users that wan't to use your plugin but aren't ready to upgrade to V3 just yet.`,
      fieldset: 'code',
      hidden: ({document}) =>
        document.studioVersion !== 3 || document.studioV2Support !== 'discontinued',
    },
    {
      name: 'v2PackageName',
      type: 'string',
      title: 'NPM Package name for Studio V2',
      description: `For plugins that will continue to receive features, bugfixes, etc we recommend publishing it under a new NPM package name. This ensures that even really old Studio V2 users can keep using "sanity install" to use your plugin.`,
      fieldset: 'code',
      hidden: ({document}) =>
        document.studioVersion !== 3 || document.studioV2Support !== 'continued',
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
      description: 'If you entered this in a contest, add the contest here',
      of: [
        {
          type: 'reference',
          to: [{type: 'taxonomy.contest'}],
        },
      ],
    },
  ],
};
