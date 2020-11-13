import React from 'react';
import S from '@sanity/desk-tool/structure-builder';
import userStore from 'part:@sanity/base/user';

import {getReferringDocumentsFromType} from '../schemas/components/referringDocuments/ReferringDocumentsView';
import adminStructure from './adminStructure';

const CONTRIBUTIONS = [
  'contribution.guide',
  'contribution.tool',
  'contribution.starter',
  'contribution.showcaseProject',
];

const currentUser = () => {
  // Get the user that is logged in
  const userSubscription = userStore.currentUser.subscribe((event) => {
    // Instead of a local variable, we use this window object as it'll be used throughout the studio
    window._sanityUser = event.user;
  });
};
currentUser();

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

const communityStructure = [
  ...CONTRIBUTIONS.map((type) => getDocumentListItem(type)),
  S.divider(),
  S.documentListItem().schemaType('person').id(window._sanityUser.id).title('Your profile'),
];

const getUserRole = () => {
  if (!window._sanityUser || !window._sanityUser.id) {
    return 'none';
  }
  return 'administrator'
  if (window._sanityUser.email && window._sanityUser.email.split('@').pop() == 'sanity.io' || window._sanityUser.email === "me@hdoro.dev") {
    return 'administrator';
  }
  return 'community';
};

/**
 * Our structure is different for administrators and community members to help the latter by decluttering the structure.
 */
export default () => {
  const role = getUserRole();
  if (role === 'administrator') {
    return S.list().title('Content').items(adminStructure);
  }
  return S.list().title('Your contributions').items(communityStructure);
};

export const getDefaultDocumentNode = ({schemaType}) => {
  if (schemaType.startsWith('taxonomy.')) {
    return S.document().views([
      S.view.form().icon(() => <>📝</>),
      // View that shows all contributions for a given taxonomy
      S.view
        .component(getReferringDocumentsFromType(CONTRIBUTIONS))
        .icon(() => <>🎁</>)
        .title(`Contributions for this ${schemaType.replace('taxonomy.', '')}`),
    ]);
  }
};
