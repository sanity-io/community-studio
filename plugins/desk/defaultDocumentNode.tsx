import { DefaultDocumentNodeResolver } from 'sanity/desk'
import FeedbackEntries from '../../schemas/components/FeedbackEntries'
import {StarterHelperView} from '../../schemas/components/starterHelper/StarterHelperView'
import ReferringDocumentsView from '../../schemas/components/referringDocuments/ReferringDocumentsView'
import ThreadPreview from '../../schemas/components/threadPreview'
import { CONTRIBUTION_TYPES } from './adminStructure'

export const getDefaultDocumentNode: DefaultDocumentNodeResolver = (S, { schemaType }) => {
  if (schemaType.startsWith('taxonomy.')) {
    return S.document().views([
      S.view.form().icon(() => <>📝</>),
      // View that shows all contributions for a given taxonomy
      S.view
        .component((props) => <ReferringDocumentsView {...props} type={CONTRIBUTION_TYPES} />)
        .icon(() => <>🎁</>)
        .title(`Contributions for this ${schemaType.replace('taxonomy.', '')}`),
    ])
  }

  if (schemaType == 'ticket') {
    return S.document().views([S.view.form(), S.view.component(ThreadPreview).title('Thread')])
  }

  if (schemaType.startsWith('contribution.') || schemaType === 'person') {
    return S.document().views([
      S.view.form().icon(() => <>📝</>),
      ...(schemaType.startsWith('contribution.')
        ? [
            S.view
              .component(FeedbackEntries)
              .icon(() => <>💬</>)
              .title('Feedback'),
          ]
        : []),
        ...(schemaType === 'contribution.starter'
        ? [
            S.view
              .component(StarterHelperView)
              .icon(() => <>🤖</>)
              .title('Helpers'),
          ]
        : []),
    ])
  }
}
