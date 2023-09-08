// @ts-ignore
import {Button} from '@sanity/ui';
import {uuid} from '@sanity/uuid';
import React, {useState, useEffect} from 'react';
import {useFormValue, useClient} from 'sanity';

type Tag = {
  _id: string;
  _key: string;
  _type: string;
  _ref: string;
  title: string;
};

const AutoTag = (props: any) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const thread: any = useFormValue(['thread']);
  const existingTags = useFormValue(['tags']);
  const id = useFormValue(['_id']);
  const client = useClient({apiVersion: '2021-03-25'});

  const threadContent = thread.map((thread: any) => thread.content).join(', ');

  const handleClick = async () => {
    const matches = await matchTags();
    const tagsToAdd: Tag[] = [];

    matches.forEach((match) => {
      // @ts-ignore
      const tag = tags.find((item) => item.title == match);
      // @ts-ignore
      if (existingTags && existingTags.some((existingTag) => existingTag._ref == tag._id)) return;
      // @ts-ignore
      tagsToAdd.push({
        _key: uuid(),
        _type: 'reference',
        // @ts-ignore
        _ref: tag._id,
      });
    });
    // @ts-ignore
    client.patch(id).setIfMissing({tags: []}).insert('after', 'tags[-1]', tagsToAdd).commit();
  };

  const matchTags = async (): Promise<Tag[]> => {
    const queryPieces = tags
      .map((tag) => `"${tag.title}": $threadContent match "${tag.title}"`)
      .join(', ');
    const query = `{${queryPieces}}`;

    const matches = await client
      .fetch(query, {threadContent})
      .then((res) => Object.keys(res).filter((key) => res[key]));
    // @ts-ignore
    return matches;
  };

  useEffect(() => {
    const getTags = async () => {
      await client
        .fetch(
          `*[_type == 'tag']{
          _id,
          title
        } | order(title asc)`,
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
