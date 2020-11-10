import React from 'react'

/**
 * Common fields for taxonomies.
 * The reason we aren't using an object is two-fold:
 * A) keep the data structure flat (document.title & document.seoDescription vs. document.meta.title)
 * B) allow for easier separation between taxonomies in the future.
 */
const getTaxonomyFields = ({turnIntoLanding = true} = {}) => {
  const fields = [
    {
      name: 'title',
      title: 'Title',
      description:
        "💡 make it clear and memorable for internal reference, you can overwrite what appears in the page's header in the field below",
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'headerTitle',
      title: 'Title visible on page',
      description:
        "❓ Optional. If you don't provide any value here, we'll use the title above instead",
      type: 'string',
    },
    {
      name: 'headerBody',
      title: 'Rich text below the header title',
      description:
        '❓ Optional. Use this if you want to clarify or entice visitors about the current taxonomy',
      type: 'array',
      // @TODO: remove unneeded styles and marks
      of: [
        {
          type: 'block',
        },
      ],
    },
  ];

  // Not every taxonomy will have their own landing page at first, so only show SEO and open graph fields for those who will.
  if (turnIntoLanding) {
    fields.push(
      {
        name: 'seoTitle',
        title: 'Title for SEO',
        description:
          '⚡ Optional but highly encouraged to increase search engine rankings and conversion rates for this taxonomy',
        type: 'string',
        fieldset: 'seo',
      },
      {
        name: 'seoDescription',
        title: 'Description for SEO',
        description:
          '⚡ Optional but highly encouraged to increase search engine rankings and conversion rates for this taxonomy',
        type: 'string',
        fieldset: 'seo',
      },
      {
        name: 'ogImage',
        title: '📷 Social sharing image / open graph image',
        description:
          '⚡ Optional but highly encouraged to increase click rates in social media platforms',
        type: 'image',
        fieldset: 'seo',
      }
    );
  }
  return fields;
};

const getTaxonomyFieldsets = ({turnIntoLanding = true} = {}) => {
  const fieldsets = [];

  // Not every taxonomy will have their own landing page at first, so only show SEO and open graph fields for those who will.
  if (turnIntoLanding) {
    fieldsets.push({
      name: 'seo',
      title: '🔍 SEO-related fields',
      options: {collapsible: true, collapsed: false},
    });
  }
  return fieldsets;
};

/**
 * Generates a full-blown taxonomy schema
 */
export const getTaxonomySchema = ({
  turnIntoLanding = true,
  name,
  title,
  description,
  icon: emoji,
  extraFields = [],
}) => {
  if (!name) {
    throw 'Taxonomy needs a name';
  }
  return {
    name: `taxonomy.${name}`,
    title,
    description,
    icon: emoji ? () => <Icon emoji={emoji} /> : null,
    type: 'document',
    fieldsets: getTaxonomyFieldsets({turnIntoLanding}),
    fields: [...getTaxonomyFields({turnIntoLanding}), ...extraFields],
    preview: {
      select: {
        title: 'title',
        ogImage: 'ogImage',
      },
      prepare(props) {
        return {
          title: props.title,
          subtitle: `${emoji || ''} ${title || name}`,
          media: props.ogImage
        }
      },
    },
  };
};
