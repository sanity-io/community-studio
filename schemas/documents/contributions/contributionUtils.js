export const contributionInitialValue = () => {
  // Admins won't necessarily add themselves as authors
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
};

/**
 * Centralized way to maintain taxonomies for all contributions
 * @param type: _type without the "contribution." part
 */
export const getContributionTaxonomies = (
  type,
<<<<<<< HEAD
  {categories, frameworks, tools, integrations, solutions}
) => {
  const taxonomies = [];
=======
  {categories, frameworks, tools, integrations, solutions, usecases, cssframeworks}
) => {
  const taxonomies = [];

>>>>>>> 62f3a0d
  if (solutions?.title) {
    taxonomies.push({
      name: 'solutions',
      title: solutions.title,
      description: solutions.description,
<<<<<<< HEAD
=======
      hidden: solutions.hidden,
>>>>>>> 62f3a0d
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
<<<<<<< HEAD
=======
      hidden: categories.hidden,
>>>>>>> 62f3a0d
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
<<<<<<< HEAD
=======
      validation: frameworks?.validation,
>>>>>>> 62f3a0d
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
<<<<<<< HEAD
=======
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
>>>>>>> 62f3a0d
  if (integrations?.title) {
    taxonomies.push({
      name: 'integrations',
      title: integrations?.title,
      description: integrations?.description,
      type: 'array',
<<<<<<< HEAD
=======
      hidden: integrations?.hidden,
>>>>>>> 62f3a0d
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
<<<<<<< HEAD
=======
      hidden: tools?.hidden,
>>>>>>> 62f3a0d
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
<<<<<<< HEAD
    hotspot: true
  }
=======
    hotspot: true,
  },
>>>>>>> 62f3a0d
};

export const publishedAtField = {
  name: 'publishedAt',
  title: 'Published at',
  description: 'Generated automatically in the publish action.',
  type: 'datetime',
  hidden: true,
};
