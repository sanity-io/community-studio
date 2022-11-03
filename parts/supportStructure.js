import React from 'react';
import S from '@sanity/desk-tool/structure-builder';
import userStore from 'part:@sanity/base/user';
import sanityClient from 'part:@sanity/base/client';
import {EnvelopeIcon} from '@sanity/icons';
import {formatISO, subHours} from 'date-fns';
import documentStore from 'part:@sanity/base/datastore/document';
import {map} from 'rxjs/operators';

const client = sanityClient.withConfig({apiVersion: '2022-10-31'});

const weekThreshold = formatISO(subHours(new Date(), 168));

console.log(weekThreshold);

const getSupportStructure = () => {
  return S.listItem()
    .title('Support')
    .icon(() => <EnvelopeIcon />)
    .child(
      S.list()
        .title('Support')
        .items([
          S.listItem().title('Your Feed').child(),
          S.listItem()
            .title('Your Tickets')
            .child(
              async () =>
                await userStore.getCurrentUser().then(
                  async (user) =>
                    await client
                      .fetch(`*[_type == 'person' && (_id == $id || _id == 'drafts.' + $id)][0]`, {
                        id: user.id,
                      })
                      .then(async ({slackId}) =>
                        documentStore
                          .listenQuery(
                            `*[_type == 'ticket' && $id in thread[].author.slackId]`,
                            {
                              id: slackId,
                            },
                            {apiVersion: '2021-10-21'}
                          )
                          .pipe(
                            map((tickets) =>
                              S.list()
                                .title('Your Feed')
                                .items(
                                  tickets.map((ticket) =>
                                    S.documentListItem().id(ticket._id).schemaType(ticket._type)
                                  )
                                )
                            )
                          )
                      )
                )
            ),
          S.listItem().title('Saved Tickets'),
          S.divider(),
          S.listItem()
            .title('All Tickets')
            .child(
              S.list()
                .title('All Tickets')
                .items([
                  S.listItem()
                    .title('New')
                    .child(
                      S.documentList()
                        .title('New Tickets')
                        .filter(`_type == 'ticket' && _createdAt > $weekThreshold`)
                        .params({weekThreshold})
                    ),
                  S.listItem()
                    .title('Recently Resolved')
                    .child(
                      S.documentList()
                        .title('New Tickets')
                        .filter(
                          `_type == 'ticket' && _createdAt > $weekThreshold && status == 'resolved'`
                        )
                        .params({weekThreshold})
                    ),
                  ,
                  S.listItem()
                    .title('Tickets by Tag')
                    .child(
                      S.documentTypeList('tag')
                        .title('Tickets by Tag')
                        .child(async (tagId) => {
                          console.log(tagId);
                          const {title, value} = await client.fetch(
                            `*[_type == 'tag' && _id == $tagId]`,
                            {tagId}
                          );
                          return S.documentList()
                            .title(title)
                            .id(tagId)
                            .filter(`_type == 'ticket' && $value in tags[].value`)
                            .params({value});
                        })
                    ),
                  S.divider(),
                  S.listItem().title('All Tickets').child(S.documentTypeList('ticket')),
                ])
            ),
        ])
    );
};

export default getSupportStructure;
