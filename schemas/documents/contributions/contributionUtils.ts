export const contributionInitialValue = (value, {currentUser}) => {
  // Admins won't necessarily add themselves as authors
  if (currentUser?.role === 'administrator') {
    return {};
  }
  const curUserId = currentUser?.id;

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
};

/**
 * Centralized way to maintain taxonomies for all contributions
 * @param type: _type without the "contribution." part
 */
export const getContributionTaxonomies = (
  type,
  {categories, frameworks, tools, integrations, solutions, usecases, cssframeworks}
) => {
  const taxonomies = [];

  if (solutions?.title) {
    taxonomies.push({
      name: 'solutions',
      title: solutions.title,
      description: solutions.description,
      hidden: solutions.hidden,
      type: 'array',
      of: [
        {
          type: 'reference',
          title: `Reference to ${type} solution`,
          to: [{type: 'taxonomy.solution'}],
          options: !!type
            ? {
                filter: '$type in applicableTo',
                filterParams: {
                  type: `contribution.${type}`,
                },
              }
            : {},
        },
      ],
    });
  }
  if (categories?.title) {
    taxonomies.push({
      name: 'categories',
      title: categories.title,
      description: categories.description,
      hidden: categories.hidden,
      type: 'array',
      // We're migrating off categories, hence the need to hide them
      hidden: true,
      of: [
        {
          type: 'reference',
          title: `Reference to ${type} category`,
          to: [{type: 'taxonomy.category'}],
          options: !!type
            ? {
                filter: '$type in applicableTo',
                filterParams: {
                  type: `contribution.${type}`,
                },
              }
            : {},
        },
      ],
    });
  }
  if (frameworks?.title) {
    taxonomies.push({
      name: 'frameworks',
      title: frameworks?.title,
      description: frameworks?.description,
      validation: frameworks?.validation,
      type: 'array',
      of: [
        {
          type: 'reference',
          title: 'Reference to framework',
          to: [{type: 'taxonomy.framework'}],
        },
      ],
    });
  }
  if (cssframeworks?.title) {
    taxonomies.push({
      name: 'cssframeworks',
      title: cssframeworks?.title,
      description: cssframeworks?.description,
      hidden: cssframeworks?.hidden,
      validation: cssframeworks?.validation,
      type: 'array',
      of: [
        {
          type: 'reference',
          title: 'Reference to cssframework',
          to: [{type: 'taxonomy.cssframework'}],
        },
      ],
    });
  }
  if (usecases?.title) {
    taxonomies.push({
      name: 'usecases',
      title: usecases?.title,
      description: usecases?.description,
      hidden: usecases?.hidden,
      validation: usecases?.validation,
      type: 'array',
      of: [
        {
          type: 'reference',
          title: 'Reference to usecase',
          to: [{type: 'taxonomy.usecase'}],
        },
      ],
    });
  }
  if (integrations?.title) {
    taxonomies.push({
      name: 'integrations',
      title: integrations?.title,
      description: integrations?.description,
      type: 'array',
      hidden: integrations?.hidden,
      of: [
        {
          type: 'reference',
          title: 'Reference to integration/service',
          to: [{type: 'taxonomy.integration'}],
        },
      ],
    });
  }
  if (tools?.title) {
    taxonomies.push({
      name: 'tools',
      title: tools?.title,
      description: tools?.description,
      type: 'array',
      hidden: tools?.hidden,
      of: [
        {
          type: 'reference',
          title: 'Reference to community tools',
          to: [{type: 'contribution.tool'}],
        },
      ],
    });
  }
  return taxonomies;
};

export const ogImageField = {
  name: 'ogImage',
  title: 'Sharing image',
  description: 'Generated automatically in the publish action.',
  type: 'image',
  hidden: true,
  options: {
    hotspot: true,
  },
};

export const publishedAtField = {
  name: 'publishedAt',
  title: 'Published at',
  description: 'Generated automatically in the publish action.',
  type: 'datetime',
  hidden: true,
};
