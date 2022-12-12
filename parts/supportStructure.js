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

export const getSupportStructure = () =>
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
            .params({weekThreshold})
        ),
      S.listItem()
        .title('Recently Resolved')
        .icon(CheckmarkCircleIcon)
        .child(
          S.documentList()
            .title('Recently Resolved')
            .filter(
              `_type == 'editorial' && _createdAt > $weekThreshold && ticket->.status == 'resolved'`
            )
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
                .filter(
                  `_type == 'editorial' && _createdAt > $monthThreshold && $tagId in ticket->.tags[]._ref`
                )
                .params({tagId, monthThreshold})
            )
        ),
      S.listItem()
        .title('Published on Exchange')
        .icon(CommentIcon)
        .child(
          S.documentList()
            .title('Published on Exchange')
            .filter(
              `_type == 'editorial' && ticket->.status == 'resolved' && defined(slug.current)`
            )
        ),
      S.divider(),
      S.listItem()
        .title('All Tickets')
        .icon(() => <EnvelopeIcon />)
        .child(S.documentTypeList('editorial')),
    ]);
