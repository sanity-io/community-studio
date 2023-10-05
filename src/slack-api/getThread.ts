import { map } from 'rxjs/operators'
import { callApi } from '../../src/slack-api/callApi'

export function getSlackThread(token: string, channel: string, timestamp: string) {
  return callApi('conversations.replies', token, {
    channel,
    ts: timestamp,
  }).pipe(
    map((response: any) => {
      console.log(response.data)
      return response.data.messages
    }),
  )
}
