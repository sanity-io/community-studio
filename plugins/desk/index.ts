import React from 'react';
import {useRouter} from 'sanity/router';
import getAdminStructure from './adminStructure';
import {getCommunityStructure} from './communityStructure';
import {getCommunitySupportStructure} from './supportStructure';

/**
 * Our structure is different for administrators and community members to help the latter by decluttering the structure.
 */
export const structure = (S, context) => {
  const {currentUser} = context;

  // // As specified in /static/auth/login.html, we'll redirect users that contain an originPath property in localStorage
  const originPath = localStorage.getItem('originPath');
  if (originPath) {
    localStorage.removeItem('originPath');

    if (window.location.pathname !== originPath) {
      // As we don't have access to router.navigateUrl without useRouter, we need to create a React component to access the latter
      return S.component()
        .id('root')
        .component(() => {
          const router = useRouter();

          React.useEffect(() => {
            // With this, we can finally navigateUrl to originPath
            // Once in originPath, this function will run again, this time with the localStorage entry deleted, rendering the desired target.
            if (router) {
              router.navigateUrl(originPath);
            }
          }, [router]);
          return null;
        });
    }
  }
  if (currentUser.email.endsWith('@sanity.io')) {
    return S.list()
      .title('Content')
      .items([...getAdminStructure(S, context), S.divider(), ...getCommunityStructure(S, context)]);
  }

  return S.list()
    .title('Your contributions')
    .items([
      getCommunitySupportStructure(S, context),
      S.divider(),
      ...getCommunityStructure(S, context),
    ]);
};

//
