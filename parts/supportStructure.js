import React from 'react';
import S from '@sanity/desk-tool/structure-builder';
import userStore from 'part:@sanity/base/user';
import sanityClient from 'part:@sanity/base/client';
import {EnvelopeIcon} from '@sanity/icons';
import {formatISO, subHours} from 'date-fns';
import documentStore from 'part:@sanity/base/datastore/document';
import {map} from 'rxjs/operators';
import {
  ActivityIcon,
  UserIcon,
  HeartIcon,
  CommentIcon,
  CheckmarkCircleIcon,
  StarIcon,
  TagIcon,
} from '@sanity/icons';

const client = sanityClient.withConfig({apiVersion: '2022-10-31'});

const weekThreshold = formatISO(subHours(new Date(), 168));

export const getCommunitySupportStructure = () =>
  S.listItem()
    .title('Tickets')
    .icon(() => <EnvelopeIcon />)
    .child(() =>
      documentStore
        .listenQuery(
          `*[_type == 'person' && (_id == $id || _id == 'drafts.' + $id)][0]{ ..., 'tags': tags[]._ref, 'savedTickets': savedTickets[]._ref}`,
          {id: window._sanityUser.id},
          {apiVersion: '2021-10-21'}
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
                    if (!user.tags.length) {
                      return S.list().title('🚨 No Tags Followed 🚨').id('noTags').items();
                    } else {
                      return S.documentList()
                        .title('Your Feed')
                        .filter(
                          `_type == 'ticket' && count((tags[]._ref)[@ in $tags]) > 0  && _createdAt > $weekThreshold`
                        )
                        .params({tags: user.tags, weekThreshold})
                        .apiVersion('v2021-06-07')
                        .menuItems([...S.documentTypeList('ticket').getMenuItems()]);
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
                        .items();
                    } else {
                      return await client
                        .fetch(
                          `*[_type == 'ticket' && $id in thread[].author.slackId]`,
                          {
                            id: user.slackId,
                          },
                          {apiVersion: '2021-10-21'}
                        )
                        .then((tickets) =>
                          S.list()
                            .title('Your Feed')
                            .items(
                              tickets.map((ticket) =>
                                S.documentListItem().id(ticket._id).schemaType(ticket._type)
                              )
                            )
                        );
                    }
                  }),
                S.listItem()
                  .title('Saved Tickets')
                  .icon(HeartIcon)
                  .child(
                    S.documentList()
                      .title('Saved tickets')
                      .filter(`_type == 'ticket' && _id in $savedTickets`)
                      .params({savedTickets: user.savedTickets})
                      .menuItems([...S.documentTypeList('ticket').getMenuItems()])
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
                              .params({weekThreshold})
                              .menuItems([...S.documentTypeList('ticket').getMenuItems()])
                          ),
                        S.listItem()
                          .title('Recently Resolved')
                          .icon(CheckmarkCircleIcon)
                          .child(
                            S.documentList()
                              .title('New Tickets')
                              .filter(
                                `_type == 'ticket' && _createdAt > $weekThreshold && status == 'resolved'`
                              )
                              .params({weekThreshold})
                              .menuItems([...S.documentTypeList('ticket').getMenuItems()])
                          ),
                        ,
                        S.listItem()
                          .title('Tickets by Tag')
                          .icon(TagIcon)
                          .child(
                            S.documentTypeList('tag')
                              .title('Tickets by Tag')
                              .defaultOrdering([{field: 'title', direction: 'asc'}])
                              .child((tagId) =>
                                S.documentList()
                                  .title('Tickets')
                                  .filter(`_type == 'ticket' && $tagId in tags[]._ref`)
                                  .params({tagId})
                                  .menuItems([...S.documentTypeList('ticket').getMenuItems()])
                              )
                          ),
                        S.divider(),
                        S.listItem()
                          .title('All Tickets')
                          .icon(() => <EnvelopeIcon />)
                          .child(S.documentTypeList('ticket')),
                      ])
                  ),
              ])
          )
        )
    );

export const getSupportStructure = () =>
  S.list()
    .title('Support')
    .items([
      S.listItem()
        .title('New')
        .icon(StarIcon)
        .child(
          S.documentList()
            .title('New Tickets')
            .filter(`_type == 'editorial' && _createdAt > $weekThreshold`)
            .params({weekThreshold})
        ),
      S.listItem()
        .title('Recently Resolved')
        .icon(CheckmarkCircleIcon)
        .child(
          S.documentList()
            .title('Recently Resolved')
            .filter(`_type == 'editorial' && _createdAt > $weekThreshold && status == 'resolved'`)
            .params({weekThreshold})
        ),
      S.listItem()
        .title('Tickets by Tag')
        .icon(TagIcon)
        .child(
          S.documentTypeList('tag')
            .title('Tickets by Tag')
            .defaultOrdering([{field: 'title', direction: 'asc'}])
            .child((tagId) =>
              S.documentList()
                .title('Tickets')
                .filter(`_type == 'editorial' && $tagId in tags[]._ref`)
                .params({tagId})
            )
        ),
      S.listItem()
        .title('Published on Exchange')
        .icon(CommentIcon)
        .child(
          S.documentList()
            .title('Published on Exchange')
            .filter(`_type == 'editorial' && status == 'resolved' && defined(slug.current)`)
        ),
      S.divider(),
      S.listItem()
        .title('All Tickets')
        .icon(() => <EnvelopeIcon />)
        .child(S.documentTypeList('editorial')),
    ]);
