import React from 'react';
import S from '@sanity/desk-tool/structure-builder';
import userStore from 'part:@sanity/base/user';
import {useRouter} from 'part:@sanity/base/router';
import tools from 'all:part:@sanity/base/tool';

import {getReferringDocumentsFromType} from '../schemas/components/referringDocuments/ReferringDocumentsView';
import getAdminStructure from './adminStructure';
import {getCommunityStructure, CONTRIBUTIONS} from './communityStructure';
import {MobilePreview, WebPreview} from '../schemas/components/Preview';
import Clearscope from '../schemas/components/clearscope';
import FeedbackEntries from '../schemas/components/FeedbackEntries';

const getUserRole = (user = window._sanityUser) => {
  // For developing the desk structure:
  // return 'community'
  // return 'administrator'

  if (!user || !user.id) {
    return 'none';
  }
  if (user.email && user.email.split('@').pop() == 'sanity.io') {
    return 'administrator';
  }
  return 'community';
};

const getCurrentUser = () => {
  // Get the user that is logged in
  const userSubscription = userStore.me.subscribe((user) => {
    console.log('User changed', user);
    if (user) {
      // Instead of a local variable, we use this window object as it'll be used throughout the studio
      window._sanityUser = {
        ...user,
        role: getUserRole(user),
      };

      // If the current user is a community member, hide the other studio tools from their view to provide a more streamlined experience
      if (user.role === 'community') {
        // splice mutates the original array, hence why we're using it here
        tools.splice(1);
      }
    } else {
      window._sanityUser = undefined;
    }
  });
};
getCurrentUser();

/**
 * Our structure is different for administrators and community members to help the latter by decluttering the structure.
 */
export default () => {
  // As specified in /static/auth/login.html, we'll redirect users that contain an originPath property in localStorage
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

  if (window._sanityUser?.role === 'administrator') {
    return S.list()
      .title('Content')
      .items([...getAdminStructure(), S.divider(), ...getCommunityStructure()]);
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
  if (schemaType.startsWith('contribution.') || schemaType === 'person') {
    return S.document().views([
      S.view.form().icon(() => <>📝</>),
      // View that shows all contributions for a given taxonomy
      // S.view
      //   .component(WebPreview)
      //   .icon(() => <>💻</>)
      //   .title('Desktop preview'),
      // S.view
      //   .component(MobilePreview)
      //   .icon(() => <>📱</>)
      //   .title('Mobile preview'),
      ...(schemaType.startsWith('contribution.')
        ? [
            S.view
              .component(FeedbackEntries)
              .icon(() => <>💬</>)
              .title('Feedback'),
          ]
        : []),
      ...(schemaType === 'contribution.guide'
        ? [
            S.view
              .component(Clearscope)
              .icon(() => <>🔍</>)
              .title('SEO Analysis'),
          ]
        : []),
    ]);
  }
};
