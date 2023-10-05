import createClient from '@sanity/client'
import { nanoid } from 'nanoid'
import { forkJoin, Observable, of } from 'rxjs'
import { mapTo, mergeMap } from 'rxjs/operators'
import { Response } from '../src/handleMessage'
import { getSlackChannelInfo } from '../src/slack-api/getChannel'
import { getSlackPermalink } from '../src/slack-api/getPermalink'
import { getSlackThread } from '../src/slack-api/getThread'
import { getSlackUser } from '../src/slack-api/getUser'
import { Secrets } from '../src/types'

const TICKET_OPEN_REACTION = 'ticket'
const TICKET_RESOLVE_REACTION = 'white_check_mark'

enum STATUS {
  Open = 'open',
  Resolved = 'resolved',
}

export const handleReaction = (
  event: any,
  secrets: Secrets,
  token: string,
  ticketPrefix: string,
): Observable<Response> => {
  const sanityClient = createClient({
    projectId: secrets.SANITY_PROJECT_ID,
    dataset: secrets.SANITY_DATASET,
    token: secrets.SANITY_WRITE_TOKEN,
    apiVersion: '2021-03-25',
    useCdn: false,
  })

  const isSanityTeam = (email: string) => {
    if (email?.split('@').pop() === secrets.EMAIL_DOMAIN) {
      return true
    }
    return false
  }

  // Open ticket
  if (
    event.type === 'message' ||
    (event.type === 'reaction_added' && event.reaction === TICKET_OPEN_REACTION)
  ) {
    const slackThread$ = getSlackThread(
      token,
      event.item?.channel || event.channel,
      event.item?.ts || event.thread_ts || event.ts,
    )
    const reactionAuthor$ = getSlackUser(token, event.user)
    const messageAuthor$ = getSlackUser(token, event.item_user || event.user)
    const channelInfo$ = getSlackChannelInfo(token, event.item?.channel || event.channel)
    const permalink$ = getSlackPermalink(
      token,
      event.item?.channel || event.channel,
      event.item?.ts || event.thread_ts || event.ts,
    )

    return forkJoin([slackThread$, reactionAuthor$, messageAuthor$, channelInfo$, permalink$]).pipe(
      mergeMap(([thread, reactionAuthor, messageAuthor, channelInfo, permalink]) => {
        if (event.reaction && !isSanityTeam(reactionAuthor.profile.email)) {
          console.log(
            `${reactionAuthor.profile.display_name} is not a Sanity agent [#${channelInfo.name}].`,
          )
          return [null]
        }

        if (!thread) {
          console.log('No thread found')
          return [null]
        }

        const ticketId = `${ticketPrefix}-${channelInfo.id}-${thread[0].ts.replace(/\./g, '-')}`
        const createdAt = new Date(
          (event.item?.ts || event.thread_ts || event.ts) * 1000,
        ).toISOString()
        const updatedAt = new Date(thread[thread.length - 1].ts * 1000).toISOString()
        const allThreadUsers = thread.map((message: any) => getSlackUser(token, message.user))

        const makeSanityThread = (thread: any) => {
          return thread.map((message: any) => {
            const userEmail = message.detailedUser?.profile?.email
            const isSanity = isSanityTeam(userEmail)

            return {
              _key: nanoid(),
              _type: 'message',
              content: message.text,
              author: {
                _type: 'slackAuthor',
                slackId: message.user,
                slackName: message.detailedUser?.profile?.display_name,
                isSanity,
              },
              timestamp: message.ts,
            }
          })
        }

        return forkJoin(...allThreadUsers).pipe(
          mergeMap((threadUsers) => {
            thread.forEach((eachMessage: any, index: number) => {
              eachMessage.detailedUser = threadUsers[index]
            })

            const sanityThread = makeSanityThread(thread)

            console.log(`Opening ticket ${ticketId} in #${channelInfo.name}`)

            return sanityClient
              .transaction()
              .createIfNotExists({
                _id: ticketId,
                _type: 'ticket',
                thread: sanityThread,
                author: sanityThread[0].author,
                threadCreated: createdAt,
                threadUpdated: updatedAt,
                channelName: channelInfo.name,
                status: STATUS.Open,
              })
              .createIfNotExists({
                _id: `editorial.${ticketId}`,
                _type: 'editorial',
                permalink,
                ticket: {
                  _ref: ticketId,
                  _type: 'reference',
                  _weak: true,
                },
              })
              .commit()
              .then((res: any) => {
                console.log(`Ticket and editorial docs created for ${ticketId}`)
              })
              .catch((err: any) => {
                console.error(`Failed to create ticket and editorial docs: ${err.message}`)
              })
          }),
        )
      }),
      mapTo({ status: 200, body: 'OK' }),
    )
  }

  // Close ticket
  if (event.type === 'reaction_added' && event.reaction === TICKET_RESOLVE_REACTION) {
    const slackThread$ = getSlackThread(token, event.item.channel, event.item.ts)
    const reactionAuthor$ = getSlackUser(token, event.user)

    return forkJoin([slackThread$, reactionAuthor$]).pipe(
      mergeMap(([thread, reactionAuthor]) => {
        if (!isSanityTeam(reactionAuthor.profile.email)) {
          console.log(`${reactionAuthor.profile.display_name} is not a Sanity agent.`)
          return [null]
        }

        const legacyTicketId = thread[0].client_msg_id
          ? `${ticketPrefix}-${thread[0].client_msg_id}`
          : `${ticketPrefix}-${thread[0].ts.replace(/\./g, '-')}`

        const ticketId = `${ticketPrefix}-${event.item.channel}-${thread[0].ts.replace(/\./g, '-')}`

        const closedAt = new Date(thread[thread.length - 1].ts * 1000).toISOString()

        const query = `*[_type == 'ticket' && _id in $ids][0] {
          _id
        }`
        const params = { ids: [legacyTicketId, ticketId] }

        return sanityClient
          .fetch(query, params)
          .then((result: any) => {
            if (result) {
              console.log(`Closing ticket ${result._id}`)

              return sanityClient
                .patch(result._id)
                .setIfMissing({ threadFirstClosed: closedAt })
                .set({
                  status: STATUS.Resolved,
                  threadClosed: closedAt,
                  threadUpdated: closedAt,
                })
                .commit()
                .catch(console.error)
            } else {
              console.log('No existing ticket found to close')
              return null
            }
          })
          .catch(console.error)
      }),
      mapTo({ status: 200, body: 'OK' }),
    )
  }

  return of({ status: 200, body: `Not handling :${event.reaction}:` })
}
