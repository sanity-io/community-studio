import { RocketIcon } from '@sanity/icons'
import { Card, Text } from '@sanity/ui'
import React, { forwardRef } from 'react'
import { Rule } from 'sanity'

import { PathInput } from '../../components/PathInput'
import {
  contributionInitialValue,
  getContributionTaxonomies,
  ogImageField,
  publishedAtField,
} from './contributionUtils'

export const starter = {
  title: 'Template',
  name: 'contribution.starter',
  type: 'document',
  icon: RocketIcon,
  initialValue: contributionInitialValue,
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      description:
        'Briefly explain what your template does, and how it can help others in the community.',
      type: 'text',
      rows: 1,
      validation: (rule: Rule) => [
        rule.required(),
        rule.max(300).warning('Try to keep your Description under 300 characters.'),
      ],
    },
    {
      name: 'studioVersion',
      title: 'Studio version',
      type: 'number',
      description: 'Which Sanity Studio version does this template use?',
      initialValue: -1,
      hidden: true,
      options: {
        layout: 'radio',
        direction: 'horizontal',
        list: [
          { value: -1, title: 'N/A' },
          { value: 2, title: 'Studio v2' },
          { value: 3, title: 'Studio v3' },
        ],
      },
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Relative address in the community site',
      description: 'Please avoid special characters, spaces and uppercase letters.',
      components: {
        input: PathInput,
      },
      options: {
        basePath: 'sanity.io/templates',
        source: 'title',
      },
      hidden: ({ parent }: any) => parent.studioVersion === 2 || parent.studioVersion === -1,
      validation: (rule: Rule) =>
        rule.custom(async (slug, context: any) => {
          if (!slug && context.parent.studioVersion === 3) {
            return 'Required'
          }

          return true
        }),
    },
    {
      name: 'deploymentType',
      title: 'What deployment option do you want to use?',
      description: 'Choose the deployment type for this project',
      type: 'string',
      options: {
        layout: 'radio',
        list: [
          { title: 'Vercel', value: 'vercel' },
          { title: 'Netlify', value: 'netlify' },
          { title: 'None', value: 'none' },
        ],
      },
      initialValue: 'none',
    },
    {
      title: 'Netlify Deploy Button link',
      name: 'netlifyDeployLink',
      description: 'The Netlify Deploy Button link',
      type: 'string',
      hidden: ({ parent }) => parent.deploymentType !== 'netlify',
      validation: (Rule) =>
        Rule.custom((netlifyLink, context) => {
          return context.parent.deploymentType === 'netlify' && !netlifyLink ? 'Required' : true
        }),
    },
    {
      title: 'Vercel Deploy Button link',
      name: 'vercelDeployLink',
      description: 'The Vercel Deploy Button link',
      type: 'string',
      hidden: ({ parent }) => parent.deploymentType !== 'vercel',
      validation: (Rule) =>
        Rule.custom((vercelLink, context) => {
          return context.parent.deploymentType === 'vercel' && !vercelLink ? 'Required' : true
        }),
    },
    {
      title: 'Repository URL',
      name: 'repoId',
      description: "The repository URL of your template's GitHub repository",
      type: 'url',
      validation: (rule: Rule) => [
        // Ensure that the repo id field
        rule.required(),

        // TODO: Update for running API call to validate template with template validator
        rule.custom(async (repoId, context: any) => {
          return true
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
      title: '📷 Main image',
      name: 'image',
      description: 'An image or screenshot of your template. 1200px wide x 750px high is ideal.',
      type: 'image',
      options: {
        hotspot: true,
        storeOriginalFilename: false,
      },
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'authors',
      type: 'array',
      title: '👤 Author(s)',
      description:
        'Credit yourself and others with a profile in the Sanity community who helped make this template.',
      of: [
        {
          type: 'reference',
          to: [{ type: 'person' }],
        },
      ],
      validation: (rule: Rule) =>
        rule.custom(async (authors: any) => {
          if (typeof authors === 'undefined' || (authors && authors.length === 0)) {
            return 'Required'
          }

          return true
        }),
    },
    {
      name: 'showAgencyContactLink',
      title: 'Show agency contact information',
      description: "Display a card on the template page with a link to your agency's website.",
      type: 'boolean',
      defaultValue: false,
    },
    {
      name: 'agencyName',
      title: 'Agency name',
      description: 'The name of the agency that maintains this template.',
      type: 'string',
      hidden: ({ parent }: any) => !parent.showAgencyContactLink,
      validation: (rule: Rule) =>
        rule.custom(async (agencyName, context: any) => {
          if (!agencyName && context.parent.showAgencyContactLink) {
            return 'Required'
          }

          return true
        }),
    },
    {
      name: 'agencyContactUrl',
      title: 'Agency contact URL',
      description: "The URL to your agency's contact page.",
      type: 'url',
      hidden: ({ parent }: any) => !parent.showAgencyContactLink,
      validation: (rule: Rule) =>
        rule.custom(async (agencyContactUrl, context: any) => {
          if (!agencyContactUrl && context.parent.showAgencyContactLink) {
            return 'Required'
          }

          return true
        }),
    },
    //V3FIXME
    ogImageField,
    publishedAtField,
    ...getContributionTaxonomies('starter', {
      solutions: {
        title: 'Categories',
        description: 'Connect your template to common themes in the Sanity community.',
        hidden: ({ parent }: any) => parent.studioVersion === 3,
      },
      categories: {
        title: 'Categories',
        description:
          'Connect your template to common themes in the Sanity community. Let us know if you have more great category ideas.',
        hidden: ({ parent }: any) => parent.studioVersion === 3,
      },
      frameworks: {
        title: 'Application frameworks',
        description:
          'If this template is built with a framework like Next.js & React, make the connection for others who also use it. If you can’t find your framework get in touch.',
        validation: (rule: Rule) =>
          rule.custom(async (framework: any, context: any) => {
            if (
              context.parent.studioVersion === 3 &&
              (typeof framework === 'undefined' || (framework && framework.length === 0))
            ) {
              return 'Required'
            }

            return true
          }),
      },
      cssframeworks: {
        title: 'CSS frameworks',
        description:
          'If this template is built with a framework like Tailwind, styled-components, make the connection for others who also use it. If you can’t find your framework get in touch.',
        hidden: ({ parent }: any) => parent.studioVersion === 2 || parent.studioVersion === -1,
        validation: (rule: Rule) =>
          rule.custom(async (cssframework: any, context: any) => {
            if (
              context.parent.studioVersion === 3 &&
              (typeof cssframework === 'undefined' || (cssframework && cssframework.length === 0))
            ) {
              return 'Required'
            }

            return true
          }),
      },
      usecases: {
        title: 'Use case',
        description: 'e.g. Ecommerce',
        hidden: ({ parent }: any) => parent.studioVersion === 2 || parent.studioVersion === -1,
        validation: (rule: Rule) =>
          rule.custom(async (usecase: any, context: any) => {
            if (
              context.parent.studioVersion === 3 &&
              (typeof usecase === 'undefined' ||
                (usecase && usecase.length === 0 && context.parent.studioVersion === 3))
            ) {
              return 'Required'
            }

            return true
          }),
      },
      integrations: {
        title: 'Integrations & services used',
        description:
          'If your tool connects Sanity to other services and APIs. If you can’t find what you’re after get in touch.',
        hidden: ({ parent }: any) => parent.studioVersion === 3,
      },
      tools: {
        title: 'Sanity tools this template relies on',
        description:
          'Browse for plugins, asset sources, SDKs and other dependencies used in this template.',
        hidden: ({ parent }: any) => parent.studioVersion === 3,
      },
    }),
  ],
}
