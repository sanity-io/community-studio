//V3FIXME
import {useClient} from 'sanity';
// @ts-expect-error
import cq from 'concurrent-queue';
import {uuid} from '@sanity/uuid';
//V3FIXME
const client = useClient().withConfig({apiVersion: '2021-03-25'});
// Create a queue to limit the rate at which you write changes to Sanity
const queue = cq()
  .limit({concurrency: 2})
  .process(function (task: any) {
    return new Promise(function (resolve, reject) {
      setTimeout(resolve.bind(undefined, task), 1000);
    });
  });

//We write our query for the document(s) we want to delete
const query = `{'tickets': *[_type == 'ticket' && defined(tags[0]) && !defined(tags[0]._ref)], 'tags': *[_type == 'tag']}`;

const migrateTags = async () => {
  // Use the configured Studio client to fetch our documents
  const {tickets, tags} = await client.fetch(query).catch((err) => console.log(err));

  for (const ticket of tickets) {
    queue(ticket).then(async () => {
      const updatedTags = ticket.tags.map((ticketTag: any) => {
        const ref = tags.find((tag: any) => tag.value.current == ticketTag.value);
        return {_type: 'reference', _ref: ref._id, _key: uuid()};
      });

      await client
        .patch(ticket._id)
        .set({tags: updatedTags})
        .commit()
        .then((updatedDoc) => `Hurray, the bike is updated! New document: ${updatedDoc._id}`)
        .catch((err) => {
          console.error('Oh no, the update failed: ', err.message);
        });
    });
  }
};

migrateTags();

// execute this script by running
// $ sanity exec ./lib/utils/batchDelete.js --withUserToken
