import {useState, useEffect} from 'react';
import speakingurl from 'speakingurl';
import PublishIcon from 'part:@sanity/base/publish-icon';
import {useDocumentOperation, useValidationStatus} from '@sanity/react-hooks';

export const createCuratedContribution = async ({type, id}) => {
  const res = await fetch(
    `/api/curate-contribution?docId=${id.replace('drafts.', '')}&contributionType=${type}`
  );
  return res.status === 200;
};

export default function PublishContributionAction(props) {
  const {patch, publish} = useDocumentOperation(props.id, props.type);
  const {isValidating, markers} = useValidationStatus(props.id, props.type);
  const [status, setStatus] = useState('idle'); // idle, loading,
  // See https://github.com/sanity-io/sanity/issues/1932 to understand the need for this
  const [canPublish, allowPublish] = useState(false);

  useEffect(() => {
    // If the document has no changes or is already published, the publish operation will be disabled
    if (publish.disabled) {
      allowPublish(false);
      return;
    }
    // Otherwise, it might be the case that the document isn't valid, so we must check validity
    if (!isValidating) {
      // If there are no validation markers, the document is perfect and good for publishing
      if (markers.length === 0) {
        allowPublish(true);
      } else {
        allowPublish(false);
      }
    }
  }, [publish.disabled, isValidating]);

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

  const disabled = !canPublish || publish.disabled || status === 'loading' || status === 'error';
  return {
    disabled,
    label: status === 'loading' ? 'Publishing…' : 'Publish',
    icon: PublishIcon,
    shortcut: disabled ? null : 'Ctrl+Alt+P',
    onHandle: async () => {
      // This will update the button text
      setStatus('loading');

      const document = props.draft || props.published;

      // Schemas' slugs are auto-generated and hidden from users
      if (props.type === 'contribution.schema' && !document.slug?.current) {
        const slugFriendlyId = props.id.replace('drafts.', '').split('-')[0];
        const slugFriendlyTitle = speakingurl(document.title || document.headline || '', {
          symbols: true,
        });
        patch.execute([
          {
            set: {
              slug: {
                current: `${slugFriendlyTitle}-${slugFriendlyId}`,
              },
            },
          },
        ]);
      }

      // Perform the publish, the effect above will deal with it when its done
      publish.execute();
    },
  };
}
