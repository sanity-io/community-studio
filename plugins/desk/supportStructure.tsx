import { EnvelopeIcon } from '@sanity/icons'
import {
  ActivityIcon,
  UserIcon,
  HeartIcon,
  CommentIcon,
  CheckmarkCircleIcon,
  StarIcon,
  TagIcon,
} from '@sanity/icons'
import { formatISO, subHours } from 'date-fns'
import React from 'react'
import { map } from 'rxjs/operators'

const weekThreshold = formatISO(subHours(new Date(), 168))
const monthThreshold = formatISO(subHours(new Date(), 24 * 30))

export const getCommunitySupportStructure = (S, { getClient, documentStore, currentUser }) => {
  const client = getClient({ apiVersion: '2022-10-31' })
  return S.listItem()
    .title('Tickets')
    .icon(() => <EnvelopeIcon />)
    .child(() =>
      documentStore
        .listenQuery(
          `*[_type == 'person' && (_id == $id || _id == 'drafts.' + $id)][0]{ ..., 'tags': tags[]._ref, 'savedTickets': savedTickets[]._ref}`,
          { id: currentUser.id },
          { apiVersion: '2021-10-21' },
        )
        .pipe(
          map((user) =>
            S.list()
              .title('Tickets')
              .items([
                S.listItem()
                  .title('Your Feed')
                  .icon(ActivityIcon)
                  .child(() => {
                    if (!user.tags?.length) {
                      return S.list().title('🚨 No Tags Followed 🚨').id('noTags').items()
                    } else {
                      return S.documentList()
                        .title('Your Feed')
                        .filter(
                          `_type == 'ticket' && count((tags[]._ref)[@ in $tags]) > 0  && _createdAt > $weekThreshold`,
                        )
                        .params({ tags: user.tags, weekThreshold })
                        .apiVersion('2023-10-18')
                        .apiVersion('v2021-06-07')
                        .menuItems([...S.documentTypeList('ticket').getMenuItems()])
                    }
                  }),
                S.listItem()
                  .icon(UserIcon)
                  .title('Your Tickets')
                  .child(async () => {
                    if (!user.slackId) {
                      return S.list()
                        .id('missingProfile')
                        .title('🚨 Profile Missing Slack ID 🚨')
                        .items()
                    } else {
                      return await client
                        .fetch(
                          `*[_type == 'ticket' && $id in thread[].author.slackId]`,
                          {
                            id: user.slackId,
                          },
                          { apiVersion: '2021-10-21' },
                        )
                        .then((tickets) =>
                          S.list()
                            .title('Your Feed')
                            .items(
                              tickets.map((ticket) =>
                                S.documentListItem().id(ticket._id).schemaType(ticket._type),
                              ),
                            ),
                        )
                    }
                  }),
                S.listItem()
                  .title('Saved Tickets')
                  .icon(HeartIcon)
                  .child(
                    S.documentList()
                      .title('Saved tickets')
                      .filter(`_type == 'ticket' && _id in $savedTickets`)
                      .params({ savedTickets: user?.savedTickets })
                      .apiVersion('2023-10-18')
                      .menuItems([...S.documentTypeList('ticket').getMenuItems()]),
                  ),
                S.divider(),
                S.listItem()
                  .title('All Tickets')
                  .icon(() => <EnvelopeIcon />)
                  .child(
                    S.list()
                      .title('All Tickets')
                      .items([
                        S.listItem()
                          .title('New')
                          .icon(StarIcon)
                          .child(
                            S.documentList()
                              .title('New Tickets')
                              .filter(`_type == 'ticket' && _createdAt > $weekThreshold`)
                              .params({ weekThreshold })
                              .apiVersion('2023-10-18')
                              .menuItems([...S.documentTypeList('ticket').getMenuItems()]),
                          ),
                        S.listItem()
                          .title('Recently Resolved')
                          .icon(CheckmarkCircleIcon)
                          .child(
                            S.documentList()
                              .title('New Tickets')
                              .filter(
                                `_type == 'ticket' && _createdAt > $weekThreshold && status == 'resolved'`,
                              )
                              .params({ weekThreshold })
                              .apiVersion('2023-10-18')
                              .menuItems([...S.documentTypeList('ticket').getMenuItems()]),
                          ),
                        S.listItem()
                          .title('Tickets by Tag')
                          .icon(TagIcon)
                          .child(
                            S.documentTypeList('tag')
                              .title('Tickets by Tag')
                              .defaultOrdering([{ field: 'title', direction: 'asc' }])
                              .child((tagId) =>
                                S.documentList()
                                  .title('Tickets')
                                  .filter(`_type == 'editorial' && $tagId in tags[]._ref`)
                                  .params({ tagId })
                                  .apiVersion('2023-10-18')
                                  .menuItems([...S.documentTypeList('ticket').getMenuItems()]),
                              ),
                          ),
                        S.divider(),
                        S.listItem()
                          .title('All Tickets')
                          .icon(() => <EnvelopeIcon />)
                          .child(S.documentTypeList('ticket')),
                      ]),
                  ),
              ]),
          ),
        ),
    )
}

export const getSupportStructure = (S, context) =>
  S.list()
    .title('Ticket Curation')
    .items([
      S.listItem()
        .title('New')
        .icon(StarIcon)
        .child(
          S.documentList()
            .title('New Tickets')
            .filter(`_type == 'editorial' && _createdAt > $weekThreshold`)
            .params({ weekThreshold })
            .apiVersion('2023-10-18'),
        ),
      S.listItem()
        .title('Recently Resolved')
        .icon(CheckmarkCircleIcon)
        .child(
          S.documentList()
            .title('Recently Resolved')
            .filter(
              `_type == 'editorial' && _createdAt > $weekThreshold && ticket->.status == 'resolved'`,
            )
            .params({ weekThreshold })
            .apiVersion('2023-10-18'),
        ),
      S.listItem()
        .title('Tickets by Tag')
        .icon(TagIcon)
        .child(
          S.documentTypeList('tag')
            .title('Tickets by Tag')
            .defaultOrdering([{ field: 'title', direction: 'asc' }])
            .child((tagId) =>
              S.documentList()
                .title('Tickets')
                .filter(
                  `_type == 'editorial' && _createdAt > $monthThreshold && $tagId in ticket->.tags[]._ref`,
                )
                .params({ tagId, monthThreshold })
                .apiVersion('2023-10-18'),
            ),
        ),
      S.listItem()
        .title('Published on Exchange')
        .icon(CommentIcon)
        .child(
          S.documentList()
            .title('Published on Exchange')
            .filter(
              `_type == 'editorial' && ticket->.status == 'resolved' && defined(slug.current)`,
            )
            .apiVersion('2023-10-18'),
        ),
      S.divider(),
      S.listItem()
        .title('All Tickets')
        .icon(() => <EnvelopeIcon />)
        .child(S.documentTypeList('editorial')),
    ])
