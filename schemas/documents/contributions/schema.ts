import { CodeBlockIcon } from '@sanity/icons'
import { defineType, defineField, defineArrayMember } from 'sanity'

import {
  contributionInitialValue,
  getContributionTaxonomies,
  ogImageField,
  publishedAtField,
} from './contributionUtils'

export const schema = defineType({
  name: 'contribution.schema',
  type: 'document',
  title: 'Recipe',
  icon: CodeBlockIcon,
  initialValue: contributionInitialValue,
  preview: {
    select: {
      title: 'title',
      subtitle: '_type',
    },
  },
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Title of your recipe',
      description:
        "This will be reader's first impression, so remember to make it descriptive and enticing :)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: '📬 relative address in the community site',
      description: '💡 avoid special characters, spaces and uppercase letters.',
      type: 'slug',
      // This is auto-generated in the publish action
      hidden: true,
    }),
    ogImageField,
    publishedAtField,
    defineField({
      title: '👀 Hide this recipe?',
      name: 'hidden',
      type: 'boolean',
      description:
        'Prevent this recipe from appearing in searches and index pages. Anyone with the URL can still access the page.',
    }),
    defineField({
      title: 'Headline / short description',
      name: 'description',
      type: 'string',
      description: 'Hints what it can be used for. This shows up in the preview card.',
    }),
    defineField({
      name: 'authors',
      type: 'array',
      title: '👤 Author(s)',
      description: 'Credit yourself and others in the community who helped make this recipe.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'person' }],
        }),
      ],
    }),
    defineField({
      name: 'studioVersion',
      title: 'Sanity Studio version',
      type: 'number',
      description:
        'Does the recipe require a specific version of Sanity Studio? If not, select “Not applicable”.',
      initialValue: -1,
      options: {
        layout: 'radio',
        direction: 'horizontal',
        list: [
          { value: -1, title: 'Not applicable' },
          { value: 3, title: 'Studio v3' },
          { value: 2, title: 'Studio v2 (deprecated)' },
        ],
      },
      deprecated: {
        reason: 'This field is no longer used',
      },
      hidden: ({ value }) => value === -1 || !value,
    }),
    defineField({
      name: 'schemaFiles',
      title: 'Code files',
      description: 'Paste in the contents of all the related files from your Sanity studio repo.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'schemaEntryObj',
        }),
      ],
      validation: (Rule) => [
        Rule.required().min(1).error('At least 1 file/code entry is required.'),
        Rule.unique(),
      ],
    }),
    defineField({
      title: 'Deeper explanation',
      description:
        'Tell others what’s interesting about these files, and the purpose they’re intended to serve. Usability tips also appreciated by those who might extend on what you’ve made.',
      name: 'body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
        }),
      ],
      validation: (Rule) => [
        Rule.required()
          .min(1)
          .warning(
            'An explanation is highly recommended to show readers the value of your snippet.',
          ),
      ],
    }),
    ...getContributionTaxonomies('schema', {
      solutions: {
        title: 'Solutions',
        description: 'Solutions related to this contributions.',
      },
      categories: {
        title: 'Categories',
        description:
          'Connect your recipe to common themes in the Sanity community. Let us know if you have more great category ideas.',
        deprecated: {
          reason: 'This field is no longer used',
        },
        hidden: ({ value }) => !value,
      },
      // @TODO: find a way to restrict this field only to tools that are studio plugins. Previously when we were using category we could reference those tools pointing to studio plugin, but now we'll need to get inventive
      // tools: {
      //   title: 'Any studio plugin this schema uses?',
      //   description:
      //     'Browse for tools, plugins, asset sources, SDKs and others that you are used, mentioned or suggested by this guide.',
      // },
    }),
    defineField({
      title: 'Contest Tags',
      name: 'contests',
      type: 'array',
      hidden: ({ value }) => !value,
      deprecated: {
        reason: 'This field is no longer used',
      },
      description: 'If you entered this in a contest, add the contest here',
      of: [
        // https://www.sanity.io/docs/schema-types/reference-type
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'taxonomy.contest' }],
        }),
      ],
    }),
  ],
})
