import {getCliClient} from '@sanity/cli';
import cq from 'concurrent-queue';
import {v4 as uuid} from 'uuid';

const client = getCliClient({apiVersion: '2023-03-22'});

const queue = cq()
  .limit({concurrency: 10})
  .process(function (task) {
    return new Promise(function (resolve, reject) {
      setTimeout(resolve.bind(undefined, task), 1000);
    });
  });

const query = `*[_type == 'ticket' && !defined(tags)]{
  _id,
  "matchedTags": *[_type == 'tag' && (^.thread[].content match title || ^.thread[].content match alternatives) ]._id
}[0...100]`;

const autoTag = async () => {
  const batch = await client.fetch(query);
  console.log(batch);

  for (const doc of batch) {
    queue(doc).then(async () => {
      const tags = doc.matchedTags.map((_id) => ({
        _type: 'reference',
        _ref: _id,
        _key: uuid(),
      }));

      console.log('tags generated');

      await client
        .patch(doc._id)
        .set({tags: tags})
        .commit()
        .then((updatedDoc) => console.log(updatedDoc._id, 'updated'))
        .catch((err) => console.log(err.message));

      if (batch.indexOf(doc) == batch.length - 1) {
        console.log('fetching next batch...');
        return autoTag();
      }
    });
  }
};

autoTag();
