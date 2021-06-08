import {CodeBlockIcon} from '@sanity/icons';

import PathInput from '../../components/PathInput';
import {contributionInitialValue, getContributionTaxonomies, ogImageField, publishedAtField} from './contributionUtils';

export default {
  name: 'contribution.schema',
  type: 'document',
  title: 'Schema & snippets',
  icon: CodeBlockIcon,
  initialValue: contributionInitialValue,
  preview: {
    select: {
      title: 'title',
      subtitle: '_type',
    },
  },
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title of your schema/snippet',
      description:
        "This will be reader's first impression, so remember to make it descriptive and enticing :)",
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: '📬 relative address in the community site',
      description: '💡 avoid special characters, spaces and uppercase letters.',
      type: 'slug',
      inputComponent: PathInput,
      options: {
        basePath: 'sanity.io/schemas',
        source: 'title',
        isUnique: () => true,
      },
      validation: (Rule) => Rule.optional(),
      // This is auto-generated in the publish action
      hidden: true,
    },
    ogImageField,
    publishedAtField,
    {
      title: '👀 Hide this Schema?',
      name: 'hidden',
      type: 'boolean',
      description: 'Turn this on to stop your schema from being seen while you work on it.',
    },
    {
      title: 'Headline / short description',
      name: 'description',
      type: 'string',
      description: 'Hints what it can be used for. This shows up in the preview card.',
    },
    {
      name: 'authors',
      type: 'array',
      title: '👤 Author(s)',
      description:
        'Credit yourself and others in the community who helped make this schema/snippet.',
      of: [
        {
          type: 'reference',
          to: [{type: 'person'}],
        },
      ],
    },
    {
      name: 'schemaFiles',
      title: 'Code files',
      description: 'Paste in the contents of all the related files from your Sanity studio repo.',
      type: 'array',
      of: [
        {
          type: 'schemaEntryObj',
        },
      ],
      validation: (Rule) => [
        Rule.required().min(1).error('At least 1 file/code entry is required.'),
        Rule.unique(),
      ],
    },
    {
      title: 'Deeper explanation',
      description:
        'Tell others what’s interesting about these files, and the purpose they’re intended to serve. Usability tips also appreciated by those who might extend on what you’ve made.',
      name: 'body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
        },
      ],
      validation: (Rule) => [
        Rule.required()
          .min(1)
          .warning(
            'An explanation is highly recommended to show readers the value of your snippet.'
          ),
      ],
    },
    ...getContributionTaxonomies('schema', {
      solutions: {
        title: 'Categories',
        description: 'Connect your schema/snippets to common themes in the Sanity community.',
      },
      categories: {
        title: 'Categories',
        description:
          'Connect your schema/snippets to common themes in the Sanity community. Let us know if you have more great category ideas.',
      },
      // @TODO: find a way to restrict this field only to tools that are studio plugins. Previously when we were using category we could reference those tools pointing to studio plugin, but now we'll need to get inventive
      // tools: {
      //   title: 'Any studio plugin this schema uses?',
      //   description:
      //     'Browse for tools, plugins, asset sources, SDKs and others that you are used, mentioned or suggested by this guide.',
      // },
    }),
    {
      title: 'Contest Tags',
      name: 'contests',
      type: 'array',
      description: "If you entered this in a contest, add the contest here",
      of: [
        // https://www.sanity.io/docs/schema-types/reference-type
        {
          type: 'reference',
          to: [
            {type: 'taxonomy.contest'},
          ],
        },
      ],
    },
  ],
};
