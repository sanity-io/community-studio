import { DocumentActionsResolver } from 'sanity'
import PublishContributionAction from './publishContributionAction'
import PublishTicketAction from './publishTicketAction'

export const resolveDocumentActions: DocumentActionsResolver = (prev, context) => {
  const { currentUser, schemaType } = context

  // Contribution documents need a distinct publish action for curatedContribution creation
  if (schemaType.includes('contribution.')) {
    return [PublishContributionAction, ...prev.filter(({ action }) => action !== 'publish')]
  }

  // Tickets have an auto-generated slug, hence the custom publish action
  if (schemaType.includes('ticket')) {
    return [PublishTicketAction, ...prev.filter(({ action }) => action !== 'publish')]
  }

  // Permit Sanity administrators to delete users
  if (
    schemaType === 'person' &&
    currentUser?.roles.some((role) => role?.name === 'administrator') &&
    currentUser?.email.endsWith('@sanity.io')
  ) {
    return prev
  }

  // Non-deletable documents
  if (schemaType === 'person' || schemaType === 'taxonomy.contributionType') {
    return [
      ...prev.filter(
        ({ action }) => action !== 'delete' && action !== 'duplicate' && action !== 'unpublish',
      ),
    ]
  }

  return prev
}
