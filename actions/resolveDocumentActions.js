import defaultResolve from 'part:@sanity/base/document-actions';
import PublishContributionAction from './publishContributionAction';
import PublishPersonAction from './publishPersonAction';
import PublishTicketAction from './publishTicketAction';

export default function resolveDocumentActions(props) {
  // Contribution documents need a distinct publish action for curatedContribution creation
  if (props.type.includes('contribution.')) {
    return [
      PublishContributionAction,
      ...defaultResolve(props).filter((action) => action.name !== 'PublishAction'),
    ];
  }
  // The person document calls /generate-ogimage when published
  if (props.type === 'person') {
    return [
      PublishPersonAction,
      ...defaultResolve(props).filter((action) => action.name !== 'PublishAction'),
    ];
  }
  // Tickets have an auto-generated slug, hence the custom publish action
  if (props.type.includes('ticket')) {
    return [
      PublishTicketAction,
      ...defaultResolve(props).filter((action) => action.name !== 'PublishAction'),
    ];
  }
  // Non-deletable documents
  if (
    props.type === 'person' ||
    props.type === 'taxonomy.contributionType'
  ) {
    return [
      ...defaultResolve(props).filter(
        (action) => action.name !== 'DeleteAction' && action.name !== 'DuplicateAction' && action.name !== 'UnpublishAction'
      ),
    ];
  }
  return defaultResolve(props);
}
