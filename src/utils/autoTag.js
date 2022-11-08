import sanityClient from 'part:@sanity/base/client';
import cq from 'concurrent-queue';
import {v4 as uuid} from 'uuid';

const client = sanityClient.withConfig({apiVersion: '2022-10-25'});

let queue = cq()
  .limit({concurrency: 10})
  .process(function (task) {
    return new Promise(function (resolve, reject) {
      setTimeout(resolve.bind(undefined, task), 1000);
    });
  });

const query = `*[_type == 'ticket' && !defined(tags[0])]{
  _id,
  "matchedTags": *[_type == 'tag' && (^.thread[].content match title || ^.thread[].content match alternatives) ]._id
}`;

const autoTag = async () => {
  const docs = await client.fetch(query);

  for (const doc of docs) {
    queue(doc).then(async () => {
      const tags = doc.matchedTags.map((_id) => ({
        _type: 'reference',
        _ref: _id,
        _key: uuid(),
      }));

      await client
        .patch(doc._id)
        .set({tags: tags})
        .commit({autoGenerateArrayKeys: true})
        .then((updatedDoc) => console.log(updatedDoc._id, 'updated'))
        .catch((err) => console.log(err.message));
    });
  }
};

autoTag();
