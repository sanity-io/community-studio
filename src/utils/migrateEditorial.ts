import PQueue from 'p-queue';
import pRetry from 'p-retry';
import {getCliClient} from 'sanity/cli';

const client = getCliClient({
  apiVersion: '2023-05-10',
});

const queue = new PQueue({
  concurrency: 50,
});

/**
 * For all `ticket` documents with no corresponding `editorial` document, create an
 * editorial document and move the following fields to it:
 *
 * - `permalink`
 * - `editorialTitle`
 * - `featured`
 * - `relevancy`
 * - `solutions`
 * - `frameworks`
 * - `integrations`
 * - `tools`
 * - `slug`
 * - `summary`
 * - `action`
 * - `solvedWith`
 */
const migrateEditorial = async () => {
  // Fetch `ticket` documents that do not have a corresponding `editorial` document.
  const query = `
    *[
      _type == "ticket" &&
      !defined(*[_type == "editorial" && ticket._ref == ^._id][0]) &&
      !(_id in path("drafts.**"))
    ][0...$limit] {
      _id,
      permalink,
      editorialTitle,
      featured,
      relevancy,
      solutions,
      frameworks,
      integrations,
      tools,
      slug,
      summary,
      action,
      solvedWith
    }
  `;

  const tickets = await pRetry(
    () =>
      client.fetch(query, {
        limit: 1000,
      }),
    {
      retries: 10,
    }
  );

  if (tickets.length === 0) {
    console.log('Done');
    return;
  }

  const tasks = tickets.map((ticket) => async () => {
    const editorialId = ticket._id.replace('drafts.', '');

    const editorialDoc = {
      _type: 'editorial',
      _id: `editorial.${editorialId}`,
      ticket: {
        _type: 'reference',
        _ref: ticket._id,
      },
      permalink: ticket.permalink,
      editorialTitle: ticket.editorialTitle,
      featured: ticket.featured,
      relevancy: ticket.relevancy,
      solutions: ticket.solutions,
      frameworks: ticket.frameworks,
      integrations: ticket.integrations,
      tools: ticket.tools,
      slug: ticket.slug,
      summary: ticket.summary,
      action: ticket.action,
      solvedWith: ticket.solvedWith,
    };

    // Unset all `ticket` fields moved to `editorial` document.
    const ticketFieldsToUnset = Object.keys(editorialDoc).filter(
      (key) => !['_id', '_type'].includes(key)
    );

    const unsetTicketFieldsPatch = client.patch(ticket._id).unset(ticketFieldsToUnset);

    const result = await client
      .transaction()
      .createOrReplace(editorialDoc)
      .patch(unsetTicketFieldsPatch)
      .commit();

    console.log(result);
  });

  await pRetry(() => queue.addAll(tasks), {
    retries: 10,
  });

  migrateEditorial();
};

migrateEditorial();
