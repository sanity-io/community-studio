import React, {useState} from 'react';
import S from '@sanity/desk-tool/structure-builder';
import documentStore from 'part:@sanity/base/datastore/document';
import userStore from 'part:@sanity/base/user';
import {map} from 'rxjs/operators';
import client from 'part:@sanity/base/client';
import {getCurrentUser} from './schemas/components/functions';

import Icon from './schemas/components/icon';
import AlertsIcon from './schemas/components/icon/alertsIcon';
import OpenTicketsIcon from './schemas/components/icon/openTicketsIcon';
import RecentTicketsIcon from './schemas/components/icon/recentTicketsIcon';
import ThreadPreview from './schemas/components/threadPreview';

const TAXONOMIES = [
  'taxonomy.framework',
  'taxonomy.integration',
  'taxonomy.integrationType',
  'taxonomy.language',
  'taxonomy.projectType',
  'taxonomy.solution',
];

const hiddenDocTypes = (listItem) =>
  ![
    'contribution',
    'docSearch',
    'emojiTracker',
    'guide',
    'person',
    'plugin',
    'showcaseItem',
    'starter',
    'tagOption',
    'ticket',
    ...TAXONOMIES,
  ].includes(listItem.getId());

const ticketDocumentNode = (docId) =>
  S.document()
    .documentId(docId)
    .views([S.view.form(), S.view.component(ThreadPreview).title('Thread')]);

const currentUser = () => {
  // Get the user that is logged in
  const userSubscription = userStore.currentUser.subscribe((event) => {
    // Instead of a local variable, we use this window object as it'll be used throughout the studio
    window._sanityUser = event.user;
  });
};
currentUser();

const today = new Date();
const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
const dayAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);
const weekTimestamp = ((weekAgo.getTime() / 1000) | 0).toString();
const dayTimestamp = ((dayAgo.getTime() / 1000) | 0).toString();

const adminItems = [
  S.listItem()
    .title('Alerts')
    .icon(() => <AlertsIcon />)
    .child(() =>
      getCurrentUser().then((user) => {
        const slackId = user.slackId ? user.slackId : '';
        return S.documentList('ticket')
          .id('ticketAlerts')
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
                .params({type: 'ticket'})
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
                .params({type: 'ticket'})
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
                .params({type: 'ticket'})
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
        .params({type: 'docSearch'})
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
        .params({type: 'contribution'})
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
        .params({type: 'emojiTracker'})
        .menuItems(S.documentTypeList('emojiTracker').getMenuItems())
        .canHandleIntent(S.documentTypeList('emojiTracker').getCanHandleIntent())
    ),
  S.divider(),
  S.listItem().title('Community Contributions').child(S.list().title('Contributions').items([
    
    S.documentTypeListItem('guide'),
    S.documentTypeListItem('plugin'),
    S.documentTypeListItem('starter'),
    S.documentTypeListItem('showcaseItem'),
  ])),
  S.listItem()
    .title('Community taxonomies')
    .child(
      S.list()
        .title('Taxonomies')
        .items(TAXONOMIES.map((type) => S.documentTypeListItem(type)))
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
            .schemaType('tagOption')
            .child(
              S.documentList('tagOption')
                .title('Tags')
                .menuItems(S.documentTypeList('tagOption').getMenuItems())
                .filter('_type == $type')
                .params({type: 'tagOption'})
                .canHandleIntent(S.documentTypeList('tagOption').getCanHandleIntent())
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
  ...S.documentTypeListItems().filter(hiddenDocTypes),
];

/**
 * Gets a personalized document list for the currently logged user
 */
function getDocumentListItem(type) {
  const defaultListItem = S.documentTypeListItem(type);
  const defaultDocList = S.documentTypeList(type);
  return S.listItem()
    .id(type)
    .schemaType(type)
    .title(defaultListItem.getTitle())
    .icon(defaultListItem.getIcon())
    .child(
      S.documentList()
        .id(type)
        .schemaType(type)
        .title(defaultListItem.getTitle())
        .filter('_type == $type && $userId in authors[]._ref')
        .params({userId: window._sanityUser?.id, type})
        // @TODO: add a "Create new" menu item
        .menuItems(defaultDocList.getMenuItems())
    );
}

const communityItems = [
  getDocumentListItem('guide'),
  getDocumentListItem('plugin'),
  getDocumentListItem('starter'),
  getDocumentListItem('showcaseItem'),
  S.divider(),
  S.documentListItem().schemaType('person').id(window._sanityUser.id).title('Your profile'),
];

const getUserRole = () => {
  if (!window._sanityUser || !window._sanityUser.id) {
    return 'none';
  }
  if (
    window._sanityUser.profileImage
      ? // Community member's `profileImage` comes from Github
        window._sanityUser.profileImage.includes('githubusercontent.com')
      : // If they don't have one, let's settle on their role, which is that of an editor
        window._sanityUser.role === 'editor'
  ) {
    return 'community';
  }
  return 'administrator';
};

/**
 * Our structure is different for administrators and community members to help the latter by decluttering the structure.
 */
export default () => {
  const role = getUserRole();
  if (role === 'administrator') {
    return S.list().title('Content').items(adminItems);
  }
  return S.list().title('Your contributions').items(communityItems);
};
