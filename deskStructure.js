import React, { useState } from 'react'
import S from '@sanity/desk-tool/structure-builder'
import documentStore from 'part:@sanity/base/datastore/document'
import userStore from 'part:@sanity/base/user'
import { map } from 'rxjs/operators'
import client from 'part:@sanity/base/client'
import { getCurrentUser } from './schemas/components/functions'

import Icon from './schemas/components/icon'
import AlertsIcon from './schemas/components/icon/alertsIcon'
import OpenTicketsIcon from './schemas/components/icon/openTicketsIcon'
import RecentTicketsIcon from './schemas/components/icon/recentTicketsIcon'
import ThreadPreview from './schemas/components/threadPreview'

const hiddenDocTypes = listItem =>
  !['contribution', 'docSearch', 'emojiTracker', 'person', 'ticket', 'tagOption'].includes(listItem.getId())

const ticketDocumentNode = docId =>
  S.document()
    .documentId(docId)
    .views([S.view.form(), S.view.component(ThreadPreview).title('Thread')])

let userId

const currentUser = () => {
  // Get the user that is logged in
  const userSubscription = userStore.currentUser.subscribe(event => {
    userId = event.user.id
  })
}
currentUser()

const today = new Date()
const weekAgo = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000))
const dayAgo = new Date(today.getTime() - (24 * 60 * 60 * 1000))
const weekTimestamp = (weekAgo.getTime()/1000|0).toString()
const dayTimestamp = (dayAgo.getTime()/1000|0).toString()

export default () =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Alerts')
        .icon(() => <AlertsIcon />)
        .child(() =>
          getCurrentUser()
          .then(user => {
            const slackId = user.slackId ? user.slackId : ''
            return S.documentList('ticket')
              .id('ticketAlerts')
              .title(<span>Ticket alerts<br/><span style={{fontWeight: '400'}}>🥖 stale, 🔥 popular, 🗣️ @-mentioned, 🕰️ revived</span></span>)
              .filter('_type == $type && thread[-1].timestamp > $weekTimestamp && ((status == "open" && (thread[].content match $slackId || (!defined(thread[1]) && thread[0].timestamp < $dayTimestamp))) || (status == "resolved" && thread[-2].timestamp < $weekTimestamp))')
              .params({ type: 'ticket', weekTimestamp, dayTimestamp, slackId })
              .menuItems(S.documentTypeList('ticket').getMenuItems())
              .child(ticketDocumentNode)
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
            .params({ type: 'ticket', userId })
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
            .params({ type: 'ticket', weekTimestamp })
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
                    .params({ type: 'ticket' })
                    .child(ticketDocumentNode)
                ),
              S.listItem()
                .title('Open tickets')
                .icon(() => <Icon emoji="🎫" />)
                .child(
                  S.documentList('ticket')
                    .title('Open tickets')
                    .filter('_type == $type && status == "open"')
                    .params({ type: 'ticket' })
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
                    .params({ type: 'ticket' })
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
                    .params({ type: 'person' })
                    .menuItems(S.documentTypeList('person').getMenuItems())
                    .child(agentID =>
                      S.documentList('ticket')
                        .title('Tickets')
                        .filter('_type == $type && references($agentID)')
                        .params({ type: 'ticket', agentID })
                        .menuItems(S.documentTypeList('ticket').getMenuItems())
                        .child(ticketDocumentNode)
                    )
                ),
              S.listItem()
                .title('Tickets by tag')
                .icon(() => <Icon emoji="🏷️" />)
                .child(() =>
                  documentStore.listenQuery('*[_type == "ticket"]').pipe(
                    map(docs => {
                      const tags = docs.reduce(
                        (acc, curr = { tags: [] }) =>
                          curr.tags
                            ? Array.from(
                              new Set([
                                ...acc,
                                ...curr.tags.map(({ value }) => value)
                              ])
                            ).sort()
                            : acc,
                        []
                      )

                      return S.list()
                        .title('Tickets by tag')
                        .items(
                          tags.map(tag =>
                            S.listItem()
                              .title(tag)
                              .icon(() => <Icon emoji="🏷️" />)
                              .child(() =>
                                documentStore
                                  .listenQuery(
                                    '*[_type == "ticket" && $tag in tags[].value]',
                                    { tag }
                                  )
                                  .pipe(
                                    map(documents =>
                                      S.documentTypeList('ticket')
                                        .title(
                                          `Tickets for “${tag}” (${documents.length})`
                                        )
                                        .menuItems(
                                          S.documentTypeList('ticket').getMenuItems()
                                        )
                                        .filter(`_id in $ids`)
                                        .params({
                                          ids: documents.map(({ _id }) => _id)
                                        })
                                    )
                                  )
                              )
                           )
                        )
                    })
                  )
                ),
              S.listItem()
                .title('Tickets by month')
                .icon(() => <Icon emoji="🗄️" />)
                .child(() =>
                  documentStore.query('*[_type == "ticket"][0]{"ts": thread[0].timestamp}').pipe(
                    map(docs => {
                      console.log(ts)
                      const tags = docs.reduce(
                        (acc, curr = { tags: [] }) =>
                          curr.tags
                            ? Array.from(
                              new Set([
                                ...acc,
                                ...curr.tags.map(({ value }) => value)
                              ])
                            ).sort()
                            : acc,
                        []
                      )
                      return S.list()
                      .title('Tickets by tag')
                      .items(
                        tags.map(tag =>
                          S.listItem()
                            .title(tag)
                            .icon(() => <Icon emoji="🏷️" />)
                            .child(() =>
                              documentStore
                                .listenQuery(
                                  '*[_type == "ticket" && $tag in tags[].value]',
                                  { tag }
                                )
                                .pipe(
                                  map(documents =>
                                    S.documentTypeList('ticket')
                                      .title(
                                        `Tickets for “${tag}” (${documents.length})`
                                      )
                                      .menuItems(
                                        S.documentTypeList('ticket').getMenuItems()
                                      )
                                      .filter(`_id in $ids`)
                                      .params({
                                        ids: documents.map(({ _id }) => _id)
                                      })
                                  )
                                )
                            )
                         )
                      )
                  })
                )
              ),
              S.divider()
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
              S.divider()
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
                    .params({ type: 'tagOption' })
                    .canHandleIntent(
                      S.documentTypeList('tagOption').getCanHandleIntent()
                    )
                ),
              S.listItem()
                .title('Persons')
                .schemaType('person')
                .child(
                  S.documentList('person')
                    .title('Persons')
                    .filter('_type == $type')
                    .params({ type: 'person' })
                )
            ])
        ),
      ...S.documentTypeListItems().filter(hiddenDocTypes)
    ])
