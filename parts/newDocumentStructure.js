// This prevents users from creating a new generalSettings or home file from the "Create new document" menu in Sanity
import S from '@sanity/base/structure-builder';

const CREATABLE_DOCUMENT_TYPES = ['guide', 'plugin', 'showcaseItem', 'starter'];

export default [
  ...S.defaultInitialValueTemplateItems().filter(({spec}) => {
    return CREATABLE_DOCUMENT_TYPES.includes(spec.templateId);
  }),
];
