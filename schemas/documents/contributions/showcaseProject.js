import React from 'react';
import Icon from '../../components/icon';
import PathInput from '../../components/PathInput';

export default {
  name: 'contribution.showcaseProject',
  type: 'document',
  title: 'Project for the showcase',
  icon: () => <Icon emoji="💎" />,
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
    };
  },
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Project name',
    },
    {
      name: 'description',
      title: 'Headline / short description for the project',
      description:
        "Use this space to explain briefly what the project is. You'll have room for details in the in-depth explanation field below :)",
      type: 'text',
      rows: 1,
    },
    {
      name: 'url',
      type: 'url',
      title: 'URL to access it',
      description: "If you don't have a public URL, feel free to leave this empty",
    },
    {
      name: 'slug',
      title: '📬 relative address in the community site',
      description: '💡 avoid special characters, spaces and uppercase letters.',
      type: 'slug',
      inputComponent: PathInput,
      options: {
        basePath: 'sanity.io/projects',
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'authors',
      title: '👤 Author(s)',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            {
              type: 'person',
            },
          ],
        },
      ],
    },
    {
      name: 'image',
      type: 'image',
      title: 'Main image for this project',
      description:
        'This image will be featured in the card for this project, in the initial section of its page and for sharing links in social media.',
    },
    {
      name: 'projectScreenshots',
      type: 'array',
      title: 'Screenshots of the project',
      description:
        'Not to be confused with screenshots of the Sanity studio used in this project. For that, use the field below.',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
            storeOriginalFilename: false,
          },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              options: {
                isHighlighted: true,
              },
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description:
                "Help people who for any reason can't download or see the image by providing a descriptive text about what it contains 😇",
              options: {
                isHighlighted: true,
              },
            },
          ],
        },
      ],
      options: {
        layout: 'grid',
      },
      validation: (Rule) => [Rule.unique()],
    },
    {
      name: 'studioScreenshots',
      type: 'array',
      title: 'Sanity Studio Screenshots',
      description:
        'Some suggestions for what to screenshot: your desk structure; the dashboard and other tools installed; your most interesting schema, etc.',
      of: [
        {
          type: 'studioImage',
        },
      ],
      options: {
        layout: 'grid',
      },
      validation: (Rule) => [Rule.unique()],
    },
    {
      title: 'In-depth explanation of the project',
      name: 'body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
        },
      ],
      description:
        'Here you can talk about the challenges, the solutions you came up with, how did you choose the tech, etc.',
    },
    {
      name: 'categories',
      title: 'Category(ies)',
      description: "Get in touch if you don't find the category you were looking for",
      // @TODO: description & maybe input component that allows to submit new taxonomy draft inline
      type: 'array',
      of: [
        {
          type: 'reference',
          title: 'Reference to showcase categories',
          to: [{type: 'taxonomy.category'}],
          options: {
            filter: '$type in applicableTo',
            filterParams: {
              type: 'contribution.showcaseProject',
            },
          },
        },
      ],
    },
    {
      name: 'frameworks',
      title: 'Framework(s) / tech you used when creating this',
      description: "Get in touch if you don't find the tech you were looking for",
      // @TODO: description & maybe input component that allows to submit new taxonomy draft inline
      type: 'array',
      of: [
        {
          type: 'reference',
          title: 'Reference to framework',
          to: [{type: 'taxonomy.framework'}],
        },
      ],
    },
    {
      name: 'integrations',
      title: 'Services you integrated with',
      description: "Get in touch if you don't find the one(s) you were looking for",
      // @TODO: description & maybe input component that allows to submit new taxonomy draft inline
      type: 'array',
      of: [
        {
          type: 'reference',
          title: 'Reference to integration',
          to: [{type: 'taxonomy.integration'}],
        },
      ],
    },
    {
      name: 'tools',
      title: 'Any Sanity tool this project uses?',
      description:
        'Browse for tools, plugins, asset sources, SDKs and others that you are used by this project.',
      // @TODO: description & maybe input component that allows to submit new taxonomy draft inline
      type: 'array',
      of: [
        {
          type: 'reference',
          title: 'Reference to community tools',
          to: [{type: 'contribution.tool'}],
        },
      ],
    },
  ],
  preview: {
    select: {
      media: 'image',
      title: 'title',
      subtitle: 'url',
    },
  },
};
