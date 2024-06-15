import { ComponentType } from 'react'
import { Card, Text } from '@sanity/ui'
import { DefaultPreviewProps, defineField, PreviewProps } from 'sanity'

export const ratingValue = ['-1', '0', '1'] as const

export const ratings: Record<string, string> = {
  '-1': '🙁',
  '0': '🙂',
  '1': '🤩',
}

// Define a type for the keys of the ratings object
type RatingKey = keyof typeof ratings

// Define the props type for the FeedbackPreview component
export type FeedbackPreviewProps = {
  rating: RatingKey
}

// @ts-expect-error
const FeedbackPreview = ({ rating }: ComponentType<PreviewProps<FeedbackPreviewProps>>) => {
  return (
    <Card>
      <Text size={4}>{ratings[rating]}</Text>
    </Card>
  )
}

export const answerFeedback = {
  title: 'Answer feedback',
  name: 'answerFeedback',
  type: 'document',
  preview: {
    select: {
      title: 'comment',
      answerTitle: 'answer.editorialTitle',
      rating: 'rating',
      _createdAt: '_createdAt',
    },
    prepare(selection: any) {
      const { title = '[No comment]', rating, answerTitle, _createdAt } = selection

      return {
        title,
        subtitle: `${answerTitle} - ${new Date(_createdAt).toLocaleString()}`,
        media: <h1>{ratings[rating]}</h1>,
      }
    },
  },
  fields: [
    defineField({
      title: 'Rating',
      name: 'rating',
      type: 'number',
      components: {
        // @ts-expect-error
        preview: FeedbackPreview,
      },
      preview: {
        select: {
          rating: 'rating',
        },
      },
    }),
    defineField({
      title: 'Answer',
      name: 'answer',
      type: 'reference',
      weak: true,
      to: { type: 'editorial' },
    }),
    defineField({
      title: 'Comment',
      name: 'comment',
      type: 'text',
      description: 'Comment submitted from sanity.io',
    }),
    defineField({
      name: 'done',
      type: 'boolean',
      title: 'Is this feedback dealt with?',
    }),
    defineField({
      name: 'notes',
      type: 'text',
      title: 'Internal notes',
      description: 'What did we do with this feedback?',
    }),
  ],
}
