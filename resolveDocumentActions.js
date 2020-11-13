import defaultResolve from 'part:@sanity/base/document-actions';
import publishPluginAction from './publishPluginAction';

export default function resolveDocumentActions(props) {
  if (props.type === 'plugin') {
    return [
      publishPluginAction,
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
