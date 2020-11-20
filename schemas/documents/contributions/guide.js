import React from 'react';
import Icon from '../../components/icon';
import PathInput from '../../components/PathInput';
import { taxonomiesReferenceField } from '../taxonomies';

export default {
  name: 'contribution.guide',
  type: 'document',
  title: 'Guide',
  icon: () => <Icon emoji="🧶" />,
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
      hidden: true,
    };
  },
  preview: {
    select: {
      title: 'title',
      hidden: 'hidden',
      type: '_type',
    },
    prepare: (selection) => {
      const {title, hidden, type} = selection;
      const result = {title};
      const sub = [type];
      if (hidden) {
        sub.push('hidden');
      }
      result.subtitle = `[${sub.join('] [')}]`;
      return result;
    },
  },
  fieldsets: [
    {
      name: 'external',
      title: '🌐 Fields exclusive to external guides',
      description:
        "💡 use this if you're plugging an article hosted in another site. If you plan to write the content here, skip this section.",
      options: {collapsible: true, collapsed: true},
    },
    {
      name: 'internal',
      title: '📩 For internal guides',
      description: 'If will publish your content in the Sanity site, this section is for you 😉',
      options: {collapsible: true, collapsed: true},
    },
  ],
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title of your guide',
      description:
        "This will be reader's first impression, so remember to make it descriptive and enticing :)",
    },
    {
      title: 'Headline / short description for the guide',
      name: 'description',
      type: 'string',
      description: 'Hints what the content is about. This shows up in the preview card for the guide.',
    },
    {
      title: '👀 Hide it in the Sanity community?',
      name: 'hidden',
      type: 'boolean',
      description: 'Set this to conceal the article from the website while you work on it.',
    },
    {
      name: 'authors',
      type: 'array',
      title: '👤 Author(s)',
      of: [
        {
          type: 'reference',
          to: [{type: 'person'}],
        },
      ],
    },
    {
      title: '📷 Poster / header image',
      name: 'image',
      type: 'image',
      description: 'Give the guide a poster image if pertinent.',
      fields: [
        {
          title: 'Caption',
          name: 'caption',
          type: 'string',
          options: {
            isHighlighted: true,
          },
        },
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Alternative text for screenreaders. Falls back on caption if not set',
          options: {
            isHighlighted: true,
          },
        },
      ],
      options: {
        hotspot: true
      },
    },
    {
      name: 'categories',
      title: 'Category(ies)',
      description: 'Get in touch if you don\'t find the tech you were looking for',
      // @TODO: description & maybe input component that allows to submit new taxonomy draft inline
      type: 'array',
      of: [{
        type: 'reference',
        title: 'Reference to guide category',
        to: [{ type: "taxonomy.category" }],
        options: {
          filter: "$type in applicableTo",
          filterParams: {
            type: "contribution.guide"
          }
        }
      }]
    },
    {
      name: 'frameworks',
      title: 'Framework(s) / tech used',
      description: 'Get in touch if you don\'t find the tech you were looking for',
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
      title: 'Services and integrations this guide covers',
      description: 'Get in touch if you don\'t find the one(s) you were looking for',
      // @TODO: description & maybe input component that allows to submit new taxonomy draft inline
      type: 'array',
      of: [{
        type: 'reference',
        title: 'Reference to integration',
        to: [{ type: "taxonomy.integration" }],
      }]
    },
    {
      title: '📬 relative address in the community site',
      description: '💡 avoid special characters, spaces and uppercase letters.',
      name: 'slug',
      type: 'slug',
      fieldset: 'internal',
      required: true,
      inputComponent: PathInput,
      options: {
        basePath: 'sanity.io/guides',
        source: 'title',
        auto: true,
      },
    },
    {
      title: 'Preamble / introduction',
      name: 'introduction',
      fieldset: 'internal',
      type: 'richText',
      description: 'Lead text for the guide that shows in the header of its page before the content body.',
    },
    {
      title: 'Canonical/alternative URL (if you published this guide elsewhere)',
      name: 'canonicalUrl',
      fieldset: 'internal',
      type: 'url',
      description:
        "💡 In case you published this content in your website, dev.to or some other medium, be sure to add the main URL you'd like search engines to index. If you don't, Google and Bing may think you're copying and pasting content from Sanity's site and penalize your SEO rankings.",
    },
    {
      name: 'body',
      type: 'richText',
      fieldset: 'internal',
      title: 'Content',
    },
    {
      name: 'externalLink',
      type: 'url',
      title: 'External link',
      fieldset: 'external',
      description:
        "If you published your guide elsewhere and don't want to have a copy of it in the Sanity website, paste its URL here 😉",
    },
  ],
};
