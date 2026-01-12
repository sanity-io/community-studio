import {PublishIcon} from '@sanity/icons';
import {useState, useEffect} from 'react';
import {
  DocumentActionComponent,
  SanityDocument,
  useDocumentOperation,
  useValidationStatus,
} from 'sanity';
import speakingurl from 'speakingurl';


interface Ticket extends SanityDocument {
  editorialTitle: string;
  summary: string;
  slug: {
    current: string;
  };
  permalink: string;
  thread: {
    _key: string;
    type: string;
    content: string;
  }[];
}

const PublishTicketAction: DocumentActionComponent = (props) => {
  const {patch, publish} = useDocumentOperation(props.id, props.type);
  const {isValidating, validation: markers} = useValidationStatus(props.id, props.type);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

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
  }, [publish.disabled, isValidating, markers]);

  useEffect(() => {
    // if the status was loading and the draft has changed
    // to become `null` the document has been published
    if (status === 'loading' && !props.draft) {
      // Signal that the action is completed
      props.onComplete();
    }
  }, [status, props.draft, props.onComplete]);

  async function onHandle() {
    // This will update the button text
    setStatus('loading');

    // Auto-generate a slug if not set yet
    const document = (props.draft || props.published) as Ticket;
    if (!document.slug?.current) {
      const [lastPermalinkPath] = document.permalink.split('/').slice(-1);
      const slugFriendlyId = lastPermalinkPath.split('?')[0];

      const textForSlug =
        document.editorialTitle || document.summary || document.thread[0]?.content || '';

      let slugFriendlyTitle = speakingurl(textForSlug, {
        symbols: true,
      })
        .split('-')
        // Instead of doing a simple slice() operation, we use this reduce to make sure we don't cut words in half
        .reduce((accSlug, curSegment) => {
          if (accSlug.length > 40) {
            return accSlug;
          }
          if (accSlug === '') {
            return curSegment;
          }
          return `${accSlug}-${curSegment}`;
        }, '');

      patch.execute(
        [
          {
            set: {
              slug: {
                current: `${slugFriendlyTitle}-${slugFriendlyId}`.replace(/-{2,}/g, '-'),
              },
            },
          },
        ],
        {}
      );
    }

    publish.execute();
  }

  // Only rely on canPublish (which already factors in publish.disabled) and status
  // The redundant publish.disabled check was causing issues when state got out of sync
  const disabled = !canPublish || status === 'loading' || status === 'error';

  return {
    disabled,
    label: status === 'loading' ? 'Publishing…' : 'Publish',
    icon: PublishIcon,
    shortcut: disabled ? null : 'Ctrl+Alt+P',
    onHandle,
  };
};

export default PublishTicketAction;
