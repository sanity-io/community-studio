// setAndPublishAction.js

import {useState, useEffect} from 'react';
import {useDocumentOperation} from '@sanity/react-hooks';

export default function SetAndPublishAction(props) {
  const {patch, publish} = useDocumentOperation(props.id, props.type);
  const [isPublishing, setIsPublishing] = useState(false);

  const readmeUrl = (props.draft || props.published).readmeUrl;

  useEffect(() => {
    // if the isPublishing state was set to true and the draft has changed
    // to become `null` the document has been published
    if (isPublishing && !props.draft) {
      setIsPublishing(false);
    }
  }, [props.draft]);

  return {
    disabled: publish.disabled || isPublishing,
    label: isPublishing ? 'Publishing…' : 'Publish',
    onHandle: async () => {
      // This will update the button text
      setIsPublishing(true);

      const res = await fetch(
        `http://localhost:3000/api/fetch-plugin-readme?readmeUrl=${readmeUrl}`
      );
      // @TODO: error handling
      const {file} = await res.json();

      if (typeof file === 'string') {
        // Set publishedAt to current date and time
        patch.execute([{set: {readme: file}}]);
      }

      // Perform the publish
      publish.execute();

      // Signal that the action is completed
      props.onComplete();
    },
  };
}
