import React from 'react';
// import S from '@sanity/desk-tool/structure-builder';
// import documentStore from 'part:@sanity/base/datastore/document';
// import {map} from 'rxjs/operators';
// import {getCurrentUser} from '../schemas/components/functions';

// import Icon from '../schemas/components/icon';
// import AlertsIcon from '../schemas/components/icon/AlertsIcon';
// import OpenTicketsIcon from '../schemas/components/icon/OpenTicketsIcon';
// import RecentTicketsIcon from '../schemas/components/icon/RecentTicketsIcon';
// import ThreadPreview from '../schemas/components/threadPreview';
// import curationStructure from './curationStructure';
// import feedbackStructure from './feedbackStructure';
// import {getSupportStructure} from './supportStructure';
import {
  UsersIcon,
  EarthAmericasIcon,
  CogIcon,
  EnvelopeIcon,
  DesktopIcon,
  WarningOutlineIcon,
  UserIcon,
  RocketIcon,
  BillIcon,
  IceCreamIcon,
} from '@sanity/icons';
import {ConnectionIcon} from '../schemas/components/icons/ConnectionIcon';
import {GiftIcon} from '../schemas/components/icons/GiftIcon';
import {LiveIcon} from '../schemas/components/Icons/LiveIcon';

const TAXONOMIES = [
  'taxonomy.framework',
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

const today = new Date();
const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
const dayAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);

/**
 * This is a function instead of a plain array to make sure we get the freshest window._sanityUser
 */
const getAdminStructure = (S, context) => [
  S.listItem()
    .title('Partners')
    .icon(UsersIcon)
    .child(
      S.list()
        .title('Partners')
        .items([
          S.listItem()
            .title('Technology Partners')
            .icon(DesktopIcon)
            .child(S.documentList().title('Technology Partners').filter('_type == "techPartner"')),
        ])
    ),
  S.divider(),
  S.listItem()
    .title('Community ecosystem')
    .icon(EarthAmericasIcon)
    .child(
      S.list()
        .title('Community ecosystem')
        .items([
          S.listItem().title('Ticket Curation').icon(EnvelopeIcon).child(/*getSupportStructure()*/),
          S.listItem()
            .title('Community Contributions')
            .icon(GiftIcon)
            .child(
              S.list()
                .title('Contributions')
                .items(CONTRIBUTION_TYPES.map((type) => S.documentTypeListItem(type)))
            ),
          // feedbackStructure,
          S.listItem()
            .title('Contributions migrated from admin (needs review)')
            .icon(WarningOutlineIcon)
            .child(
              S.documentList('person')
                .title('Migrated')
                .filter('_type match "contribution.**" && cameFromAdmin == true')
            ),
          // curationStructure,
          S.listItem()
            .title('Community taxonomies')
            .icon(ConnectionIcon)
            .child(
              S.list()
                .title('Taxonomies')
                .items([
                  ...TAXONOMIES.map((type) => {
                    if (type === 'taxonomy.contributionType') {
                      // return S.documentTypeListItem(type)
                      return S.listItem().title('Contribution types').icon(GiftIcon).child(
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
                    .icon(IceCreamIcon)
                    .child(S.documentList().title('Contest').filter('_type == "taxonomy.contest"')),
                ])
            ),
          S.divider(),
          S.listItem()
            .title('People')
            .schemaType('person')
            .icon(UserIcon)
            .child(
              S.documentList('person')

                .title('People')
                .filter('_type == $type')
                .params({type: 'person'})
            ),
          S.documentListItem().id('studioTutorials').schemaType('studioTutorials').icon(RocketIcon),
          S.documentListItem()
            .id('communityBulletin')
            .schemaType('communityBulletin')
            .icon(BillIcon),
          S.documentListItem().id('landing.getStarted').schemaType('landing.getStarted'),
          S.documentListItem().id('globalSettings').schemaType('globalSettings'),
        ])
    ),
  S.divider(),
  S.listItem()
    .title('Settings')
    .icon(CogIcon)
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
                .defaultOrdering([{field: 'title', direction: 'asc'}])
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
