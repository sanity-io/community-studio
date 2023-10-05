import {Card, Text} from '@sanity/ui';

export const ratingValue = ['-1', '0', '1'] as const;

export const ratings: any = {
  '-1': '🙁',
  0: '🙂',
  1: '🤩',
};

const FeedbackPreview = ({value}: {value: string}) => {
  return (
    <Card>
      <Text size={4}>{ratings[value]}</Text>
    </Card>
  );
};

FeedbackPreview.displayName = 'FeedbackPreview';

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
      const {title = '[No comment]', rating, answerTitle, _createdAt} = selection;

      return {
        title,
        subtitle: `${answerTitle} - ${new Date(_createdAt).toLocaleString()}`,
        media: <h1>{ratings[rating]}</h1>,
      };
    },
  },
  fields: [
    {
      title: 'Rating',
      name: 'rating',
      type: 'number',
      inputComponent: FeedbackPreview,
    },
    {
      title: 'Answer',
      name: 'answer',
      type: 'reference',
      weak: true,
      to: {type: 'editorial'},
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
};
