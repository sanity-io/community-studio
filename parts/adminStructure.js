import React from 'react';
import S from '@sanity/desk-tool/structure-builder';
import documentStore from 'part:@sanity/base/datastore/document';
import {map} from 'rxjs/operators';
import {getCurrentUser} from '../schemas/components/functions';

import Icon from '../schemas/components/icon';
import AlertsIcon from '../schemas/components/icon/alertsIcon';
import OpenTicketsIcon from '../schemas/components/icon/openTicketsIcon';
import RecentTicketsIcon from '../schemas/components/icon/recentTicketsIcon';
import ThreadPreview from '../schemas/components/threadPreview';
import curationStructure from './curationStructure';
import feedbackStructure from './feedbackStructure';
<<<<<<< HEAD
=======
import getSupportStructure from './supportStructure';
>>>>>>> 62f3a0d

const LiveIcon = ({off}) => (
  <svg
    width="18px"
    viewBox="0 0 96 72"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      backgroundColor: off ? '#dddddd' : '#2276fc',
      borderRadius: '14px',
      marginRight: '10px',
      padding: '5px',
      height: '18px',
    }}
  >
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g fill={off ? '#999999' : '#FFFFFF'} fillRule="nonzero">
        <path
          d="M81.6,2.4 C79.5,0.3 76,0.3 73.8,2.4 C71.7,4.5 71.7,8 73.8,10.2 C80.7,17.1 84.5,26.3 84.5,36 C84.5,45.7 80.7,54.9 73.8,61.8 C71.7,63.9 71.7,67.4 73.8,69.6 C74.9,70.7 76.3,71.2 77.7,71.2 C79.1,71.2 80.5,70.7 81.6,69.6 C90.6,60.6 95.5,48.7 95.5,36.1 C95.5,23.3 90.6,11.4 81.6,2.4 Z"
          id="Path"
        ></path>
        <path
          d="M11.5,36 C11.5,26.2 15.3,17.1 22.2,10.2 C24.3,8.1 24.3,4.6 22.2,2.4 C20.1,0.3 16.6,0.3 14.4,2.4 C5.4,11.4 0.5,23.3 0.5,36 C0.5,48.6 5.6,60.8 14.5,69.6 C15.6,70.7 17,71.2 18.4,71.2 C19.8,71.2 21.2,70.7 22.3,69.6 C24.4,67.4 24.4,64 22.2,61.8 C15.4,55.1 11.5,45.7 11.5,36 Z"
          id="Path"
        ></path>
        <path
          d="M67.8,16.3 C65.7,14.1 62.2,14.1 60,16.2 C57.8,18.3 57.8,21.8 59.9,24 C63.1,27.2 64.9,31.5 64.9,36 C64.9,40.5 63.1,44.8 59.9,48 C57.8,50.2 57.8,53.6 60,55.8 C61.1,56.9 62.5,57.4 63.9,57.4 C65.3,57.4 66.7,56.9 67.8,55.8 C73.1,50.5 76,43.5 76,36 C76,28.6 73.1,21.6 67.8,16.3 Z"
          id="Path"
        ></path>
        <path
          d="M36,16.2 C33.9,14.1 30.4,14.1 28.2,16.2 C22.9,21.5 20,28.6 20,36 C20,43.5 22.9,50.5 28.2,55.8 C29.3,56.9 30.7,57.4 32.1,57.4 C33.5,57.4 34.9,56.9 36,55.8 C38.1,53.7 38.1,50.2 36,48 C32.8,44.8 31,40.5 31,36 C31,31.5 32.8,27.2 36,24 C38.2,21.9 38.2,18.4 36,16.2 Z"
          id="Path"
        ></path>
        <circle id="Oval" cx="48" cy="36" r="8.4"></circle>
      </g>
    </g>
  </svg>
);

const TAXONOMIES = [
  'taxonomy.framework',
<<<<<<< HEAD
=======
  'taxonomy.usecase',
  'taxonomy.cssframework',
>>>>>>> 62f3a0d
  'taxonomy.integration',
  'taxonomy.language',
  'taxonomy.solution',
  'taxonomy.category',
  'taxonomy.combination',
  'taxonomy.contributionType',
];

export const CONTRIBUTION_TYPES = [
  'contribution.guide',
  'contribution.tool',
  'contribution.starter',
  'contribution.showcaseProject',
  'contribution.schema',
];

const ticketDocumentNode = (docId) =>
  S.document()
    .documentId(docId)
    .views([S.view.form(), S.view.component(ThreadPreview).title('Thread')]);

const today = new Date();
const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
const dayAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);
const weekTimestamp = ((weekAgo.getTime() / 1000) | 0).toString();
const dayTimestamp = ((dayAgo.getTime() / 1000) | 0).toString();

/**
 * This is a function instead of a plain array to make sure we get the freshest window._sanityUser
 */
const getAdminStructure = () => [
<<<<<<< HEAD
  // S.listItem()
  //   .title('Alerts')
  //   .icon(() => <AlertsIcon />)
  //   .child(() =>
  //     getCurrentUser().then((user) => {
  //       const slackId = user?.slackId ? user.slackId : '';
  //       return (
  //         S.documentList('ticket')
  //           .id('ticketAlerts')
  //           // this creates a proptype error, but I guess it's fine?
  //           .title(
  //             <span>
  //               Ticket alerts
  //               <br />
  //               <span style={{fontWeight: '400'}}>
  //                 🥖 stale, 🔥 popular, 🗣️ @-mentioned, 🕰️ revived
  //               </span>
  //             </span>
  //           )
  //           .filter(
  //             '_type == $type && thread[-1].timestamp > $weekTimestamp && ((status == "open" && (thread[].content match $slackId || (!defined(thread[1]) && thread[0].timestamp < $dayTimestamp))) || (status == "resolved" && thread[-2].timestamp < $weekTimestamp))'
  //           )
  //           .params({type: 'ticket', weekTimestamp, dayTimestamp, slackId})
  //           .menuItems(S.documentTypeList('ticket').getMenuItems())
  //           .child(ticketDocumentNode)
  //       );
  //     })
  //   ),
  // S.listItem()
  //   .title('My open tickets')
  //   .schemaType('ticket')
  //   .icon(() => <OpenTicketsIcon />)
  //   .child(
  //     S.documentList('ticket')
  //       .title('My open tickets')
  //       .filter('_type == $type && status == "open" && assigned->sanityId == $userId')
  //       .params({type: 'ticket', userId: window._sanityUser?.id})
  //       .menuItems(S.documentTypeList('ticket').getMenuItems())
  //       .child(ticketDocumentNode)
  //   ),
  // S.listItem()
  //   .title('Last 7 days')
  //   .icon(() => <RecentTicketsIcon />)
  //   .child(
  //     S.documentList('ticket')
  //       .title('Last 7 days')
  //       .filter('_type == $type && thread[0].timestamp > $weekTimestamp')
  //       .params({type: 'ticket', weekTimestamp})
  //       .menuItems(S.documentTypeList('ticket').getMenuItems())
  //       .child(ticketDocumentNode)
  //   ),
  // S.listItem()
  //   .title('All tickets')
  //   .icon(() => <Icon emoji="🎫" />)
  //   .child(
  //     S.list()
  //       .title('Tickets by filter')
  //       .items([
  //         S.listItem()
  //           .title('All tickets')
  //           .icon(() => <Icon emoji="🎫" />)
  //           .child(
  //             S.documentList('ticket')
  //               .title('All tickets')
  //               .filter('_type == $type')
  //               .params({type: 'ticket'})
  //               .child(ticketDocumentNode)
  //           ),
  //         S.listItem()
  //           .title('Open tickets')
  //           .icon(() => <Icon emoji="🎫" />)
  //           .child(
  //             S.documentList('ticket')
  //               .title('Open tickets')
  //               .filter('_type == $type && status == "open"')
  //               .params({type: 'ticket'})
  //               .child(ticketDocumentNode)
  //           ),
  //         S.listItem()
  //           .title('Resolved tickets')
  //           .schemaType('ticket')
  //           .icon(() => <Icon emoji="✅" />)
  //           .child(
  //             S.documentList('ticket')
  //               .title('Resolved tickets')
  //               .filter('_type == $type && status == "resolved"')
  //               .params({type: 'ticket'})
  //               .child(ticketDocumentNode)
  //           ),
  //         S.divider(),
  //         S.listItem()
  //           .title('Tickets by agent')
  //           .schemaType('person')
  //           .child(
  //             S.documentList('person')
  //               .title('Tickets by agent')
  //               .filter('_type == $type')
  //               .params({type: 'person'})
  //               .menuItems(S.documentTypeList('person').getMenuItems())
  //               .child((agentID) =>
  //                 S.documentList('ticket')
  //                   .title('Tickets')
  //                   .filter('_type == $type && references($agentID)')
  //                   .params({type: 'ticket', agentID})
  //                   .menuItems(S.documentTypeList('ticket').getMenuItems())
  //                   .child(ticketDocumentNode)
  //               )
  //           ),
  //         S.listItem()
  //           .title('Tickets by tag')
  //           .icon(() => <Icon emoji="🏷️" />)
  //           .child(() =>
  //             documentStore.listenQuery('*[_type == "ticket"]').pipe(
  //               map((docs) => {
  //                 const tags = docs.reduce(
  //                   (acc, curr = {tags: []}) =>
  //                     curr.tags
  //                       ? Array.from(new Set([...acc, ...curr.tags.map(({value}) => value)])).sort()
  //                       : acc,
  //                   []
  //                 );

  //                 return S.list()
  //                   .title('Tickets by tag')
  //                   .items(
  //                     tags.map((tag) =>
  //                       S.listItem()
  //                         .title(tag)
  //                         .icon(() => <Icon emoji="🏷️" />)
  //                         .child(() =>
  //                           documentStore
  //                             .listenQuery('*[_type == "ticket" && $tag in tags[].value]', {tag})
  //                             .pipe(
  //                               map((documents) =>
  //                                 S.documentTypeList('ticket')
  //                                   .title(`Tickets for “${tag}” (${documents.length})`)
  //                                   .menuItems(S.documentTypeList('ticket').getMenuItems())
  //                                   .filter(`_id in $ids`)
  //                                   .params({
  //                                     ids: documents.map(({_id}) => _id),
  //                                   })
  //                                   .child(ticketDocumentNode)
  //                               )
  //                             )
  //                         )
  //                     )
  //                   );
  //               })
  //             )
  //           ),
  //         S.listItem()
  //           .title('Indexed tickets')
  //           .icon(() => <LiveIcon />)
  //           .child(() =>
  //             documentStore
  //               .listenQuery('*[_type == "ticket" && defined(slug.current) && defined(relevancy)]')
  //               .pipe(
  //                 map((docs) => {
  //                   const tags = docs.reduce(
  //                     (acc, curr = {tags: []}) =>
  //                       curr.tags
  //                         ? Array.from(
  //                             new Set([...acc, ...curr.tags.map(({value}) => value)])
  //                           ).sort()
  //                         : acc,
  //                     []
  //                   );

  //                   return S.list()
  //                     .title('Tickets by tag')
  //                     .items(
  //                       tags.map((tag) =>
  //                         S.listItem()
  //                           .title(tag)
  //                           .icon(() => <Icon emoji="🏷️" />)
  //                           .child(() =>
  //                             documentStore
  //                               .listenQuery(
  //                                 '*[_type == "ticket" && defined(slug.current) && defined(relevancy) && $tag in tags[].value]',
  //                                 {tag}
  //                               )
  //                               .pipe(
  //                                 map((documents) =>
  //                                   S.documentTypeList('ticket')
  //                                     .title(`Tickets for “${tag}” (${documents.length})`)
  //                                     .menuItems(S.documentTypeList('ticket').getMenuItems())
  //                                     .filter(`_id in $ids`)
  //                                     .params({
  //                                       ids: documents.map(({_id}) => _id),
  //                                     })
  //                                     .child(ticketDocumentNode)
  //                                 )
  //                               )
  //                           )
  //                       )
  //                     );
  //                 })
  //               )
  //           ),
  //         S.listItem()
  //           .title('Unindexed tickets')
  //           .icon(() => <LiveIcon off />)
  //           .child(() =>
  //             documentStore
  //               .listenQuery(
  //                 '*[_type == "ticket" && (!defined(slug.current) || !defined(relevancy))]'
  //               )
  //               .pipe(
  //                 map((docs) => {
  //                   const tags = docs.reduce(
  //                     (acc, curr = {tags: []}) =>
  //                       curr.tags
  //                         ? Array.from(
  //                             new Set([...acc, ...curr.tags.map(({value}) => value)])
  //                           ).sort()
  //                         : acc,
  //                     []
  //                   );

  //                   return S.list()
  //                     .title('Tickets by tag')
  //                     .items(
  //                       tags.map((tag) =>
  //                         S.listItem()
  //                           .title(tag)
  //                           .icon(() => <Icon emoji="🏷️" />)
  //                           .child(() =>
  //                             documentStore
  //                               .listenQuery(
  //                                 '*[_type == "ticket" && !defined(slug.current) && $tag in tags[].value]',
  //                                 {tag}
  //                               )
  //                               .pipe(
  //                                 map((documents) =>
  //                                   S.documentTypeList('ticket')
  //                                     .title(`Tickets for “${tag}” (${documents.length})`)
  //                                     .menuItems(S.documentTypeList('ticket').getMenuItems())
  //                                     .filter(`_id in $ids`)
  //                                     .params({
  //                                       ids: documents.map(({_id}) => _id),
  //                                     })
  //                                     .child(ticketDocumentNode)
  //                                 )
  //                               )
  //                           )
  //                       )
  //                     );
  //                 })
  //               )
  //           ),
  //         S.divider(),
  //       ])
  //   ),
  // S.divider(),
  // S.listItem()
  //   .title('Actions')
  //   .icon(() => <Icon emoji="🛠️" />)
  //   .child(
  //     S.list()
  //       .title('Follow-up actions')
  //       .items([
  //         S.listItem()
  //           .title('Bug reports')
  //           .icon(() => <Icon emoji="🐛" />)
  //           .child(
  //             S.documentList('ticket')
  //               .title('Bug reports')
  //               .filter('_type == $type && action == "bug"')
  //               .params({type: 'ticket'})
  //               .menuItems(S.documentTypeList('ticket').getMenuItems())
  //               .child(ticketDocumentNode)
  //           ),
  //         S.listItem()
  //           .title('Doc improvements')
  //           .icon(() => <Icon emoji="📒" />)
  //           .child(
  //             S.documentList('ticket')
  //               .title('Doc improvements')
  //               .filter('_type == $type && action == "docs"')
  //               .params({type: 'ticket'})
  //               .menuItems(S.documentTypeList('ticket').getMenuItems())
  //               .child(ticketDocumentNode)
  //           ),
  //         S.listItem()
  //           .title('Feature requests')
  //           .icon(() => <Icon emoji="🤩" />)
  //           .child(
  //             S.documentList('ticket')
  //               .title('Feature requests')
  //               .filter('_type == $type && action == "feature"')
  //               .params({type: 'ticket'})
  //               .menuItems(S.documentTypeList('ticket').getMenuItems())
  //               .child(ticketDocumentNode)
  //           ),
  //         S.divider(),
  //       ])
  //   ),
  // S.listItem()
  //   .title('Doc search stats')
  //   .icon(() => <Icon emoji="🔍" />)
  //   .child(
  //     S.documentTypeList('docSearch')
  //       .title('Doc search stats')
  //       .filter('_type == $type')
  //       .params({type: 'docSearch'})
  //       .menuItems(S.documentTypeList('docSearch').getMenuItems())
  //       .canHandleIntent(S.documentTypeList('docSearch').getCanHandleIntent())
  //   ),
  // S.listItem()
  //   .title('Contributions')
  //   .icon(() => <Icon emoji="🦄" />)
  //   .child(
  //     S.documentTypeList('contribution')
  //       .title('Contributions')
  //       .filter('_type == $type')
  //       .params({type: 'contribution'})
  //       .menuItems(S.documentTypeList('contribution').getMenuItems())
  //       .canHandleIntent(S.documentTypeList('contribution').getCanHandleIntent())
  //   ),
  // S.listItem()
  //   .id('emojiTracker')
  //   .title('Emoji Tracker™')
  //   .icon(() => <Icon emoji="👍" />)
  //   .child(
  //     S.documentTypeList('emojiTracker')
  //       .title('Emoji Tracker™')
  //       .filter('_type == $type')
  //       .params({type: 'emojiTracker'})
  //       .menuItems(S.documentTypeList('emojiTracker').getMenuItems())
  //       .canHandleIntent(S.documentTypeList('emojiTracker').getCanHandleIntent())
  //   ),
=======
  /*S.listItem()
    .title('Alerts')
    .icon(() => <AlertsIcon />)
    .child(() =>
      getCurrentUser().then((user) => {
        const slackId = user?.slackId ? user.slackId : '';
        return S.documentList('ticket')
          .id('ticketAlerts')
          // this creates a proptype error, but I guess it's fine?
          .title(
            <span>
              Ticket alerts
              <br />
              <span style={{fontWeight: '400'}}>
                🥖 stale, 🔥 popular, 🗣️ @-mentioned, 🕰️ revived
              </span>
            </span>
          )
          .filter(
            '_type == $type && thread[-1].timestamp > $weekTimestamp && ((status == "open" && (thread[].content match $slackId || (!defined(thread[1]) && thread[0].timestamp < $dayTimestamp))) || (status == "resolved" && thread[-2].timestamp < $weekTimestamp))'
          )
          .params({type: 'ticket', weekTimestamp, dayTimestamp, slackId})
          .menuItems(S.documentTypeList('ticket').getMenuItems())
          .child(ticketDocumentNode);
      })
    ),
  S.listItem()
    .title('My open tickets')
    .schemaType('ticket')
    .icon(() => <OpenTicketsIcon />)
    .child(
      S.documentList('ticket')
        .title('My open tickets')
        .filter('_type == $type && status == "open" && assigned->sanityId == $userId')
        .params({type: 'ticket', userId: window._sanityUser?.id})
        .menuItems(S.documentTypeList('ticket').getMenuItems())
        .child(ticketDocumentNode)
    ),
  S.listItem()
    .title('Last 7 days')
    .icon(() => <RecentTicketsIcon />)
    .child(
      S.documentList('ticket')
        .title('Last 7 days')
        .filter('_type == $type && thread[0].timestamp > $weekTimestamp')
        .params({type: 'ticket', weekTimestamp})
        .menuItems(S.documentTypeList('ticket').getMenuItems())
        .child(ticketDocumentNode)
    ),
  S.listItem()
    .title('All tickets')
    .icon(() => <Icon emoji="🎫" />)
    .child(
      S.list()
        .title('Tickets by filter')
        .items([
          S.listItem()
            .title('All tickets')
            .icon(() => <Icon emoji="🎫" />)
            .child(
              S.documentList('ticket')
                .title('All tickets')
                .filter('_type == $type')
                .params({type: 'ticket'})
                .child(ticketDocumentNode)
            ),
          S.listItem()
            .title('Open tickets')
            .icon(() => <Icon emoji="🎫" />)
            .child(
              S.documentList('ticket')
                .title('Open tickets')
                .filter('_type == $type && status == "open"')
                .params({type: 'ticket'})
                .child(ticketDocumentNode)
            ),
          S.listItem()
            .title('Resolved tickets')
            .schemaType('ticket')
            .icon(() => <Icon emoji="✅" />)
            .child(
              S.documentList('ticket')
                .title('Resolved tickets')
                .filter('_type == $type && status == "resolved"')
                .params({type: 'ticket'})
                .child(ticketDocumentNode)
            ),
          S.divider(),
          S.listItem()
            .title('Tickets by agent')
            .schemaType('person')
            .child(
              S.documentList('person')
                .title('Tickets by agent')
                .filter('_type == $type')
                .params({type: 'person'})
                .menuItems(S.documentTypeList('person').getMenuItems())
                .child((agentID) =>
                  S.documentList('ticket')
                    .title('Tickets')
                    .filter('_type == $type && references($agentID)')
                    .params({type: 'ticket', agentID})
                    .menuItems(S.documentTypeList('ticket').getMenuItems())
                    .child(ticketDocumentNode)
                )
            ),
          S.listItem()
            .title('Tickets by tag')
            .icon(() => <Icon emoji="🏷️" />)
            .child(() =>
              documentStore.listenQuery('*[_type == "ticket"]').pipe(
                map((docs) => {
                  const tags = docs.reduce(
                    (acc, curr = {tags: []}) =>
                      curr.tags
                        ? Array.from(new Set([...acc, ...curr.tags.map(({value}) => value)])).sort()
                        : acc,
                    []
                  );

                  return S.list()
                    .title('Tickets by tag')
                    .items(
                      tags.map((tag) =>
                        S.listItem()
                          .title(tag)
                          .icon(() => <Icon emoji="🏷️" />)
                          .child(() =>
                            documentStore
                              .listenQuery('*[_type == "ticket" && $tag in tags[].value]', {tag})
                              .pipe(
                                map((documents) =>
                                  S.documentTypeList('ticket')
                                    .title(`Tickets for “${tag}” (${documents.length})`)
                                    .menuItems(S.documentTypeList('ticket').getMenuItems())
                                    .filter(`_id in $ids`)
                                    .params({
                                      ids: documents.map(({_id}) => _id),
                                    })
                                    .child(ticketDocumentNode)
                                )
                              )
                          )
                      )
                    );
                })
              )
            ),
          S.listItem()
            .title('Indexed tickets')
            .icon(() => <LiveIcon />)
            .child(() =>
              documentStore.listenQuery('*[_type == "ticket" && defined(slug.current) && defined(relevancy)]').pipe(
                map((docs) => {
                  const tags = docs.reduce(
                    (acc, curr = {tags: []}) =>
                      curr.tags
                        ? Array.from(new Set([...acc, ...curr.tags.map(({value}) => value)])).sort()
                        : acc,
                    []
                  );

                  return S.list()
                    .title('Tickets by tag')
                    .items(
                      tags.map((tag) =>
                        S.listItem()
                          .title(tag)
                          .icon(() => <Icon emoji="🏷️" />)
                          .child(() =>
                            documentStore
                              .listenQuery('*[_type == "ticket" && defined(slug.current) && defined(relevancy) && $tag in tags[].value]', {tag})
                              .pipe(
                                map((documents) =>
                                  S.documentTypeList('ticket')
                                    .title(`Tickets for “${tag}” (${documents.length})`)
                                    .menuItems(S.documentTypeList('ticket').getMenuItems())
                                    .filter(`_id in $ids`)
                                    .params({
                                      ids: documents.map(({_id}) => _id),
                                    })
                                    .child(ticketDocumentNode)
                                )
                              )
                          )
                      )
                    );
                })
              )
            ),
          S.listItem()
            .title('Unindexed tickets')
            .icon(() => <LiveIcon off />)
            .child(() =>
              documentStore.listenQuery('*[_type == "ticket" && (!defined(slug.current) || !defined(relevancy)]').pipe(
                map((docs) => {
                  const tags = docs.reduce(
                    (acc, curr = {tags: []}) =>
                      curr.tags
                        ? Array.from(new Set([...acc, ...curr.tags.map(({value}) => value)])).sort()
                        : acc,
                    []
                  );

                  return S.list()
                    .title('Tickets by tag')
                    .items(
                      tags.map((tag) =>
                        S.listItem()
                          .title(tag)
                          .icon(() => <Icon emoji="🏷️" />)
                          .child(() =>
                            documentStore
                              .listenQuery('*[_type == "ticket" && !defined(slug.current) && $tag in tags[].value]', {tag})
                              .pipe(
                                map((documents) =>
                                  S.documentTypeList('ticket')
                                    .title(`Tickets for “${tag}” (${documents.length})`)
                                    .menuItems(S.documentTypeList('ticket').getMenuItems())
                                    .filter(`_id in $ids`)
                                    .params({
                                      ids: documents.map(({_id}) => _id),
                                    })
                                    .child(ticketDocumentNode)
                                )
                              )
                          )
                      )
                    );
                })
              )
            ),
          S.divider(),
        ])
    ),
  S.divider(),
  S.listItem()
    .title('Actions')
    .icon(() => <Icon emoji="🛠️" />)
    .child(
      S.list()
        .title('Follow-up actions')
        .items([
          S.listItem()
            .title('Bug reports')
            .icon(() => <Icon emoji="🐛" />)
            .child(
              S.documentList('ticket')
                .title('Bug reports')
                .filter('_type == $type && action == "bug"')
                .params({ type: 'ticket' })
                .menuItems(S.documentTypeList('ticket').getMenuItems())
                .child(ticketDocumentNode)
            ),
          S.listItem()
            .title('Doc improvements')
            .icon(() => <Icon emoji="📒" />)
            .child(
              S.documentList('ticket')
                .title('Doc improvements')
                .filter('_type == $type && action == "docs"')
                .params({ type: 'ticket' })
                .menuItems(S.documentTypeList('ticket').getMenuItems())
                .child(ticketDocumentNode)
            ),
          S.listItem()
            .title('Feature requests')
            .icon(() => <Icon emoji="🤩" />)
            .child(
              S.documentList('ticket')
                .title('Feature requests')
                .filter('_type == $type && action == "feature"')
                .params({ type: 'ticket' })
                .menuItems(S.documentTypeList('ticket').getMenuItems())
                .child(ticketDocumentNode)
            ),
          S.divider(),
        ])
    ),
  S.listItem()
    .title('Doc search stats')
    .icon(() => <Icon emoji="🔍" />)
    .child(
      S.documentTypeList('docSearch')
        .title('Doc search stats')
        .filter('_type == $type')
        .params({ type: 'docSearch' })
        .menuItems(S.documentTypeList('docSearch').getMenuItems())
        .canHandleIntent(S.documentTypeList('docSearch').getCanHandleIntent())
    ),
  S.listItem()
    .title('Contributions')
    .icon(() => <Icon emoji="🦄" />)
    .child(
      S.documentTypeList('contribution')
        .title('Contributions')
        .filter('_type == $type')
        .params({ type: 'contribution' })
        .menuItems(S.documentTypeList('contribution').getMenuItems())
        .canHandleIntent(S.documentTypeList('contribution').getCanHandleIntent())
    ),
  S.listItem()
    .id('emojiTracker')
    .title('Emoji Tracker™')
    .icon(() => <Icon emoji="👍" />)
    .child(
      S.documentTypeList('emojiTracker')
        .title('Emoji Tracker™')
        .filter('_type == $type')
        .params({ type: 'emojiTracker' })
        .menuItems(S.documentTypeList('emojiTracker').getMenuItems())
        .canHandleIntent(S.documentTypeList('emojiTracker').getCanHandleIntent())
    ), */
>>>>>>> 62f3a0d
  S.listItem()
    .title('Partners')
    .icon(() => <Icon emoji="🤝" />)
    .child(
      S.list()
        .title('Partners')
        .items([
          S.listItem()
            .title('Technology Partners')
            .icon(() => <Icon emoji="💻" />)
            .child(S.documentList().title('Technology Partners').filter('_type == "techPartner"')),
        ])
    ),
  S.divider(),
  S.listItem()
    .title('Community ecosystem')
    .icon(() => <Icon emoji="🌱" />)
    .child(
      S.list()
        .title('Community ecosystem')
        .items([
<<<<<<< HEAD
          S.listItem()
            .title('Ticket Curation')
            .icon(() => <Icon emoji="🎫" />)
            .child(S.documentTypeList('editorial')),
=======
          getSupportStructure(),
>>>>>>> 62f3a0d
          S.listItem()
            .title('Community Contributions')
            .icon(() => <Icon emoji="🎁" />)
            .child(
              S.list()
                .title('Contributions')
                .items(CONTRIBUTION_TYPES.map((type) => S.documentTypeListItem(type)))
            ),
          feedbackStructure,
          S.listItem()
            .title('Contributions migrated from admin (needs review)')
            .icon(() => <Icon emoji="🚨" />)
            .child(
              S.documentList('person')
                .title('Migrated')
                .filter('_type match "contribution.**" && cameFromAdmin == true')
            ),
          curationStructure,
          S.listItem()
            .title('Community taxonomies')
            .icon(() => <Icon emoji="📂" />)
            .child(
              S.list()
                .title('Taxonomies')
                .items([
                  ...TAXONOMIES.map((type) => {
                    if (type === 'taxonomy.contributionType') {
                      // return S.documentTypeListItem(type)
                      return S.listItem()
                        .title('Contribution types')
                        .icon(() => <Icon emoji="🎁" />)
                        .child(
                          S.documentList()
                            .title('Contribution types')
                            .filter('_type == "taxonomy.contributionType"')
                            .menuItems([])
                            // We remove initialValueTemplates to hide the "Create new" action menu from the list
                            .initialValueTemplates([])
                        );
                    }
                    return S.documentTypeListItem(type);
                  }),
                  S.listItem()
                    .title('Contest')
                    .child(S.documentList().title('Contest').filter('_type == "taxonomy.contest"')),
                ])
            ),
          S.divider(),
          S.listItem()
            .title('People')
            .schemaType('person')
            .child(
              S.documentList('person')
                .title('People')
                .filter('_type == $type')
                .params({type: 'person'})
            ),
          S.documentListItem().id('studioTutorials').schemaType('studioTutorials'),
          S.documentListItem().id('communityBulletin').schemaType('communityBulletin'),
          S.documentListItem().id('landing.getStarted').schemaType('landing.getStarted'),
          S.documentListItem().id('globalSettings').schemaType('globalSettings'),
        ])
    ),
  S.divider(),
  S.listItem()
    .title('Settings')
    .icon(() => <Icon emoji="🎛️" />)
    .child(
      S.list()
        .title('Settings')
        .items([
          S.listItem()
            .title('Tags')
            .schemaType('tag')
            .child(
              S.documentList('tag')
                .title('Tags')
<<<<<<< HEAD
                .defaultOrdering([{field: 'title', direction: 'asc'}])
=======
>>>>>>> 62f3a0d
                .menuItems(S.documentTypeList('tag').getMenuItems())
                .filter('_type == $type')
                .params({type: 'tag'})
                .canHandleIntent(S.documentTypeList('tag').getCanHandleIntent())
            ),
          S.listItem()
            .title('Persons')
            .schemaType('person')
            .child(
              S.documentList('person')
                .title('Persons')
                .filter('_type == $type')
                .params({type: 'person'})
            ),
        ])
    ),
];

export default getAdminStructure;
