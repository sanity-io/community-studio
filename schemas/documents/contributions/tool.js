import {PlugIcon} from '@sanity/icons';

import isValidSemver from 'semver/functions/valid';
import cleanSemver from 'semver/functions/clean';
import incSemver from 'semver/functions/inc';
import validateNpmPackageName from 'validate-npm-package-name';
import brandColorList from '../../../src/utils/brandColorList';
//V3FIXME
// import PathInput from '../../components/PathInput';
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
      //V3FIXME
      // inputComponent: PathInput,
      options: {
        basePath: 'sanity.io/plugins',
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    },
    //V3FIXME
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
        Rule.custom((value, {document, getClient}) => {
          const client = getClient({apiVersion: '2023-01-01'});
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

            return client
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
          {value: 2, title: 'Studio v2'},
          {value: 3, title: 'Studio v3'},
        ],
      },
      validation: (Rule) =>
        Rule.custom((value, {document}) => {
          // Handle cases where something should be a studio v2 listing but is still using the old format
          if (typeof value !== 'number' || value === -1) {
            const {installWith, packageUrl = ''} = document;
            if (typeof installWith !== 'string' || !installWith) {
              return true;
            }
            // If it's a `sanity install` command we want the author to instead set the `Studio version` and specify compat
            if (installWith.startsWith('sanity install')) {
              const [, , origin, , ...parts] = packageUrl.split('/');
              return `Set the Studio version to "2"${
                origin === 'www.npmjs.com' && parts.length >= 1
                  ? ` and set "NPM package name" to "${parts.join('/')}"`
                  : ''
              } instead of manually specifiying "${installWith}"`;
            }
          }
          return true;
        }),
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
        'In case your code can be installed with one command. E.g. "npm i  @sanity/client", "cargo install sanity"',
      fieldset: 'code',
      hidden: ({document, value}) => !value && document.studioVersion >= 2,
    },
    {
      name: 'packageName',
      type: 'string',
      title: 'NPM package name',
      description: 'Used for generating info like "Installation command", links, etc.',
      fieldset: 'code',
      hidden: ({document}) =>
        typeof document.studioVersion !== 'number' || document.studioVersion < 2,
      validation: (Rule) =>
        Rule.custom((value, {document, getClient}) => {
          const client = getClient({apiVersion: '2023-01-01'});

          if (typeof document.studioVersion !== 'number' || document.studioVersion < 2) {
            return true;
          }
          if (typeof value !== 'string' || !value) {
            return 'Required';
          }
          if (isValidSemver(cleanSemver(value), {loose: true})) {
            return `name can't be a version string`;
          }
          if (value.startsWith('https://www.npmjs.com/package/')) {
            const packageName = value.replace('https://www.npmjs.com/package/', '');
            const validation = validateNpmPackageName(packageName);
            if (validation.validForNewPackages) {
              return client
                .patch(document._id)
                .set({packageName})
                .commit()
                .then(() => {
                  return true;
                });
            }
          }
          const validation = validateNpmPackageName(value);
          return Array.isArray(validation.errors)
            ? validation.errors[0]
            : Array.isArray(validation.warnings)
            ? validation.warnings[0]
            : true;
        }),
    },
    {
      name: 'v3DistTag',
      type: 'string',
      title: 'Test version for Studio v3',
      description: `If you've published a v3 ready version that can be installed using "npm install plugin-name@studio-v3" then enter "studio-v3" below.`,
      fieldset: 'code',
      hidden: ({document}) => document.studioVersion !== 2,
      validation: (Rule) =>
        Rule.custom((value, {document}) => {
          if (document.studioVersion !== 2 || typeof value !== 'string' || !value) {
            return true;
          }
          // Validate the version tag the same npm will when someone attempts using the generated install command in the listing
          if (isValidSemver(cleanSemver(value))) {
            return `Use a dist-tag name, like "studio-v3", instead of a version number`;
          }
          // A valid dist-tag can be used to perform a prerelease increment to a semver, without resulting in an invalid version
          const test = incSemver('1.0.0', 'prerelease', value);
          if (!isValidSemver(test, {loose: false})) {
            return `dist-tag can only contain URL-friendly characters`;
          }

          return true;
        }),
    },
    {
      name: 'v3ReadmeUrl',
      type: 'url',
      title: 'Link to v3 readme',
      description: `This URL will add a link just above the v3 install snippet. For example "https://github.com/sanity-io/sanity-plugin-scheduled-publishing/blob/v3/README.md"`,
      fieldset: 'code',
      hidden: ({document}) => document.studioVersion !== 2,
    },
    {
      name: 'v3InstallWith',
      type: 'string',
      title: 'Override installation command',
      description:
        'If the generated install command is not correct, you can override it here. E.g. "npm i sanity-plugin-media@v3-studio @mdx-js/react"',
      fieldset: 'code',
      hidden: ({document}) => document.studioVersion !== 2,
      validation: (Rule) =>
        Rule.custom((value, {document}) => {
          if (document.studioVersion !== 2 || typeof value !== 'string' || !value) {
            return true;
          }
          // Validate the version tag the same npm will when someone attempts using the generated install command in the listing
          if (value.endsWith(` ${document.packageName}@${document.v3DistTag}`)) {
            return 'This is the default value, no need to override it';
          }
          return true;
        }),
    },
    {
      name: 'studioV2Support',
      title: 'Studio v2 support',
      type: 'string',
      description:
        "If this plugin used to run on Studio v2, let your users know what the status is now that it's on v2. And make sure your v3 plugin implements https://github.com/sanity-io/incompatible-plugin in case they upgrade just your plugin but the Studio stays on v2.",
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
      title: 'Last version for Studio v2',
      description: `Specify the last version number that still works for v2 users. If you enter "2.1.3" we'll show a "yarn add plugin-name@2.1.3" to v2 users that wan't to use your plugin but aren't ready to upgrade to v3 just yet.`,
      fieldset: 'code',
      hidden: ({document}) =>
        document.studioVersion !== 3 || document.studioV2Support !== 'discontinued',
      validation: (Rule) =>
        Rule.custom((value, {document, getClient}) => {
          const client = getClient({apiVersion: '2023-01-01'});

          if (document.studioVersion !== 3 || document.studioV2Support !== 'discontinued') {
            return true;
          }
          if (typeof value !== 'string' || !value) {
            return 'Required';
          }
          // Validate the version tag the same npm will when someone attempts using the generated install command in the listing
          if (!isValidSemver(cleanSemver(value), {loose: false})) {
            return `Enter a valid semver version`;
          }
          const sanitized = cleanSemver(value, {loose: false});
          if (sanitized !== value) {
            return client
              .patch(document._id)
              .set({v2DistTag: sanitized})
              .commit()
              .then(() => {
                return true;
              });
          }
          return true;
        }),
    },
    {
      name: 'v2PackageName',
      type: 'string',
      title: 'NPM package name for Studio v2',
      description: `For plugins that will continue to receive features, bugfixes, etc we recommend publishing it under a new NPM package name. This ensures that even really old Studio v2 users can keep using "sanity install" to use your plugin.`,
      fieldset: 'code',
      hidden: ({document}) =>
        document.studioVersion !== 3 || document.studioV2Support !== 'continued',
      validation: (Rule) =>
        Rule.custom((value, {document, getClient}) => {
          const client = getClient({apiVersion: '2023-01-01'});

          if (document.studioVersion !== 3 || document.studioV2Support !== 'continued') {
            return true;
          }
          if (typeof value !== 'string' || !value) {
            return 'Required';
          }
          if (value === document.packageName) {
            return 'You must specify a different NPM package name for Studio v2';
          }
          if (isValidSemver(cleanSemver(value), {loose: true})) {
            return `name can't be a version string`;
          }
          if (value.startsWith('https://www.npmjs.com/package/')) {
            const v2PackageName = value.replace('https://www.npmjs.com/package/', '');
            const validation = validateNpmPackageName(v2PackageName);
            if (validation.validForNewPackages) {
              return client
                .patch(document._id)
                .set({v2PackageName})
                .commit()
                .then(() => {
                  return true;
                });
            }
          }
          const validation = validateNpmPackageName(value);
          return Array.isArray(validation.errors)
            ? validation.errors[0]
            : Array.isArray(validation.warnings)
            ? validation.warnings[0]
            : true;
        }),
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
