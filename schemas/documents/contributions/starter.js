import React from 'react';
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

    return (
      <div>
        <h2>How to prepare your starter</h2>
        <p>
          We're thrilled to have your contribution - we are sure it'll help many people to get
          started quickly!
        </p>
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
          <a href="/desk/contribution.showcaseProject" target="_blank">"Project for the showcase" item</a> in the
          main desk menu of this studio.
        </p>
        {(!nameValidity || manifestValidity === false) && (
          <div>
            <h3>Error(s) we spotted with your starter:</h3>
            <ul>
              {!nameValidity && (
                <li>
                  Repository name doesn't start with <code>sanity-template</code>. Please use the format <code>{"{owner}/sanity-template-{name}"}</code> (
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
      </div>
    );
  }
}

export default {
  title: 'Starter',
  name: 'contribution.starter',
  type: 'document',
  icon: RocketIcon,
  initialValue: contributionInitialValue,
  fields: [
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
      name: 'ignoreMe',
      title: 'Message for editors',
      type: 'string',
      readOnly: true,
      inputComponent: withDocument(EditorMessage),
    },
    {
      title: 'Github repository ID',
      name: 'repoId',
      description:
        'The repo ID or slug from your starter’s GitHub repository (eg. sanity-io/sanity-template-example)',
      type: 'string',
      validation: (Rule) => [
        // Ensure repo is named correctly
        Rule.required()
          .regex(NAME_REGEX)
          .error('The repository name must start with sanity-template: {owner}/sanity-template-{name}'),
        // Ensure repo is compatible with sanity.io/create
        Rule.custom(async (repoId) => {
          if (!repoId) {
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
