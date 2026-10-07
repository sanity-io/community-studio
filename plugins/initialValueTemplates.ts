import { InitialValueResolverContext, Template } from 'sanity'

export const initialValueTemplates = (prev, context: InitialValueResolverContext) => {
  const { currentUser, getClient } = context
  const client = getClient({ apiVersion: '2024-01-15' })

  if (currentUser?.role == 'administrator') {
    const communitySupportHighlightTemplate = {
      id: 'communitySupportHighlight',
      name: 'Community Support Highlight',
      schemaType: 'contribution.guide',
      value: async () => {
        const authorId = await client.fetch(`*[_id == $id || _id == 'drafts.' + $id][0]._id`, {
          id: currentUser.id,
        })

        return {
          authors: [{ _type: 'reference', _ref: authorId }],
          title: `Community Support Highlight ${new Date().toLocaleDateString()}`,
        }
      },
    }

    return [...prev, communitySupportHighlightTemplate]
  }

  return prev
}
