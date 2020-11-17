import React from 'react';
import S from '@sanity/desk-tool/structure-builder';
import userStore from 'part:@sanity/base/user';

import {getReferringDocumentsFromType} from '../schemas/components/referringDocuments/ReferringDocumentsView';
import getAdminStructure from './adminStructure';
import { getCommunityStructure, CONTRIBUTIONS } from './communityStructure';


const getCurrentUser = () => {
  // Get the user that is logged in
  const userSubscription = userStore.currentUser.subscribe((event) => {
    // Instead of a local variable, we use this window object as it'll be used throughout the studio
    window._sanityUser = event.user;
    console.log(event)
  });
};
getCurrentUser();

const getUserRole = () => {
  // For developing the desk structure:
  // return 'community'
  // return 'administrator'
  
  if (!window._sanityUser || !window._sanityUser.id) {
    return 'none';
  }
  if (window._sanityUser.email && window._sanityUser.email.split('@').pop() == 'sanity.io') {
    return 'administrator';
  }
  return 'community';
};

/**
 * Our structure is different for administrators and community members to help the latter by decluttering the structure.
 */
export default () => {
  const role = getUserRole();
  console.log({ role, user: window._sanityUser })
  if (role === 'administrator') {
    return S.list().title('Content').items(getAdminStructure());
  }
  return S.list().title('Your contributions').items(getCommunityStructure());
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
