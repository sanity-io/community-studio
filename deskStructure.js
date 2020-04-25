import React from 'react'
import S from '@sanity/desk-tool/structure-builder'
import documentStore from 'part:@sanity/base/datastore/document'
import userStore from 'part:@sanity/base/user'

import { map } from 'rxjs/operators'
import Icon from './schemas/components/icon'
import ThreadPreview from './schemas/components/threadPreview'

const hiddenDocTypes = listItem =>
  !['person', 'ticket', 'tagOption'].includes(listItem.getId())

const ticketDocumentNode = docId =>
  S.document()
    .documentId(docId)
    .views([S.view.form(), S.view.component(ThreadPreview).title('Thread')])

export default () =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('My open tickets')
        .schemaType('ticket')
        .icon(() => <Icon emoji="⏳" />)
        .child(
          userStore.currentUser.pipe(
            map(({ user }) => {
              const { role } = user
              console.log(user)
              return S.documentList('ticket')
                .title('My open tickets')
                .filter('_type == $type && status == "open" && assigned->sanityId == $userId')
                .params({ type: 'ticket', userId: user.id })
                .child(ticketDocumentNode)
            })
          )
        ),
      S.listItem()
        .title('All tickets')
        .schemaType('ticket')
        .child(
          S.documentList('ticket')
            .title('All tickets')
            .filter('_type == $type')
            .params({ type: 'ticket' })
            .child(ticketDocumentNode)
        ),
      S.listItem()
        .title('Open tickets')
        .schemaType('ticket')
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
      S.listItem()
        .title('Tickets by Agents')
        .schemaType('person')
        .child(
          S.documentList('person')
            .title('Tickets by Agents')
            .filter('_type == $type')
            .params({ type: 'person' })
            .child(agentID =>
              S.documentList('ticket')
                .title('Tickets')
                .filter('_type == $type && references($agentID)')
                .params({ type: 'ticket', agentID })
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
