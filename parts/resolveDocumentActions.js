import defaultResolve from 'part:@sanity/base/document-actions';
import PublishContributionAction from './publishContributionAction';
import PublishPluginAction from './publishPluginAction';

export default function resolveDocumentActions(props) {
  if (props.type === 'contribution.tool') {
    return [
      PublishPluginAction,
      ...defaultResolve(props).filter((action) => action.name !== 'PublishAction'),
    ];
  }
  if (props.type.includes('contribution.')) {
    return [
      PublishContributionAction,
      ...defaultResolve(props).filter((action) => action.name !== 'PublishAction'),
    ];
  }
  if (
    (props.type === 'person' && window._sanityUser?.provider === 'external') ||
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
