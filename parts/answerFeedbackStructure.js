import S from '@sanity/desk-tool/structure-builder';
import {ratings} from '../schemas/documents/answerFeedback';
// import { MdFeedback, MdInbox, MdCheckCircle, MdStarBorder, Fi } from 'react-icons/md'

export default S.listItem()
  .title('Answer feedback')
  // .icon(MdFeedback)
  .child(
    S.list()
      .title('Answer feedback')
      .items([
        S.documentTypeListItem('answerFeedback').title('All feedback'),
        // .icon(MdFeedback)
        S.listItem()
          // .icon(MdInbox)
          .title('Inbox')
          .id('answer-feedback-inbox')
          .child(
            S.documentList()
              .title('Inbox')
              .menuItems(S.orderingMenuItemsForType('answerFeedback'))
              .schemaType('answerFeedback')
              .filter(
                '_type == "answerFeedback" && defined(comment) && (!defined(done) || done == false)'
              )
          ),
        S.listItem()
          // .icon(MdCheckCircle)
          .title('Done')
          .id('answer-feedback-by-done')
          .child(
            S.documentList()
              .title('Done')
              .menuItems(S.orderingMenuItemsForType('answerFeedback'))
              .schemaType('answerFeedback')
              .filter('_type == "answerFeedback" && done == true')
          ),
        S.listItem()
          // .icon(MdStarBorder)
          .title('Feedback by rating')
          .id('answer-feedback-by-rating')
          .child(
            S.list()
              .title('Ratings')
              .items(
                Object.keys(ratings).map((rating) =>
                  S.listItem()
                    .title(ratings[rating])
                    .id(`rating-list-${rating}`)
                    .child(
                      S.documentList()
                        .title(rating)
                        .menuItems(S.orderingMenuItemsForType('answerFeedback'))
                        .filter(
                          `_type == 'answerFeedback' && rating == $rating && defined(comment)`
                        )
                        .params({rating: parseInt(rating, 10)})
                    )
                )
              )
          ),
      ])
  );
