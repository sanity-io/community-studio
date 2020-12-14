import { CodeBlockIcon } from '@sanity/icons';

import PathInput from '../../components/PathInput';

export default {
  name: 'contribution.schema',
  type: 'document',
  title: 'Schema',
  icon: CodeBlockIcon,
  // Set the current logged user as an author of a new document
  initialValue: () => {
    if (window._sanityUser?.role === 'administrator') {
      return {};
    }
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
    };
  },
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
      title: 'Title of your schema',
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
    {
      title: 'Headline / short description for the schema',
      name: 'description',
      type: 'string',
      description:
        'Hints what it can be used for. This shows up in the preview card for the schema.',
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
      name: 'schemaFiles',
      title: 'Schema code file(s)',
      type: 'array',
      of: [
        {
          type: 'schemaEntryObj',
        },
      ],
    },
    {
      name: 'categories',
      title: 'Category(ies)',
      description: "Get in touch if you don't find the tech you were looking for",
      // @TODO: description & maybe input component that allows to submit new taxonomy draft inline
      type: 'array',
      of: [
        {
          type: 'reference',
          title: 'Reference to schema category',
          to: [{type: 'taxonomy.category'}],
          options: {
            filter: '$type in applicableTo',
            filterParams: {
              type: 'contribution.schema',
            },
          },
        },
      ],
    },
    {
      name: 'tools',
      title: 'Any studio plugin this schema uses?',
      description:
        'Browse for tools, plugins, asset sources, SDKs and others that you are used, mentioned or suggested by this guide.',
      // @TODO: description & maybe input component that allows to submit new taxonomy draft inline
      type: 'array',
      of: [
        {
          type: 'reference',
          title: 'Reference to community tools',
          to: [
            {
              type: 'contribution.tool',
              options: {
                filter: '$pluginCatRef in categories[]._ref',
                filterParams: {
                  pluginCatRef: 'e88f1399-0b9a-47a9-9e0e-9c6f39039f36',
                },
              },
            },
          ],
        },
      ],
    },
  ],
};
