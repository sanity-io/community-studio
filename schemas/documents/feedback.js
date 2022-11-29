import React from 'react';
import PropTypes from 'prop-types';
import contributions from './contributions';

export const ratings = {
  '-2': 'Broken 💔',
  '-1': '🙁',
  0: '🙂',
  1: '🤩',
};

const FeedbackPreview = React.forwardRef(({value}, ref) => {
  return (
    <div ref={ref} style={{fontSize: '4em'}}>
      {ratings[value]}
    </div>
  );
});

FeedbackPreview.displayName = 'FeedbackPreview';
FeedbackPreview.propTypes = {
  value: PropTypes.string.isRequired,
};

export default {
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
    prepare(selection) {
      const {title = '[No comment]', rating, contributionTitle, _createdAt} = selection;

      return {
        title,
        subtitle: `${contributionTitle} - ${new Date(_createdAt).toLocaleString()}`,
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
};
