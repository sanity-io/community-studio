import React, {useState, useEffect} from 'react';
import {withDocument} from 'part:@sanity/form-builder';
import {Button} from '@sanity/ui';
import sanityClient from 'part:@sanity/base/client';
import {v4 as uuid} from 'uuid';

const client = sanityClient.withConfig({apiVersion: '2021-03-25'});

const AutoTag = React.forwardRef((props, ref) => {
  const [tags, setTags] = useState([]);

  const {document} = props;

  const threadContent = document.thread.map((thread) => thread.content).join(', ');

  const handleClick = async () => {
    const matches = await matchTags();

    matches.forEach((match) => {
      const tag = tags.find((item) => item.title == match);

      if (document.tags && document.tags.some((existingTag) => existingTag._ref == tag._id)) return;

      client
        .patch(document._id)
        .setIfMissing({tags: []})
        .insert('after', 'tags[-1]', [
          {
            _key: uuid(),
            _type: 'reference',
            _ref: tag._id,
          },
        ])
        .commit();
    });
  };

  const matchTags = async () => {
    const queryPieces = tags
      .map((tag) => `"${tag.title}": $threadContent match "${tag.title}"`)
      .join(', ');
    const query = `{${queryPieces}}`;

    const matches = await client
      .fetch(query, {threadContent})
      .then((res) => Object.keys(res).filter((key) => res[key]));

    return matches;
  };

  useEffect(() => {
    const getTags = async () => {
      await client
        .fetch(
          `*[_type == 'tag']{
          _id,
          title
        } | order(title asc)`
        )
        .then(setTags);
    };

    getTags();
  }, []);

  return (
    <Button fontSize={2} padding={[3, 3, 4]} text="Auto Tag" tone="primary" onClick={handleClick} />
  );
});

export default withDocument(AutoTag);
