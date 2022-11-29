import createClient from '@sanity/client';
import {forkJoin, Observable, of} from 'rxjs';
<<<<<<< HEAD
import {catchError, mapTo, mergeMap} from 'rxjs/operators';
import {Response} from './handleMessage';
import {getSlackChannelInfo} from './slack-api/getChannel';
import {getSlackMessage} from './slack-api/getMessage';
=======
import {mapTo, mergeMap} from 'rxjs/operators';
import {Response} from './handleMessage';
import {getSlackChannelInfo} from './slack-api/getChannel';
>>>>>>> 62f3a0d
import {getSlackThread} from './slack-api/getThread';
import {getSlackPermalink} from './slack-api/getPermalink';
import {getSlackUser} from './slack-api/getUser';
import {Secrets} from './types';
import {nanoid} from 'nanoid';

const TICKET_OPEN_REACTION = 'ticket';
const TICKET_RESOLVE_REACTION = 'white_check_mark';
<<<<<<< HEAD
const CONTRIBUTION_REACTION = 'unicorn_face';
=======
>>>>>>> 62f3a0d

enum STATUS {
  Open = 'open',
  Resolved = 'resolved',
}

<<<<<<< HEAD
export const handleReaction = (event: any, secrets: Secrets): Observable<Response> => {
  const sanityClient = createClient({
    projectId: secrets.SANITY_PROJECT_ID,
    dataset: secrets.SANITY_DATASET,
    useCdn: false,
    token: secrets.SANITY_WRITE_TOKEN,
    apiVersion: 'v1',
  });

  // open ticket
  if (event.type === 'reaction_added' && event.reaction === TICKET_OPEN_REACTION) {
    const slackThread$ = getSlackThread(
      secrets.SLACK_BOT_USER_TOKEN,
      event.item.channel,
      event.item.ts
    );
    const reactionAuthor$ = getSlackUser(secrets.SLACK_BOT_USER_TOKEN, event.user);
    const messageAuthor$ = getSlackUser(secrets.SLACK_BOT_USER_TOKEN, event.item_user);
    const channelInfo$ = getSlackChannelInfo(secrets.SLACK_BOT_USER_TOKEN, event.item.channel);
    const permalink$ = getSlackPermalink(
      secrets.SLACK_BOT_USER_TOKEN,
      event.item.channel,
      event.item.ts
    );
    const makeSanityThread = (thread: any) => {
      return thread.map((message: any) => ({
        _key: nanoid(),
        _type: 'message',
        content: message.text,
        author: message.user,
        timestamp: message.ts,
      }));
    };

    return forkJoin([slackThread$, reactionAuthor$, messageAuthor$, channelInfo$, permalink$]).pipe(
      mergeMap(([thread, reactionAuthor, messageAuthor, channelInfo, permalink]) => {
        if (
          reactionAuthor.profile.email.split('@').pop() !== secrets.EMAIL_DOMAIN ||
          reactionAuthor.profile.email !== secrets.SLACK_TOKEN_A ||
          reactionAuthor.profile.email !== secrets.SLACK_TOKEN_B
        ) {
          throw `${reactionAuthor.profile.display_name} is not a Sanity domain user [#${channelInfo.name}].`;
        }

        let ticketId = '';
        if (thread[0].client_msg_id) {
          ticketId = `slack-${thread[0].client_msg_id}`;
        } else {
          ticketId = `slack-${thread[0].ts.replace(/\./g, '-')}`;
        }

        console.log(`Opening ticket ${ticketId} in #${channelInfo.name}`);

        return sanityClient.createOrReplace({
          _id: ticketId,
          _type: 'ticket',
          thread: makeSanityThread(thread),
          openedBy: reactionAuthor.profile.display_name,
          authorName: messageAuthor.profile.display_name,
          channelName: channelInfo.name,
          status: STATUS.Open,
          permalink,
        });
      }),
      catchError((err) => {
        throw 'Ticket not opened: ' + err;
      }),
      mapTo({status: 200, body: 'OK'})
    );
  }

  // close ticket
  if (event.type === 'reaction_added' && event.reaction === TICKET_RESOLVE_REACTION) {
    const slackMessage$ = getSlackMessage(
      secrets.SLACK_BOT_USER_TOKEN,
      event.item.channel,
      event.item.ts
    );
    const reactionAuthor$ = getSlackUser(secrets.SLACK_BOT_USER_TOKEN, event.user);

    return forkJoin([slackMessage$, reactionAuthor$]).pipe(
      mergeMap(([message, reactionAuthor]) => {
        if (
          reactionAuthor.profile.email.split('@').pop() !== secrets.EMAIL_DOMAIN ||
          reactionAuthor.profile.email !== secrets.SLACK_TOKEN_A ||
          reactionAuthor.profile.email !== secrets.SLACK_TOKEN_B
        ) {
          throw `${reactionAuthor.profile.display_name} is not a domain user.`;
        }

        let ticketId = '';
        if (message.client_msg_id) {
          ticketId = `slack-${message.client_msg_id}`;
        } else {
          ticketId = `slack-${message.ts.replace(/\./g, '-')}`;
        }

        console.log(`Closing ticket ${ticketId}`);

        return sanityClient.patch(ticketId).set({status: STATUS.Resolved}).commit();
      }),
      catchError((err) => {
        throw 'Ticket not closed: ' + err;
      }),
      mapTo({status: 200, body: 'OK'})
    );
  }

  // record community contribution
  if (event.type === 'reaction_added' && event.reaction === CONTRIBUTION_REACTION) {
    const slackMessage$ = getSlackMessage(
      secrets.SLACK_BOT_USER_TOKEN,
      event.item.channel,
      event.item.ts
    );
    const reactionAuthor$ = getSlackUser(secrets.SLACK_BOT_USER_TOKEN, event.user);
    const channelInfo$ = getSlackChannelInfo(secrets.SLACK_BOT_USER_TOKEN, event.item.channel);

    return forkJoin([slackMessage$, reactionAuthor$, channelInfo$]).pipe(
      mergeMap(([message, reactionAuthor, channelInfo]) => {
        const slackThread$ = getSlackThread(
          secrets.SLACK_BOT_USER_TOKEN,
          event.item.channel,
          message.thread_ts ? message.thread_ts : message.ts
        );
        const messageAuthor$ = getSlackUser(secrets.SLACK_BOT_USER_TOKEN, message.user);
        const permalink$ = getSlackPermalink(
          secrets.SLACK_BOT_USER_TOKEN,
          event.item.channel,
          message.thread_ts ? message.thread_ts : message.ts
        );
        const makeSanityThread = (thread: any) => {
          return thread.map((message: any) => ({
            _key: nanoid(),
            _type: 'message',
            content: message.text,
            author: message.user,
            timestamp: message.ts,
          }));
        };

        return forkJoin([slackThread$, messageAuthor$, permalink$]).pipe(
          mergeMap(([thread, messageAuthor, permalink]) => {
            console.log(
              `Recording contribution slack-contrib-${message.client_msg_id} in #${channelInfo.name}`
            );

            return sanityClient.createOrReplace({
              _id: `slack-contrib-${message.client_msg_id}`,
              _type: 'contribution',
              contribution: [
                {
                  _key: nanoid(),
                  _type: 'message',
                  content: message.text,
                  author: messageAuthor.profile.display_name,
                  timestamp: message.ts,
                },
              ],
              thread: makeSanityThread(thread),
              addedBy: reactionAuthor.profile.display_name,
              authorName: messageAuthor.profile.display_name,
              authorSlackId: message.user,
              channelName: channelInfo.name,
              permalink,
            });
          }),
          catchError((err) => {
            throw 'Contribution not recorded: ' + err;
          }),
          mapTo({status: 200, body: 'OK'})
        );
      })
    );
  }

  // record all other reactions in Emoji Tracker
  if (
    event.type === 'reaction_added' &&
    event.reaction !== TICKET_OPEN_REACTION &&
    event.reaction !== TICKET_RESOLVE_REACTION &&
    event.reaction !== CONTRIBUTION_REACTION
  ) {
    const author$ = getSlackUser(secrets.SLACK_BOT_USER_TOKEN, event.user);
    const channelInfo$ = getSlackChannelInfo(secrets.SLACK_BOT_USER_TOKEN, event.item.channel);
    const permalink$ = getSlackPermalink(
      secrets.SLACK_BOT_USER_TOKEN,
      event.item.channel,
      event.item.ts
    );

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const emojiTrackerId = 'slack-emojis-' + dd + '-' + mm + '-' + yyyy;

    return forkJoin([author$, channelInfo$, permalink$]).pipe(
      mergeMap(([author, channelInfo, permalink]) => {
        const query = `*[_type == 'emojiTracker' && _id == $id][0]`;
        const params = {id: emojiTrackerId};

        type MultipleMutationResult = any;

        return sanityClient
          .fetch(query, params)
          .then((result: any): Promise<MultipleMutationResult> => {
            if (result) {
              console.log(`Adding to existing emoji record: ${emojiTrackerId}`);
              let emojiIndex = -1;
              let emojiCount: number;
              for (let i = 0; i < result.summary.length; i++) {
                if (result.summary[i].shortCode === event.reaction) {
                  emojiIndex = i;
                  emojiCount = result.summary[i].count;
                }
              }
              return sanityClient
                .transaction()
                .patch(emojiTrackerId, (patch) =>
                  patch.setIfMissing({entries: []}).insert('after', 'entries[-1]', [
                    {
                      _key: nanoid(),
                      _type: 'emojiEntry',
                      shortCode: event.reaction,
                      colonCode: `:${event.reaction}:`,
                      authorName: author.profile.display_name,
                      authorSlackId: event.user,
                      channelName: channelInfo.name,
                      timestamp: event.event_ts,
                      permalink,
                    },
                  ])
                )
                .patch(emojiTrackerId, (patch) =>
                  patch
                    .setIfMissing({summary: []})
                    .insert(emojiIndex >= 0 ? 'replace' : 'after', `summary[${emojiIndex}]`, [
                      {
                        _key: nanoid(),
                        _type: 'emojiSummary',
                        shortCode: event.reaction,
                        colonCode: `:${event.reaction}:`,
                        count: emojiCount ? emojiCount + 1 : 1,
                      },
                    ])
                )
                .commit();
            } else {
              console.log(`Creating new emoji record: ${emojiTrackerId}`);

              return sanityClient.create({
                _id: emojiTrackerId,
                _type: 'emojiTracker',
                date: today,
                summary: [
                  {
                    _key: nanoid(),
                    _type: 'emojiSummary',
                    shortCode: event.reaction,
                    colonCode: `:${event.reaction}:`,
                    count: 1,
                  },
                ],
                entries: [
                  {
                    _key: nanoid(),
                    _type: 'emojiEntry',
                    shortCode: event.reaction,
                    colonCode: `:${event.reaction}:`,
                    authorName: author.profile.display_name,
                    authorSlackId: event.user,
                    channelName: channelInfo.name,
                    timestamp: event.event_ts,
                    permalink,
                  },
                ],
              });
            }
          });
      }),
      catchError((err) => {
        throw 'Reaction not recorded: ' + err;
=======
export const handleReaction = (
  event: any,
  secrets: Secrets,
  token: string,
  ticketPrefix: string
): Observable<Response> => {
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

  // Open ticket
  if (
    event.type === 'message' ||
    (event.type === 'reaction_added' && event.reaction === TICKET_OPEN_REACTION)
  ) {
    const slackThread$ = getSlackThread(
      token,
      event.item?.channel || event.channel,
      event.item?.ts || event.thread_ts || event.ts
    );
    const reactionAuthor$ = getSlackUser(token, event.user);
    const messageAuthor$ = getSlackUser(token, event.item_user || event.user);
    const channelInfo$ = getSlackChannelInfo(token, event.item?.channel || event.channel);
    const permalink$ = getSlackPermalink(
      token,
      event.item?.channel || event.channel,
      event.item?.ts || event.thread_ts || event.ts
    );

    return forkJoin([slackThread$, reactionAuthor$, messageAuthor$, channelInfo$, permalink$]).pipe(
      mergeMap(([thread, reactionAuthor, messageAuthor, channelInfo, permalink]) => {
        if (event.reaction && !isSanityTeam(reactionAuthor.profile.email)) {
          console.log(
            `${reactionAuthor.profile.display_name} is not a Sanity agent [#${channelInfo.name}].`
          );
          return [null];
        }

        if (!thread) {
          console.log('No thread found');
          return [null];
        }

        const ticketId = `${ticketPrefix}-${channelInfo.id}-${thread[0].ts.replace(/\./g, '-')}`;
        const createdAt = new Date(
          (event.item?.ts || event.thread_ts || event.ts) * 1000
        ).toISOString();
        const updatedAt = new Date(thread[thread.length - 1].ts * 1000).toISOString();
        const allThreadUsers = thread.map((message: any) => getSlackUser(token, message.user));

        const makeSanityThread = (thread: any) => {
          return thread.map((message: any) => {
            const userEmail = message.detailedUser?.profile?.email;
            const isSanity = isSanityTeam(userEmail);

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
            };
          });
        };

        return forkJoin(...allThreadUsers).pipe(
          mergeMap((threadUsers) => {
            thread.forEach((eachMessage: any, index: number) => {
              eachMessage.detailedUser = threadUsers[index];
            });

            const sanityThread = makeSanityThread(thread);

            console.log(`Opening ticket ${ticketId} in #${channelInfo.name}`);

            return sanityClient
              .createIfNotExists({
                _id: ticketId,
                _type: 'ticket',
                thread: sanityThread,
                author: sanityThread[0].author,
                threadCreated: createdAt,
                threadUpdated: updatedAt,
                channelName: channelInfo.name,
                status: STATUS.Open,
                permalink,
              })
              .catch(console.error);
          })
        );
      }),
      mapTo({status: 200, body: 'OK'})
    );
  }

  // Close ticket
  if (event.type === 'reaction_added' && event.reaction === TICKET_RESOLVE_REACTION) {
    const slackThread$ = getSlackThread(token, event.item.channel, event.item.ts);
    const reactionAuthor$ = getSlackUser(token, event.user);

    return forkJoin([slackThread$, reactionAuthor$]).pipe(
      mergeMap(([thread, reactionAuthor]) => {
        if (!isSanityTeam(reactionAuthor.profile.email)) {
          console.log(`${reactionAuthor.profile.display_name} is not a Sanity agent.`);
          return [null];
        }

        const legacyTicketId = thread[0].client_msg_id
          ? `${ticketPrefix}-${thread[0].client_msg_id}`
          : `${ticketPrefix}-${thread[0].ts.replace(/\./g, '-')}`;

        const ticketId = `${ticketPrefix}-${event.item.channel}-${thread[0].ts.replace(
          /\./g,
          '-'
        )}`;

        const closedAt = new Date(thread[thread.length - 1].ts * 1000).toISOString();

        const query = `*[_type == 'ticket' && _id in $ids][0] {
          _id
        }`;
        const params = {ids: [legacyTicketId, ticketId]};

        return sanityClient
          .fetch(query, params)
          .then((result: any) => {
            if (result) {
              console.log(`Closing ticket ${result._id}`);

              return sanityClient
                .patch(result._id)
                .setIfMissing({threadFirstClosed: closedAt})
                .set({
                  status: STATUS.Resolved,
                  threadClosed: closedAt,
                  threadUpdated: closedAt,
                })
                .commit()
                .catch(console.error);
            } else {
              console.log('No existing ticket found to close');
              return null;
            }
          })
          .catch(console.error);
>>>>>>> 62f3a0d
      }),
      mapTo({status: 200, body: 'OK'})
    );
  }

  return of({status: 200, body: `Not handling :${event.reaction}:`});
};
