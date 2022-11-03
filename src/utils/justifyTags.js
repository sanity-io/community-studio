import sanityClient from 'part:@sanity/base/client';
import cq from 'concurrent-queue';

const client = sanityClient.withConfig({apiVersion: '2021-03-25'});
// Create a queue to limit the rate at which you write changes to Sanity
const queue = cq()
  .limit({concurrency: 2})
  .process(function (task) {
    return new Promise(function (resolve, reject) {
      setTimeout(resolve.bind(undefined, task), 1000);
    });
  });

//We write our query for the document(s) we want to delete
const query = `{'tags': *[_type == 'tag'], 'tagOptions': *[_type == 'tagOption']}`;

const justifyTags = async () => {
  // Use the configured Studio client to fetch our documents
  const {tags, tagOptions} = await client.fetch(query);

  for (const tagOption of tagOptions) {
    queue(tagOption).then(async () => {
      if (!tags.find((tag) => tag.value == tagOption.value)) {
        const newDoc = {
          ...tagOption,
          _type: 'tag',
        };

        await client.delete(tagOption._id).then(() =>
          client
            .create(newDoc)
            .then(() => {
              console.log(`Created ${newDoc._id}`);
            })
            .catch((err) => {
              console.error('Creation Failed: ', err.message);
            })
        );
      }
    });
  }
};

justifyTags();

// execute this script by running
// $ sanity exec ./lib/utils/batchDelete.js --withUserToken
