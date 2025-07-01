// This prevents users from creating a new generalSettings or home file from the "Create new document" menu in Sanity

const CREATABLE_TYPES_COMMUNITY = [
  'contribution.guide',
  'contribution.plugin',
  'contribution.showcaseProject',
  'contribution.starter',
  'contribution.tool',
]

const CREATABLE_TYPES_ADMIN = [
  ...CREATABLE_TYPES_COMMUNITY,
  'taxonomy.integration',
  'taxonomy.framework',
  'taxonomy.usecase',
  'taxonomy.cssframework',
  'taxonomy.language',
  'taxonomy.solution',
  'taxonomy.category',
  'taxonomy.combination',
  'studioTutorial',
]

export const newDocumentOptions = (prev, { currentUser }) => {
  if (currentUser.roles.find((role) => role.name === 'administrator')) {
    return prev.filter(({ templateId }) => CREATABLE_TYPES_ADMIN.includes(templateId))
  }
  return prev.filter(({ templateId }) => CREATABLE_TYPES_COMMUNITY.includes(templateId))
}
