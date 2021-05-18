import {StarIcon, CodeIcon} from '@sanity/icons';
import contributions from '../documents/contributions';

const handpickedContributions = {
  name: 'handpickedContributions',
  title: 'Handpicked Contribution(s)',
  type: 'object',
  icon: StarIcon,
  fields: [
    {
      name: 'title',
      title: 'Title above the contribution',
      description: 'Optional',
      type: 'string',
    },
    {
      name: 'contributions',
      title: 'Contribution(s)',
      description: "If only one is chosen, it'll show up with more visual relevancy.",
      validation: (Rule) => [Rule.required(), Rule.unique()],
      type: 'array',
      of: [
        {
          title: 'Contribution',
          type: 'reference',
          validation: (Rule) => Rule.required(),
          to: contributions.map((type) => ({
            type: type.name,
          })),
          // This is necessary to allow members to delete their creations
          weak: true,
          options: {
            filter: ({document}) => {
              if (document.contributionType) {
                return {filter: `_type == "${document.contributionType}"`};
              }
              return;
            },
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      contributions: 'contributions',
    },
    prepare({title = 'Handpicked contributions (no title)', contributions}) {
      return {
        title,
        subtitle: contributions?.length
          ? `${contributions.length} contributions chosen`
          : 'No contributions chosen',
      };
    },
  },
};

const getStartedCli = {
  name: 'getStartedCli',
  title: 'CTA to get started with the CLI',
  type: 'object',
  icon: CodeIcon,
  fields: [
    {
      name: 'title',
      title: 'Title above the code',
      description: 'Optional. Defaults to "Start with the CLI"',
      type: 'string',
    },
    {
      name: 'subtitle',
      title: 'Subtitle above the code',
      description: 'Optional.',
      type: 'string',
    },
  ],
};

export default [handpickedContributions, getStartedCli];
