import defaultResolve from 'part:@sanity/base/document-actions';
import PublishContributionAction from './publishContributionAction';

export default function resolveDocumentActions(props) {
  // Contribution documents need a distinct publish action for curatedContribution creation
  if (props.type.includes('contribution.')) {
    return [
      PublishContributionAction,
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
