import React from 'react';
import PropTypes from 'prop-types';

export const ratings = {
  '-1': '🙁',
  0: '🙂',
  1: '🤩',
};

const RatingPreview = React.forwardRef(({value}, ref) => {
  return (
    <div ref={ref} style={{fontSize: '4em'}}>
      {ratings[value]}
    </div>
  );
});

RatingPreview.displayName = 'RatingPreview';
RatingPreview.propTypes = {
  value: PropTypes.string.isRequired,
};

export default {
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
    prepare(selection) {
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
      inputComponent: RatingPreview,
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
