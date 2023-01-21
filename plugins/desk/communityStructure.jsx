import React from 'react';
import {EyeOpenIcon, HelpCircleIcon, PackageIcon, AddIcon, UserIcon} from '@sanity/icons';
import {Spinner} from '@sanity/ui';
import {useRouter} from 'sanity/router';
import {CONTRIBUTION_TYPES} from './adminStructure';
import {resolveProductionUrl} from '../resolveProductionUrl';
import Tutorial from '../../schemas/components/tutorial/Tutorial';
import {getCommunitySupportStructure} from './supportStructure';

/**
 * Gets a personalized document list for the currently logged user
 */
function getDocumentListItem(S, context, type) {
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
        .params({userId: context.currentUser.id, type})
        .menuItems([
          {
            title: 'Create new',
            icon: AddIcon,
            intent: {
              type: 'create',
              params: {
                type: type,
                template: type,
              },
            },
            showAsAction: true,
          },
          ...defaultDocList.getMenuItems(),
        ])
    );
}

/**
 * This is a function instead of a plain array to make sure we get the freshest window._sanityUser
 */
export const getCommunityStructure = (S, context) => [
  ...CONTRIBUTION_TYPES.map((type) => getDocumentListItem(S, context, type)),
  S.divider(),
  S.listItem()
    .title('All your contributions')
    .icon(PackageIcon)
    .id('all')
    .child(
      S.documentList()
        .id('all')
        .title('All your contributions')
        .filter('_type match "contribution.**" && $userId in authors[]._ref')
        .params({userId: context.currentUser.id})
    ),
  S.documentListItem()
    .schemaType('person')
    .id(context.currentUser.id)
    .title('Your profile')
    .icon(UserIcon),
  S.listItem()
    .title('See your profile live')
    .icon(EyeOpenIcon)
    .child(
      S.component()
        .id('profile-preview')
        .component(() => {
          // Simple component to open the contributor's profile on another tab
          const [status, setStatus] = React.useState({state: 'loading'});
          const router = useRouter();

          async function fetchContributor() {
            const person = await client.fetch('*[_type == "person" && _id == $id][0]', {
              id: context.currentUser.id,
            });
            setStatus({state: 'idle', person});
          }

          React.useEffect(() => {
            setStatus({state: 'loading'});
            fetchContributor();
          }, []);

          React.useEffect(() => {
            if (status.person?.handle?.current) {
              const url = resolveProductionUrl(status.person);

              // Open their profile in the Sanity site
              window.open(url, '_blank');
              // And go back to the person's profile
              router.navigateIntent('edit', {id: context.currentUser.id});
            }
          }, [status.person]);

          if (status.state === 'loading' || status.person?.handle?.current) {
            return (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '30px',
                }}
              >
                <Spinner />
              </div>
            );
          }

          // @TODO: improve error handling with an IntentLink to edit their profile
          return (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <h1 style={{margin: 0}}>Your profile isn't published yet</h1>
              <p>You can do so by clicking on it in the sidebar :)</p>
            </div>
          );
        })
    ),

  S.divider(),
  S.listItem()
    .id('help')
    .icon(HelpCircleIcon)
    .title('Help')
    .child(
      S.documentList()
        .id('tutorials')
        .title('Tutorials')
        .filter(
          /* groq */ `_type == "contribution.guide" && _id in *[_id == "studioTutorials"][0].chosenGuides[]._ref`
        )
        .child((docId) =>
          S.component()
            .id(docId)
            .component(() => <Tutorial docId={docId} />)
        )
    ),
];
