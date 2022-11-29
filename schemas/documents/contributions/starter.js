import React, {forwardRef} from 'react';
import {RocketIcon} from '@sanity/icons';
import {withDocument} from 'part:@sanity/form-builder';

import PathInput from '../../components/PathInput';
import {
  contributionInitialValue,
  getContributionTaxonomies,
  ogImageField,
  publishedAtField,
} from './contributionUtils';

const NAME_REGEX = new RegExp(/^[\w-]+\/sanity-template-[\w-]+$/);

function testName(name = '') {
  return NAME_REGEX.test(name);
}

/**
 * Used to point contributors to de docs on sanity.io/create
 */
class EditorMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      createError: undefined,
      lastRepoIdFetched: '',
      loadingRepoId: false,
    };
  }

  focus = () => {};

  componentWillUnmount() {
    window._starterValidity = undefined;
  }

  render() {
    const {document} = this.props;

    const nameValidity = testName(document.repoId);
    const manifestValidity = window._starterValidity;
    const deploymentType = document.deploymentType;

    return (
      <div>
        <h2>How to prepare your starter</h2>
        <p>
          We're thrilled to have your contribution - we are sure it'll help many people to get
          started quickly!
        </p>

        <p>
          We currently offer two options to deploy your starter: using sanity.io/create or Vercel!
        </p>

        <h2>Deploying on sanity.io/create</h2>

        <p>
          In order to have your started listed in Sanity.io, however, we need it to follow a the
          steps outlined in the{' '}
          <a href="https://www.sanity.io/docs/starter-templates" target="_blank">
            starter templates
          </a>{' '}
          documentation.
        </p>
        <p>
          If your contribution cannot meet these guidelines, that's OK! You can add it as a showcase
          project by clicking on the{' '}
          <a href="/desk/contribution.showcaseProject" target="_blank">
            "Project for the showcase" item
          </a>{' '}
          in the main desk menu of this studio.
        </p>

        {(!nameValidity || manifestValidity === false) && !deploymentType === 'vercel' && (
          <div>
            <h3>Error(s) we spotted with your starter:</h3>
            <ul>
              {!nameValidity && (
                <li>
                  Repository name doesn't start with <code>sanity-template</code>. Please use the
                  format <code>{'{owner}/sanity-template-{name}'}</code> (
                  <a
                    href="https://www.sanity.io/docs/starter-templates#3a1ad2e88585"
                    target="_blank"
                  >
                    more info
                  </a>
                  )
                </li>
              )}
              {manifestValidity === false && (
                <li>
                  Sanity.io/create couldn't validate your template. Refer to
                  <a href="https://www.sanity.io/docs/starter-templates" target="_blank">
                    the starter templates documentation.
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}

        <h2>Deploying with Vercel Deploy Button</h2>
        <div>
          <p>
            If you are using Vercel, you can use the{' '}
            <a href="https://vercel.com/docs/deploy-button#generate-your-own" target="_blank">
              generate your own deploy button
            </a>{' '}
            documentation to generate the deployment URL based off your GitHub repository.
          </p>
          <p>
            Once generated, the URL can be copied from the{' '}
            <a href="https://vercel.com/docs/deploy-button#snippets">
              Snippets section (by picking the URL tab)
            </a>
          </p>
        </div>
      </div>
    );
  }
}
//import React, {forwardRef} from 'react';
// import {RocketIcon} from '@sanity/icons';
// import {Card, Text} from '@sanity/ui';

export default {
  title: 'Starter',
  name: 'contribution.starter',
  type: 'document',
  icon: RocketIcon,
  initialValue: contributionInitialValue,
  fields: [
    // {
    //   name: 'studioVersion',
    //   title: 'Studio version',
    //   type: 'number',
    //   description: 'What Sanity Studio version was this starter was built for.',
    //   initialValue: 3,
    //   options: {
    //     layout: 'radio',
    //     direction: 'horizontal',
    //     list: [
    //       {value: 3, title: 'Studio v3'},
    //       {value: 2, title: 'Studio v2 (deprecated)'},
    //       {value: -1, title: 'n/a (deprecated)'},
    //     ],
    //   },
    // },
    {
      name: 'warningv2',
      title: 'Message for editors',
      type: 'string',
      readOnly: true,
      hidden: ({parent}) => parent.studioVersion === 3 || parent.studioVersion === undefined,
      inputComponent: forwardRef(() => {
        return (
          <Card padding={3} radius={1} shadow={1} tone="caution">
            <Text align="center" size={1} weight="semibold">
              v2 starters are no longer supported
            </Text>
          </Card>
        );
      }),
    },
    {
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
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
      hidden: ({parent}) => parent.studioVersion === 2 || parent.studioVersion === -1,
      validation: (Rule) =>
        Rule.custom(async (slug, context) => {
          if (!slug && context.parent.studioVersion === 3) {
            return 'Required';
          }

          return true;
        }),
    },
    {
      name: 'deploymentType',
      title: 'What deployment option do you want to use?',
      description:
        'Using the sanity.io/create means that we will generate a deployment page based on the provided repo id. If Vercel is picked, then you will need to generate a Deploy Button link.',
      type: 'string',
      hidden: ({parent}) => parent.studioVersion === 3,
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
        'The URL for your repository. E.g. https://github.com/sanity-io/sanity-template-example',
      type: 'url',
      hidden: ({parent}) => parent.studioVersion === 2 || parent.studioVersion === -1,
      validation: (Rule) =>
        Rule.custom(async (repository, context) => {
          if (!repository && context.parent.studioVersion === 3) {
            return 'Required';
          }

          return true;
        }),
    },
    {
      title: 'Repository URL',
      name: 'repoId',
      description:
        'The repo ID or slug from your starter’s GitHub repository (eg. sanity-io/sanity-template-example)',
      type: 'string',
      hidden: ({parent}) => parent.studioVersion === 3,
      validation: (Rule) => [
        // Ensure that the repo id field
        Rule.custom(async (repoId, context) => {
          if (
            !repoId &&
            context.parent.deploymentType === 'sanityCreate' &&
            (context.parent.studioVersion === 2 || context.parent.studioVersion === -1)
          ) {
            return 'Required';
          }

          return true;
        }),

        // Ensure repo is compatible with sanity.io/create
        Rule.custom(async (repoId, context) => {
          if (
            !repoId ||
            (context.parent.deploymentType === 'sanityCreate' &&
              (context.parent.studioVersion === 2 || context.parent.studioVersion === -1))
          ) {
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
      hidden: ({parent}) => parent.studioVersion === 2 || parent.studioVersion === -1,
      validation: (Rule) =>
        Rule.custom(async (demoUrl, context) => {
          if (!demoUrl && context.parent.studioVersion === 3) {
            return 'Required';
          }

          return true;
        }),
    },
    {
      title: 'Vercel Deploy Button link',
      name: 'vercelDeployLink',
      description: 'The generated Vercel Deploy Button link',
      type: 'string',
      hidden: ({parent}) => parent.deploymentType !== 'vercel',
      validation: (Rule) =>
        Rule.custom((vercelLink, context) => {
          return context.parent.deploymentType === 'vercel' &&
            !vercelLink &&
            context.parent.studioVersion === 2
            ? 'Required'
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
      validation: (Rule) =>
        Rule.custom(async (authors) => {
          if (typeof authors === 'undefined' || (authors && authors.length === 0)) {
            return 'Required';
          }

          return true;
        }),
    },
    ogImageField,
    publishedAtField,
    ...getContributionTaxonomies('starter', {
      solutions: {
        title: 'Categories',
        description: 'Connect your starter to common themes in the Sanity community.',
        hidden: ({parent}) => parent.studioVersion === 3,
      },
      categories: {
        title: 'Categories',
        description:
          'Connect your starter to common themes in the Sanity community. Let us know if you have more great category ideas.',
        hidden: ({parent}) => parent.studioVersion === 3,
      },
      frameworks: {
        title: 'Application frameworks',
        description:
          'If this starter is built with a framework like Gatsby & Vue, make the connection for others who also use it. If you can’t find your framework get in touch.',
        validation: (Rule) =>
          Rule.custom(async (framework, context) => {
            if (
              context.parent.studioVersion === 3 &&
              (typeof framework === 'undefined' || (framework && framework.length === 0))
            ) {
              return 'Required';
            }

            return true;
          }),
      },
      cssframeworks: {
        title: 'CSS Frameworks',
        description:
          'If this starter is built with a framework like Tailwind, styled-components, make the connection for others who also use it. If you can’t find your framework get in touch.',
        hidden: ({parent}) => parent.studioVersion === 2 || parent.studioVersion === -1,
        validation: (Rule) =>
          Rule.custom(async (cssframework, context) => {
            if (
              context.parent.studioVersion === 3 &&
              (typeof cssframework === 'undefined' || (cssframework && cssframework.length === 0))
            ) {
              return 'Required';
            }

            return true;
          }),
      },
      usecases: {
        title: 'Use case',
        description: 'e.g. Ecommerce',
        hidden: ({parent}) => parent.studioVersion === 2 || parent.studioVersion === -1,
        validation: (Rule) =>
          Rule.custom(async (usecase, context) => {
            if (
              context.parent.studioVersion === 3 &&
              (typeof usecase === 'undefined' ||
                (usecase && usecase.length === 0 && context.parent.studioVersion === 3))
            ) {
              return 'Required';
            }

            return true;
          }),
      },
      integrations: {
        title: 'Integrations & services used',
        description:
          'If your tool connects Sanity to other services and APIs. If you can’t find what you’re after get in touch.',
        hidden: ({parent}) => parent.studioVersion === 3,
      },
      tools: {
        title: 'Sanity tools this starter relies on',
        description:
          'Browse for plugins, asset sources, SDKs and other dependencies used in this starter.',
        hidden: ({parent}) => parent.studioVersion === 3,
      },
    }),
  ],
};
