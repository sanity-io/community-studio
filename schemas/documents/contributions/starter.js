import React from 'react';
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

/**
 * Used to point contributors to de docs on sanity.io/create
 */
class EditorMessage extends React.Component {
  render() {
    return (
      <Card padding={3} radius={1} shadow={1} tone="caution">
        <Text align="center" size={1} weight="semibold">
          v2 starters will no longer be supported after Feb 1, 2023
        </Text>
      </Card>
    );
  }
}

export default {
  title: 'Starters (v2)',
  name: 'contribution.starter',
  type: 'document',
  icon: RocketIcon,
  initialValue: contributionInitialValue,
  fields: [
    {
      name: 'ignoreMe',
      title: 'Message for editors',
      type: 'string',
      readOnly: true,
      inputComponent: withDocument(EditorMessage),
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
        basePath: 'sanity.io/starters',
        source: 'title',
      },
      hidden: true,
    },
    {
      name: 'deploymentType',
      title: 'What deployment option do you want to use?',
      description:
        'Using the sanity.io/create means that we will generate a deployment page based on the provided repo id. If Vercel is picked, then you will need to generate a Deploy Button link.',
      type: 'string',
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
      title: 'Github repository ID',
      name: 'repoId',
      description:
        'The repo ID or slug from your starter’s GitHub repository (eg. sanity-io/sanity-template-example)',
      type: 'string',
      validation: (Rule) => [
        // Ensure that the repo id field
        Rule.custom(async (repoId, context) => {
          if (!repoId && context.parent.deploymentType === 'sanityCreate') {
            return 'You must have a repo id';
          }

          return true;
        }),

        // Ensure repo is named correctly
        Rule.regex(NAME_REGEX).error(
          'The repository name must start with sanity-template: {owner}/sanity-template-{name}'
        ),

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
    },
    ogImageField,
    publishedAtField,
    ...getContributionTaxonomies('starter', {
      solutions: {
        title: 'Categories',
        description: 'Connect your starter to common themes in the Sanity community.',
      },
      categories: {
        title: 'Categories',
        description:
          'Connect your starter to common themes in the Sanity community. Let us know if you have more great category ideas.',
      },
      frameworks: {
        title: 'Frameworks used',
        description:
          'If this starter is built with a framework like Gatsby & Vue, make the connection for others who also use it. If you can’t find your framework get in touch.',
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
      },
    }),
  ],
};
