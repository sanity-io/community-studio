import {RocketIcon} from '@sanity/icons';
import {withDocument} from 'part:@sanity/form-builder';
import {Card, Text} from '@sanity/ui';
import {RepositoryInput} from '../../components/RepositoryInput';
import React, {forwardRef} from 'react';
import {
  contributionInitialValue,
  getContributionTaxonomies,
  ogImageField,
  publishedAtField,
} from './contributionUtils';

const EditorMessage = forwardRef((props, ref) => {
  return (
    <Card padding={3} radius={1} shadow={1} tone="primary">
      <Text align="center" size={1} weight="semibold">
        This is the v3 template submission form •{' '}
        <a href="https://beta.sanity.io/docs" target="_blank">
          Read v3 template docs
        </a>
      </Text>
    </Card>
  );
});

// NOTE: this is a schema type for v3 templates only
// v2 starters will still use the "starter" schema
export default {
  title: 'Templates (v3)',
  name: 'contribution.template',
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
      title: 'Template name',
      name: 'title',
      type: 'string',
    },
    {
      title: 'Repository',
      name: 'repository',
      type: 'url',
      inputComponent: RepositoryInput,
      validation: (Rule) => Rule.uri({allowRelative: true}),
      options: {
        prepend: 'github.com',
      },
    },
    {
      title: 'Demo URL',
      name: 'demoURL',
      description: "URL of your template's demo. E.g. https://demo.vercel.store",
      type: 'url',
    },
    {
      title: '📷 Thumbnail image',
      name: 'thumbnail',
      description: 'An image or screenshot of your template. A 1200×750px image format is ideal.',
      type: 'image',
      options: {
        hotspot: true,
        storeOriginalFilename: false,
      },
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 1,
      validation: (Rule) => [
        Rule.required(),
        Rule.max(300).warning('Try to keep your Description under 300 characters.'),
      ],
    },
    ogImageField,
    publishedAtField,
    ...getContributionTaxonomies('starter', {
      frameworks: {
        title: 'Frameworks used',
        description:
          'If this starter is built with a framework like Gatsby & Vue, make the connection for others who also use it. If you can’t find your framework get in touch.',
      },
      usecases: {
        title: 'Use case',
        description: 'e.g. Ecommerce',
      },
      cssframeworks: {
        title: 'CSS Frameworks',
        description:
          'If this starter is built with a framework like Tailwind, styled-components, make the connection for others who also use it. If you can’t find your framework get in touch.',
      },
      integrations: {
        title: 'Integrations',
        description:
          'If your tool connects Sanity to other services and APIs. If you can’t find what you’re after get in touch.',
      },
    }),
  ],
};
