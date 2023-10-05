import { OlistIcon, EnvelopeIcon, CheckmarkIcon } from '@sanity/icons'
import { ratings, ratingValue } from '../../schemas/documents/feedback'
import defineStructure from '../../src/utils/defineStructure'

export default defineStructure((S) =>
  S.listItem()
    .title('Answer feedback')
    .icon(EnvelopeIcon)
    .child(
      S.list()
        .title('Answer feedback')
        .items([
          S.documentTypeListItem('answerFeedback').title('All feedback').icon(EnvelopeIcon),
          S.listItem()
            .title('Inbox')
            .id('answer-feedback-inbox')
            .child(
              S.documentList()
                .title('Inbox')
                .menuItems(S.orderingMenuItemsForType('answerFeedback'))
                .schemaType('answerFeedback')
                .filter(
                  '_type == "answerFeedback" && defined(comment) && (!defined(done) || done == false)',
                ),
            ),
          S.listItem()
            .icon(CheckmarkIcon)
            .title('Done')
            .id('answer-feedback-by-done')
            .child(
              S.documentList()
                .title('Done')
                .menuItems(S.orderingMenuItemsForType('answerFeedback'))
                .schemaType('answerFeedback')
                .filter('_type == "answerFeedback" && done == true'),
            ),
          S.listItem()
            .icon(OlistIcon)
            .title('Feedback by rating')
            .id('answer-feedback-by-rating')
            .child(
              S.list()
                .title('Ratings')
                .items(
                  ratingValue.map((rating) =>
                    S.listItem()
                      .title(ratings[rating])
                      .id(`rating-list-${rating}`)
                      .child(
                        S.documentList()
                          .title(rating)
                          .menuItems(S.orderingMenuItemsForType('answerFeedback'))
                          .filter(`_type == 'answerFeedback' && rating == $rating && defined(comment)`)
                          .params({ rating: parseInt(rating, 10) }),
                      ),
                  ),
                ),
            ),
        ]),
    ),
)
