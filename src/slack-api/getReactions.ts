import { map } from 'rxjs/operators'
import { callApi } from '../../src/slack-api/callApi'

export function getSlackReactions(token: string, channel: string, timestamp: string) {
  return callApi('reactions.get', token, {
    channel,
    timestamp,
  }).pipe(
    map((response: any) => {
      return response.data.message
    }),
  )
}
