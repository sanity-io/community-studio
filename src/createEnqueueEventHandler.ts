import { PubSub } from '@google-cloud/pubsub'
import { VercelRequest, VercelResponse } from '@vercel/node'
import { ExternalDataSourceName, externalDataSourceNames } from '../src/types'
import isSlackDataSource from '../src/utils/is-slack-data-source'

const pubSub = new PubSub({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    private_key: process.env.GCP_PRIVATE_KEY,
    client_email: process.env.GCP_SERVICE_ACCOUNT_EMAIL_ADDRESS,
  },
})

export default function createEnqueueEventHandler(overrideSourceName?: ExternalDataSourceName) {
  return async function handler(request: VercelRequest, response: VercelResponse) {
    const [sourceName] = overrideSourceName
      ? [overrideSourceName]
      : ([] as ExternalDataSourceName[]).concat(request.query.sourceName as ExternalDataSourceName)

    if (request.method !== 'POST') {
      response.status(405).json({
        success: false,
        message: 'Method not allowed',
      })

      return
    }

    if (!externalDataSourceNames.includes(sourceName)) {
      response.status(422).json({
        success: false,
      })

      return
    }

    // Handle Slack's verification challenge.
    if (isSlackDataSource(sourceName) && request.body.challenge) {
      response.json({
        body: request.body.challenge,
      })

      return
    }

    const topic = pubSub.topic(sourceName)

    try {
      const messageId = await topic.publishMessage({
        json: request.body,
      })

      response.json({
        success: true,
        messageId,
      })
    } catch (error) {
      response.status(500).json({
        success: false,
      })
    }
  }
}
