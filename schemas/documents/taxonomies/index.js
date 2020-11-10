import combination from './combination';
import framework from './framework';
import integration from './integration';
import integrationType from './integrationType';
import language from './language';
import projectType from './projectType';
import solution from './solution';

const allTaxonomies = [
  framework,
  language,
  integrationType,
  integration,
  projectType,
  solution,
  combination,
];

export default allTaxonomies;

console.log({allTaxonomies})

export const taxonomiesReferenceField = {
  type: 'reference',
  title: "Reference to a tag",
  to: allTaxonomies
    .filter((type) => type.name !== 'taxonomy.combination')
    .map((type) => ({type: type.name})),
};
