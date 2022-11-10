import React, {forwardRef} from 'react';
import {RocketIcon} from '@sanity/icons';
import {withDocument} from 'part:@sanity/form-builder';
import {Card, Text} from '@sanity/ui';
import PathInput from '../../components/PathInput';
import {
  contributionInitialValue,
  getContributionTaxonomies,
  ogImageField,
  publishedAtField,
} from './contributionUtils';

const NAME_REGEX = new RegExp(/^[\w-]+\/sanity-template-[\w-]+$/);

const EditorMessagev2 = forwardRef((props, ref) => {
  return (
    <Card padding={3} radius={1} shadow={1} tone="caution">
      <Text align="center" size={1} weight="semibold">
        v2 starters will no longer be supported after Feb 1, 2023
      </Text>
    </Card>
  );
});
const EditorMessagev3 = forwardRef((props, ref) => {
  return (
    <Card padding={3} radius={1} shadow={1} tone="primary">
      <Text align="center" size={1} weight="semibold">
        This is the v3 template submission form
      </Text>
    </Card>
  );
});

export default {
  title: 'Starters (v2)',
  name: 'contribution.starter',
  type: 'document',
  icon: RocketIcon,
  initialValue: contributionInitialValue,
  fields: [
    {
      name: 'studioVersion',
      title: 'Studio version',
      type: 'number',
      description: 'What Sanity Studio version was this starter was built for.',
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
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'warningv2',
      title: 'Message for editors',
      type: 'string',
      readOnly: true,
      hidden: ({document}) => document.studioVersion === 3 || document.studioVersion === -1,
      inputComponent: withDocument(EditorMessagev2),
    },
    {
      name: 'warningv3',
      title: 'Message for editors',
      type: 'string',
      readOnly: true,
      hidden: ({document}) => document.studioVersion === 2 || document.studioVersion === -1,
      inputComponent: withDocument(EditorMessagev3),
    },
    {
      title: 'Title',
      name: 'title',
      type: 'string',
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
        basePath: 'sanity.io/templates',
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'deploymentType',
      title: 'What deployment option do you want to use?',
      description:
        'Using the sanity.io/create means that we will generate a deployment page based on the provided repo id. If Vercel is picked, then you will need to generate a Deploy Button link.',
      type: 'string',
      hidden: ({document}) => document.studioVersion === 3,
      options: {
        layout: 'radio',
        list: [
          {title: 'sanity.io/create', value: 'sanityCreate'},
          {title: 'Vercel', value: 'vercel'},
        ],
      },
      initialValue: 'sanityCreate',
    },
    {
      title: 'Repository URL',
      name: 'repository',
      description:
        'The URL for your repository. E.g. www.github.com/sanity-io/sanity-template-example ',
      type: 'url',
      hidden: ({document}) => document.studioVersion === 2,
    },
    {
      title: 'Repository URL',
      name: 'repoId',
      description:
        'The repo ID or slug from your starter’s GitHub repository (eg. sanity-io/sanity-template-example)',
      type: 'string',
      hidden: ({document}) => document.studioVersion === 3,
      validation: (Rule) => [
        // Ensure that the repo id field
        Rule.custom(async (repoId, context) => {
          if (!repoId && context.parent.deploymentType === 'sanityCreate') {
            return 'You must have a repo id';
          }

          return true;
        }),

        // Ensure repo is compatible with sanity.io/create
        Rule.custom(async (repoId, context) => {
          if (!repoId || context.parent.deploymentType === 'sanityCreate') {
            return true;
          }
          const res = await fetch(`/api/validate-starter?repoId=${repoId}`);
          if (res.status === 200) {
            window._starterValidity = true;
            return true;
          }
          window._starterValidity = false;
          return "Sanity.io/create couldn't validate your template.";
        }),
      ],
    },
    {
      title: 'Demo URL',
      name: 'demoURL',
      description: "URL of your template's demo. E.g. https://demo.vercel.store",
      type: 'url',
    },
    {
      title: 'Vercel Deploy Button link',
      name: 'vercelDeployLink',
      description: 'The generated Vercel Deploy Button link',
      type: 'string',
      hidden: ({parent}) => parent.deploymentType !== 'vercel',
      validation: (Rule) =>
        Rule.custom((vercelLink, context) => {
          return context.parent.deploymentType === 'vercel' && !vercelLink
            ? 'You must have a Vercel Deploy Button link'
            : true;
        }),
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
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'authors',
      type: 'array',
      title: '👤 Author(s)',
      description:
        'Credit yourself and others with a profile in the Sanity community who helped make this starter.',
      of: [
        {
          type: 'reference',
          to: [{type: 'person'}],
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    ogImageField,
    publishedAtField,
    ...getContributionTaxonomies('starter', {
      solutions: {
        title: 'Categories',
        description: 'Connect your starter to common themes in the Sanity community.',
        hidden: ({document}) => document.studioVersion === 3,
      },
      categories: {
        title: 'Categories',
        description:
          'Connect your starter to common themes in the Sanity community. Let us know if you have more great category ideas.',
        hidden: ({document}) => document.studioVersion === 3,
      },
      frameworks: {
        title: 'Application frameworks',
        description:
          'If this starter is built with a framework like Gatsby & Vue, make the connection for others who also use it. If you can’t find your framework get in touch.',
        validation: (Rule) => Rule.required(),
      },
      cssframeworks: {
        title: 'CSS Frameworks',
        description:
          'If this starter is built with a framework like Tailwind, styled-components, make the connection for others who also use it. If you can’t find your framework get in touch.',
        hidden: ({document}) => document.studioVersion === 2,
      },
      usecases: {
        title: 'Use case',
        description: 'e.g. Ecommerce',
        hidden: ({document}) => document.studioVersion === 2,
        validation: (Rule) => Rule.required(),
      },
      integrations: {
        title: 'Integrations & services used',
        description:
          'If your tool connects Sanity to other services and APIs. If you can’t find what you’re after get in touch.',
      },
      tools: {
        title: 'Sanity tools this starter relies on',
        description:
          'Browse for plugins, asset sources, SDKs and other dependencies used in this starter.',
        hidden: ({document}) => document.studioVersion === 3,
      },
    }),
  ],
};
