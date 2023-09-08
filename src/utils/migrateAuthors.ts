import { getCliClient } from '@sanity/cli'
import cq from 'concurrent-queue'

const client = getCliClient().withConfig({ apiVersion: '2021-03-25' })
// Create a queue to limit the rate at which you write changes to Sanity
const queue = cq()
  .limit({ concurrency: 10 })
  .process(function (task: any) {
    return new Promise(function (resolve, reject) {
      setTimeout(resolve.bind(undefined, task), 1000)
    })
  })

//We write our query for the document(s) we want to delete
const query = `*[_type == 'ticket' && defined(authorName)]`

const migrateTags = async () => {
  // Use the configured Studio client to fetch our documents
  const tickets = await client.fetch(query)

  for (const ticket of tickets) {
    queue(ticket).then(async () => {
      const author = {
        slackName: ticket.authorName,
        slackId: ticket.thread[0].author,
      }

      await client
        .patch(ticket._id)
        .unset(['authorName'])
        .set({ author })
        .commit()
        .then((doc) => console.log(doc._id))
        .catch((err) => console.log(err.msg))
    })
  }
}

migrateTags()

// execute this script by running
// $ sanity exec ./lib/utils/batchDelete.js --withUserToken
