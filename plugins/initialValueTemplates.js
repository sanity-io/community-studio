//V3FIXME
import T from '@sanity/base/initial-value-template-builder';

export const initialValueTemplates = [
  ...T.defaults(),
  T.template({
    id: 'create-curatedContribution',
    title: 'Create new curated contribution',
    schemaType: 'curatedContribution',
    value: ({contributionId}) => ({
      _id: `curated.${contributionId}`,
      contribution: {
        _type: 'reference',
        _ref: contributionId,
        _weak: true,
      },
    }),
  }),
];
