import createClient from '@sanity/client';
import {forkJoin, Observable, of} from 'rxjs';
import {catchError, mapTo, mergeMap} from 'rxjs/operators';
import {Response} from './handleMessage';
import {getSlackChannelInfo} from './slack-api/getChannel';
import {getSlackMessage} from './slack-api/getMessage';
import {getSlackThread} from './slack-api/getThread';
import {getSlackPermalink} from './slack-api/getPermalink';
import {getSlackUser} from './slack-api/getUser';
import {Secrets} from './types';
import {nanoid} from 'nanoid';

const TICKET_OPEN_REACTION = 'ticket';
const TICKET_RESOLVE_REACTION = 'white_check_mark';

enum STATUS {
  Open = 'open',
  Resolved = 'resolved',
}

export const handleReaction = (event: any, secrets: Secrets): Observable<Response> => {
  const sanityClient = createClient({
    projectId: secrets.SANITY_PROJECT_ID,
    dataset: secrets.SANITY_DATASET,
    useCdn: false,
    token: secrets.SANITY_WRITE_TOKEN,
  });

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
      return thread.map((message) => ({
        _key: nanoid(),
        _type: 'message',
        content: message.text,
        author: message.user,
        timestamp: message.ts,
      }));
    };

    return forkJoin([slackThread$, reactionAuthor$, messageAuthor$, channelInfo$, permalink$]).pipe(
      mergeMap(([thread, reactionAuthor, messageAuthor, channelInfo, permalink]) => {
        if (reactionAuthor.profile.email.split('@').pop() !== secrets.EMAIL_DOMAIN) {
          throw `${reactionAuthor.profile.display_name} is not a Sanity domain user [#${channelInfo.name}].`;
        }

        console.log(`Opening ticket slack-${thread[0].client_msg_id} in #${channelInfo.name}`);

        return sanityClient.createOrReplace({
          _id: `slack-${thread[0].client_msg_id}`,
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

  if (event.type === 'reaction_added' && event.reaction === TICKET_RESOLVE_REACTION) {
    const slackMessage$ = getSlackMessage(
      secrets.SLACK_BOT_USER_TOKEN,
      event.item.channel,
      event.item.ts
    );
    const reactionAuthor$ = getSlackUser(secrets.SLACK_BOT_USER_TOKEN, event.user);

    return forkJoin([slackMessage$, reactionAuthor$]).pipe(
      mergeMap(([message, reactionAuthor]) => {
        if (reactionAuthor.profile.email.split('@').pop() !== secrets.EMAIL_DOMAIN) {
          throw `${reactionAuthor.profile.display_name} is not a Sanity domain user.`;
        }

        console.log(`Closing ticket slack-${message.client_msg_id}`);

        return sanityClient
          .patch(`slack-${message.client_msg_id}`)
          .set({status: STATUS.Resolved})
          .commit();
      }),
      catchError((err) => {
        throw 'Ticket not closed: ' + err;
      }),
      mapTo({status: 200, body: 'OK'})
    );
  }
  return of({status: 404, body: `Not handling :${event.reaction}:`});
};
