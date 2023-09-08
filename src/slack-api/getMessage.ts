import { map } from 'rxjs/operators'
import { callApi } from '../../src/slack-api/callApi'

export function getSlackMessage(token: string, channel: string, timestamp: string) {
  return callApi('conversations.replies', token, {
    channel,
    ts: timestamp,
    limit: 1,
    inclusive: true,
  }).pipe(
    map((response: any) => {
      return response.data.messages[0]
    }),
  )
}
