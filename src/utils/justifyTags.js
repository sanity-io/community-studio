import sanityClient from 'part:@sanity/base/client';
import cq from 'concurrent-queue';
import {v4 as uuid} from 'uuid';

const client = sanityClient.withConfig({apiVersion: '2021-03-25'});
// Create a queue to limit the rate at which you write changes to Sanity
const queue = cq()
  .limit({concurrency: 10})
  .process(function (task) {
    return new Promise(function (resolve, reject) {
      setTimeout(resolve.bind(undefined, task), 1000);
    });
  });

const refQueue = cq()
  .limit({concurrency: 10})
  .process(function (task) {
    return new Promise(function (resolve, reject) {
      setTimeout(resolve.bind(undefined, task), 1000);
    });
  });

//We write our query for the document(s) we want to delete
const query = `*[_type == 'tag' && _id in path('drafts.**')]`;

const justifyTags = async () => {
  // Use the configured Studio client to fetch our documents
  const tags = await client.fetch(query);

  for (const tag of tags) {
    queue(tag).then(async () => {
      const newTag = {
        ...tag,
        _id: tag._id.split('.')[1],
      };
      await client
        .createOrReplace(newTag)
        .then((res) => console.log(res._id))
        .then(() => client.delete(tag._id));
      // const duplicates = tags.filter((tagOpt) => tagOpt.title == tag.title);
      // if (duplicates.length > 1) {
      //   const first = duplicates[0];
      //   const second = duplicates[1];

      //   if (first.totalRefs < 1) client.delete(first._id);
      //   if (second.totalRefs < 1) client.delete(second._id);

      //   if (first.totalRefs > second.totalRefs) {
      //     const allReferences = await client
      //       .fetch(`*[references($id)]{_id, tags[]{_type, _ref}}`, {id: second._id})
      //       .catch((err) => console.log(err));
      //     for (const ref of allReferences) {
      //       refQueue(ref).then(async () => {
      //         const newRef = {
      //           _ref: first._id,
      //           _type: 'reference',
      //         };
      //         const newTags = ref.tags.map((tag) => (tag._ref == second._id ? newRef : tag));

      //         const uniqueTags = [...new Set(newTags)].map((tag) => ({...tag, _key: uuid()}));

      //         client
      //           .patch(ref._id)
      //           .set({tags: uniqueTags})
      //           .commit()
      //           .then((doc) => console.log(doc._id, 'updated'))
      //           .catch((err) => console.log(err));
      //       });
      //     }
      //   }
      // }
    });
  }
};

justifyTags();

// execute this script by running
// $ sanity exec ./lib/utils/batchDelete.js --withUserToken
