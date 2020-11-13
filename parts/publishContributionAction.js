// setAndPublishAction.js

import {useState, useEffect} from 'react';
import {useDocumentOperation} from '@sanity/react-hooks';

export const createCuratedContribution = async ({type, id}) => {
  const res = await fetch(
    `/api/curate-contribution?docId=${id.replace('drafts.', '')}&contributionType=${type}`
  );
  return res.status === 200;
};

export default function PublishContributionAction(props) {
  const {publish} = useDocumentOperation(props.id, props.type);
  const [status, setStatus] = useState('idle'); // idle, loading,

  async function resolvePublish() {
    const createdCuratedDoc = await createCuratedContribution({type: props.type, id: props.id});

    console.log({createdCuratedDoc});
    // @TODO: better error handling
    if (!createdCuratedDoc) {
      setStatus('error');
    }

    setStatus('idle');

    // Signal that the action is completed
    props.onComplete();
  }

  useEffect(() => {
    // if the status was loading and the draft has changed
    // to become `null` the document has been published
    if (status === 'loading' && !props.draft) {
      resolvePublish();
    }
  }, [props.draft]);

  return {
    disabled: publish.disabled || status === 'loading' || status === 'error',
    label: status === 'loading' ? 'Publishing…' : 'Publish',
    onHandle: async () => {
      // This will update the button text
      setStatus('loading');

      // Perform the publish, the effect above will deal with it when its done
      publish.execute();
    },
  };
}
