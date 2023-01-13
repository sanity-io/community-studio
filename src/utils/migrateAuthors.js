import sanityClient from 'part:@sanity/base/client';
import cq from 'concurrent-queue';

const client = sanityClient.withConfig({apiVersion: '2021-03-25'});
// Create a queue to limit the rate at which you write changes to Sanity
const queue = cq()
  .limit({concurrency: 10})
  .process(function (task) {
    return new Promise(function (resolve, reject) {
      setTimeout(resolve.bind(undefined, task), 1000);
    });
  });

//We write our query for the document(s) we want to delete
const query = `*[_type == 'ticket' && !defined(thread[0].author._type)]`;

const migrateTags = async () => {
  // Use the configured Studio client to fetch our documents
  const tickets = await client.fetch(query);

  for (const ticket of tickets) {
    queue(ticket).then(async () => {
      const author = {
        slackName: ticket.authorName,
        slackId: ticket.thread[0].author,
      };

      const thread = ticket.thread.map((message) => ({
        ...message,
        author: {
          _type: 'slackAuthor',
          slackId: message.author,
        },
      }));

      await client
        .patch(ticket._id)
        .unset(['authorName'])
        .set({author, thread})
        .commit()
        .then((doc) => console.log(doc._id, ' migrated'))
        .catch((err) => console.log(err.msg));
    });
  }
};

migrateTags();

// execute this script by running
// $ sanity exec ./lib/utils/batchDelete.js --withUserToken
