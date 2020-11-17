import defaultResolve from 'part:@sanity/base/document-actions';
import PublishContributionAction from './publishContributionAction';
import PublishToolAction from './publishToolAction';

export default function resolveDocumentActions(props) {
  // Tools need to fetch their readmeURLs before publishing, so they have their own publish action
  if (props.type === 'contribution.tool') {
    return [
      PublishToolAction,
      ...defaultResolve(props).filter((action) => action.name !== 'PublishAction'),
    ];
  }
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
        (action) => action.name !== 'DeleteAction' && action.name !== 'DuplicateAction'
      ),
    ];
  }
  return defaultResolve(props);
}
