import { Card, Text } from '@sanity/ui'
import { guide } from '../documents/contributions/guide'
import { schema } from '../documents/contributions/schema'
import { showcaseProject } from '../documents/contributions/showcaseProject'
import { starter } from '../documents/contributions/starter'
import { tool } from '../documents/contributions/tool'

const contributions = [guide, schema, showcaseProject, starter, tool]

export const ratingValue = ['-2', '-1', '0', '1'] as const

export const ratings: any = {
  '-2': 'Broken 💔',
  '-1': '🙁',
  0: '🙂',
  1: '🤩',
}

const FeedbackPreview = ({ value }: { value: string }) => {
  return (
    <Card>
      <Text size={4}>{ratings[value]}</Text>
    </Card>
  )
}

FeedbackPreview.displayName = 'FeedbackPreview'

export const feedback = {
  title: 'Feedback',
  name: 'feedback',
  type: 'document',
  preview: {
    select: {
      title: 'comment',
      contributionTitle: 'contribution.title',
      rating: 'rating',
      _createdAt: '_createdAt',
    },
    prepare(selection: any) {
      const { title = '[No comment]', rating, contributionTitle, _createdAt } = selection

      return {
        title,
        subtitle: `${contributionTitle} - ${new Date(_createdAt).toLocaleString()}`,
        media: <h1>{ratings[rating]}</h1>,
      }
    },
  },
  fields: [
    {
      title: 'Rating',
      name: 'rating',
      type: 'number',
      components: {
        preview: FeedbackPreview,
      },
    },
    {
      title: 'Contribution',
      name: 'contribution',
      type: 'reference',
      weak: true,
      to: contributions.map((type) => ({
        type: type.name,
      })),
    },
    {
      title: 'Comment',
      name: 'comment',
      type: 'text',
      description: 'Comment submitted from sanity.io',
    },
    {
      name: 'done',
      type: 'boolean',
      title: 'Is this feedback dealt with?',
    },
    {
      name: 'notes',
      type: 'text',
      title: 'Internal notes',
      description: 'What did we do with this feedback?',
    },
  ],
}
