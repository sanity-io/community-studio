import sanityClient from 'part:@sanity/base/client';
import cq from 'concurrent-queue';
const client = sanityClient.withConfig({apiVersion: '2022-11-10'});

const queue = cq()
  .limit({concurrency: 20})
  .process(function (task) {
    return new Promise(function (resolve, reject) {
      setTimeout(resolve.bind(undefined, task), 1000);
    });
  });

const migrateEditorial = async () => {
  const query = `*[_type == 'ticket' && count(*[_type == 'editorial' && references(^._id)]) < 1][0...100]`;

  const tickets = await client.fetch(query);

  for (const ticket of tickets) {
    queue(ticket).then(async () => {
      const {
        _id,
        permalink,
        relevancy,
        editorialTitle,
        featured,
        solutions,
        categories,
        frameworks,
        integrations,
        tools,
        slug,
        summary,
        action,
        solvedWith,
        assigned,
      } = ticket;

      const editorialId = _id.includes('drafts.') ? _id.slice(7) : _id;

      const editorialDoc = {
        _type: 'editorial',
        _id: `editorial.${editorialId}`,
        ticket: {
          _type: 'reference',
          _ref: _id,
        },
        permalink,
        editorialTitle,
        featured,
        relevancy,
        solutions,
        categories,
        frameworks,
        integrations,
        tools,
        slug,
        summary,
        action,
        solvedWith,
        assigned,
      };

      if (!Object.keys(editorialDoc).length) return;

      console.log('Editorial fields generated...');

      const ticketFieldsToUnset = Object.keys(editorialDoc).filter(
        (key) => !['_id', '_type'].includes(key)
      );

      Object.keys(editorialDoc).forEach((key) =>
        editorialDoc[key] ? {} : delete editorialDoc[key]
      );

      await client
        .createOrReplace(editorialDoc)
        .then((doc) => console.log(`Editorial doc ${doc._id} created`));

      await client
        .patch(ticket._id)
        .unset(ticketFieldsToUnset)
        .commit()
        .then((doc) => console.log(`${doc._id} updated`));

      if (tickets.indexOf(ticket) == tickets.length - 1) {
        console.log('MIGRATING NEXT BATCH...');
        migrateEditorial().catch((err) => {
          console.error(JSON.stringify(err, null, 2));
          process.exit(1);
        });
      }
    });
  }
};

migrateEditorial().catch((err) => {
  console.error(JSON.stringify(err, null, 2));
  process.exit(1);
});
