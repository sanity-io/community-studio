// setAndPublishAction.js

import React, {useState, useEffect} from 'react';
import {useDocumentOperation} from '@sanity/react-hooks';
import Snackbar from 'part:@sanity/components/snackbar/item?';

export default function SetAndPublishAction(props) {
  const {patch, publish} = useDocumentOperation(props.id, props.type);
  const [status, setStatus] = useState('idle'); // idle, loading, error

  const readmeUrl = (props.draft || props.published || {}).readmeUrl;

  useEffect(() => {
    // if the status was loading and the draft has changed
    // to become `null` the document has been published
    if (status === 'loading' && !props.draft) {
      setStatus('idle');
    }
  }, [props.draft]);

  function dismissError() {
    setStatus('idle');
    props.onComplete();
  }

  return {
    disabled: publish.disabled || status === 'loading' || status === 'error',
    label: status === 'loading' ? 'Publishing…' : 'Publish',
    // This is a hacky way to show a Snackbar notification in case the action failed
    // @TODO: make this palatable to end users
    dialog: status === 'error' && {
      type: 'popover',
      onClose: dismissError,
      content: (
        <div style={{position: 'absolute'}}>
            <Snackbar
              offset={70}
              isOpen={true}
              id={`failed-to-publish-plugin`}
              setFocus={false}
              onClose={dismissError}
              onDismiss={dismissError}
              kind={'error'}
              title={"We couldn't get a README from the provided URL"}
              subtitle={
                "Open it in a new tab and make sure it's rendering a raw text or markdown file, then try again. If this problem persists, get in touch with the Sanity team."
              }
              isCloseable={true}
              onSetHeight={console.info}
            ></Snackbar>
        </div>
      ),
    },
    onHandle: async () => {
      // This will update the button text
      setStatus('loading');

      try {
        const res = await fetch(`/api/fetch-plugin-readme?readmeUrl=${readmeUrl}`);
        const {file} = await res.json();

        if (typeof file === 'string') {
          // Set publishedAt to current date and time
          patch.execute([{set: {readme: file}}]);

          // Perform the publish
          publish.execute();

          // We don't setStatus to success here because we're handling that through the useEffect above (listening to when props.draft becomes null)

          // Signal that the action is completed
          props.onComplete();
        } else {
          // When erroing out, props.onComplete will be called by the popover or Snackbar above ;)
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
      }
    },
  };
}
