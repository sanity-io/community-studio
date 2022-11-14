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
  CheckmarkCircleIcon,
  StarIcon,
  TagIcon,
} from '@sanity/icons';

const client = sanityClient.withConfig({apiVersion: '2022-10-31'});

const weekThreshold = formatISO(subHours(new Date(), 168));

const getSupportStructure = () =>
  S.listItem()
    .title('Tickets')
    .icon(() => <EnvelopeIcon />)
    .child(
      S.list()
        .title('Support')
        .items([
          S.listItem()
            .title('New')
            .icon(StarIcon)
            .child(
              S.documentList()
                .title('New Tickets')
                .filter(`_type == 'ticket' && _createdAt > $weekThreshold`)
                .params({weekThreshold})
            ),
          S.listItem()
            .title('Recently Resolved')
            .icon(CheckmarkCircleIcon)
            .child(
              S.documentList()
                .title('New Tickets')
                .filter(`_type == 'ticket' && _createdAt > $weekThreshold && status == 'resolved'`)
                .params({weekThreshold})
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
                )
            ),
          S.listItem()
            .title('All Tickets')
            .icon(() => <EnvelopeIcon />)
            .child(S.documentTypeList('ticket')),
        ])
    );

export default getSupportStructure;
