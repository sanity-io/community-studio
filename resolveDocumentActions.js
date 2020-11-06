import defaultResolve from 'part:@sanity/base/document-actions';
import publishPluginAction from './publishPluginAction';

export default function resolveDocumentActions(props) {
  if (props.type === 'plugin') {
    return [
      publishPluginAction,
      ...defaultResolve(props).filter((action) => action.name !== 'PublishAction'),
    ];
  }
  return defaultResolve(props);
}
