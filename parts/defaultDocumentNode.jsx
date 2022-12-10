export const getDefaultDocumentNode = (S, {schemaType}) => {
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
  if (schemaType == 'ticket') {
    return S.document().views([S.view.form(), S.view.component(ThreadPreview).title('Thread')]);
  }
  if (schemaType.startsWith('contribution.') || schemaType === 'person') {
    return S.document().views([
      S.view.form().icon(() => <>📝</>),
      // View that shows all contributions for a given taxonomy
      S.view
        .component(WebPreview)
        .icon(() => <>💻</>)
        .title('Desktop preview'),
      S.view
        .component(MobilePreview)
        .icon(() => <>📱</>)
        .title('Mobile preview'),
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
