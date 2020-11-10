import {taxonomiesReferenceField} from '.';
import {getTaxonomySchema} from './getTaxonomy';

export default getTaxonomySchema({
  name: 'combination',
  title: 'Taxonomy combination',
  description: 'Used to generate SEO-ready landing pages for a combination of taxonomies',
  extraFields: [
    // {
    //   name: 'taxonomies',
    //   title: 'Taxonomies combined',
    //   type: 'array',
    //   of: [taxonomiesReferenceField],
    // },
  ],
});
