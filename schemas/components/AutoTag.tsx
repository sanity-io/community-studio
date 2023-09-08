import React, {useState, useEffect} from 'react';
import {useFormValue, useClient} from 'sanity';
import {Button} from '@sanity/ui';
import {v4 as uuid} from 'uuid';

const AutoTag = (props) => {
  const [tags, setTags] = useState([]);
  const thread = useFormValue(['thread']);
  const existingTags = useFormValue(['tags']);
  const id = useFormValue(['_id']);
  const client = useClient({apiVersion: '2021-03-25'});

  const threadContent = thread.map((thread) => thread.content).join(', ');

  const handleClick = async () => {
    const matches = await matchTags();
    const tagsToAdd = [];

    matches.forEach((match) => {
      const tag = tags.find((item) => item.title == match);

      if (existingTags && existingTags.some((existingTag) => existingTag._ref == tag._id)) return;

      tagsToAdd.push({
        _key: uuid(),
        _type: 'reference',
        _ref: tag._id,
      });
    });

    client.patch(id).setIfMissing({tags: []}).insert('after', 'tags[-1]', tagsToAdd).commit();
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
};

export default AutoTag;
