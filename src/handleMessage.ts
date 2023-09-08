import createClient from '@sanity/client';
import {nanoid} from 'nanoid';
import {forkJoin, Observable, of} from 'rxjs';
import {mapTo, mergeMap} from 'rxjs/operators';
import {handleReaction} from '@/handleReaction';
import {getSlackMessage} from '@/slack-api/getMessage';
import {getSlackReactions} from '@/slack-api/getReactions';
import {getSlackUser} from '@/slack-api/getUser';
import {Secrets} from '@/types';

const TICKET_OPEN_REACTION = 'ticket';

export interface Response {
  status: number;
  headers?: {};
  body: string;
}

export function handleMessage(secrets: Secrets) {
  return (message: any): Observable<Response> => {
    const token = secrets.SLACK_BOT_USER_TOKEN;
    const ticketPrefix = 'ticket.community.slack';

    const sanityClient = createClient({
      projectId: secrets.SANITY_PROJECT_ID,
      dataset: secrets.SANITY_DATASET,
      token: secrets.SANITY_WRITE_TOKEN,
      apiVersion: '2021-03-25',
      useCdn: false,
    });

    const isSanityTeam = (email: string) => {
      if (email?.split('@').pop() === secrets.EMAIL_DOMAIN) {
        return true;
      }
      return false;
    };

    const hasTicket = (arr: any) => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].name === TICKET_OPEN_REACTION) {
          return true;
        }
      }
      return false;
    };

    if (message.type === 'event_callback') {
      if (
        message.event.type === 'reaction_added' ||
        message.event.type === 'reaction_removed' ||
        (message.event.type === 'message' &&
          message.event.subtype !== 'message_changed' &&
          message.event.subtype !== 'channel_join' &&
          message.event.message?.subtype !== 'bot_message' &&
          !message.event.thread_ts)
      ) {
        return handleReaction(message.event, secrets, token, ticketPrefix);
      }

      if (
        message.event.type === 'message' &&
        message.event.subtype !== 'message_changed' &&
        message.event.message?.subtype !== 'bot_message' &&
        message.event.thread_ts
      ) {
        const slackReactions$ = getSlackReactions(
          token,
          message.event.channel,
          message.event.thread_ts
        );

        return slackReactions$.pipe(
          mergeMap((reactions) => {
            const slackMessage$ = getSlackMessage(token, message.event.channel, message.event.ts);
            const messageAuthor$ = getSlackUser(token, message.event.user);

            const legacyTicketId =
              reactions?.reactions &&
              `${ticketPrefix}-${
                reactions.client_msg_id ? reactions.client_msg_id : reactions.ts.replace(/\./g, '-')
              }`;

            const ticketId = `${ticketPrefix}-${message.event.channel}-${(message.event.thread_ts
              ? message.event.thread_ts
              : message.event.ts
            ).replace(/\./g, '-')}`;

            const updatedAt = new Date(message.event.ts * 1000).toISOString();

            return forkJoin([slackMessage$, messageAuthor$]).pipe(
              mergeMap(([slackMessage, author]) => {
                const userEmail = author.profile.email;
                const isSanity = isSanityTeam(userEmail);

                if (!slackMessage) {
                  console.log('No message found');
                  return [null];
                }

                const query = `*[_type == 'ticket' && _id in $ids][0] {
                    _id,
                    'lastThreadTs': thread[-1].timestamp
                  }`;
                const params = {ids: [legacyTicketId, ticketId]};

                return sanityClient
                  .fetch(query, params)
                  .then((result: any) => {
                    if (result && result.lastThreadTs !== slackMessage.ts) {
                      const threadPatch = sanityClient
                        .patch(result._id)
                        .set({threadUpdated: updatedAt})
                        .setIfMissing({thread: []})
                        .insert('after', 'thread[-1]', [
                          {
                            _key: nanoid(),
                            _type: 'message',
                            content: slackMessage.text,
                            author: {
                              _type: 'slackAuthor',
                              slackId: slackMessage.user,
                              slackName: author.profile.display_name,
                              isSanity,
                            },
                            timestamp: slackMessage.ts,
                          },
                        ]);

                      console.log(`Adding message to existing ticket ${result._id}`);

                      return sanityClient
                        .transaction()
                        .patch(threadPatch)
                        .commit()
                        .catch(console.error);
                    } else {
                      console.log('Recording unticketed thread');

                      return handleReaction(message.event, secrets, token, ticketPrefix);
                    }
                  })
                  .catch(console.error);
              })
            );
          }),
          mapTo({status: 200, body: 'OK'})
        );
      }

      if (
        message.event.subtype === 'message_changed' &&
        message.event.message?.subtype !== 'bot_message'
      ) {
        const slackReactions$ = getSlackReactions(
          token,
          message.event.channel,
          message.event.message.thread_ts
        );

        return slackReactions$.pipe(
          mergeMap((reactions) => {
            const legacyTicketId =
              reactions?.reactions &&
              `${ticketPrefix}-${
                reactions.client_msg_id ? reactions.client_msg_id : reactions.ts.replace(/\./g, '-')
              }`;

            const ticketId = `${ticketPrefix}-${message.event.channel}-${(message.event.message
              .thread_ts
              ? message.event.message.thread_ts
              : message.event.message.ts
            ).replace(/\./g, '-')}`;

            const slackMessage$ = getSlackMessage(
              token,
              message.event.channel,
              message.event.message.ts
            );
            const messageAuthor$ = getSlackUser(token, message.event.message.user);

            return forkJoin([slackMessage$, messageAuthor$]).pipe(
              mergeMap(([slackMessage, author]) => {
                if (!slackMessage) {
                  console.log('No message found');
                  return [null];
                }

                const userEmail = author.profile.email;
                const isSanity = isSanityTeam(userEmail);

                const query = `*[_type == 'ticket' && _id in $ids][0] {
                    _id,
                    thread
                  }`;
                const params = {ids: [legacyTicketId, ticketId]};

                return sanityClient
                  .fetch(query, params)
                  .then((result: any) => {
                    if (result) {
                      for (let i = 0; i < result.thread.length; i++) {
                        if (result.thread[i].timestamp === slackMessage.ts) {
                          console.log(`Modifying message in existing ticket ${result._id}`);

                          return sanityClient
                            .patch(result._id)
                            .setIfMissing({thread: []})
                            .insert('replace', `thread[${i}]`, [
                              {
                                _key: nanoid(),
                                _type: 'message',
                                content: slackMessage.text,
                                author: {
                                  _type: 'slackAuthor',
                                  slackId: slackMessage.user,
                                  slackName: author.profile.display_name,
                                  isSanity,
                                },
                                timestamp: slackMessage.ts,
                              },
                            ])
                            .commit()
                            .catch(console.error);
                        }
                      }
                    } else {
                      console.log('No existing ticket found');
                      return null;
                    }
                  })
                  .catch(console.error);
              })
            );
          }),
          mapTo({status: 200, body: 'OK'})
        );
      }
    }
    return of({status: 200, body: 'OK'});
  };
}
