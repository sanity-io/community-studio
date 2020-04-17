import React from 'react'
import S from '@sanity/desk-tool/structure-builder'
import documentStore from 'part:@sanity/base/datastore/document'
import { map } from 'rxjs/operators'
import Icon from './schemas/components/icon'
import ThreadPreview from './schemas/components/threadPreview'

const hiddenDocTypes = listItem =>
  !['person', 'ticket', 'tagOption'].includes(listItem.getId())

export default () =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Tickets')
        .schemaType('ticket')
        .child(
          S.documentList('ticket')
            .title('Tickets')
            .filter('_type == $type')
            .params({ type: 'ticket' })
            .child(docId =>
              S.document()
                .documentId(docId)
                .views([
                  S.view.form(),
                  S.view.component(ThreadPreview).title('Threads')
                ])
            )
        ),
      S.listItem()
        .title('Tickets by tags')
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
                .title('Tickets by tags')
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
                                .title(`Tickets for “${tag}” (${documents.length})`)
                                .menuItems(S.documentTypeList('ticket').getMenuItems())
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
                    .canHandleIntent(S.documentTypeList('tagOption').getCanHandleIntent())
                ),
              S.listItem()
                .title('Persons')
                .schemaType('person')
                .child(
                  S.documentList('person')
                    .title('Persons')
                    .filter('_type == $type')
                    .params({ type: 'person' })
                ),
            ])
        ),
      ...S.documentTypeListItems().filter(hiddenDocTypes)
    ])
