import { OlistIcon, EnvelopeIcon, CheckmarkIcon } from '@sanity/icons'
import { ratings, ratingValue } from '../../schemas/documents/feedback'
import defineStructure from '../../src/utils/defineStructure'

export default defineStructure((S) =>
  S.listItem()
    .title('User feedback')
    .icon(EnvelopeIcon)
    .child(
      S.list()
        .title('Feedback')
        .items([
          S.documentTypeListItem('feedback').title('All feedback').icon(EnvelopeIcon),
          S.listItem()
            .title('Inbox')
            .id('feedback-inbox')
            .child(
              S.documentList()
                .title('Inbox')
                .menuItems(S.orderingMenuItemsForType('feedback'))
                .schemaType('feedback')
                .filter(
                  '_type == "feedback" && defined(comment) && (!defined(done) || done == false)',
                )
                .apiVersion('2023-10-18'),
            ),
          S.listItem()
            .icon(CheckmarkIcon)
            .title('Done')
            .id('feedback-by-done')
            .child(
              S.documentList()
                .title('Done')
                .menuItems(S.orderingMenuItemsForType('feedback'))
                .schemaType('feedback')
                .filter('_type == "feedback" && done == true')
                .apiVersion('2023-10-18'),
            ),
          S.listItem()
            .icon(OlistIcon)
            .title('Feedback by rating')
            .id('feedback-by-rating')
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
                          .menuItems(S.orderingMenuItemsForType('feedback'))
                          .filter(`_type == 'feedback' && rating == $rating && defined(comment)`)
                          .params({ rating: parseInt(rating, 10) })
                          .apiVersion('2023-10-18'),
                      ),
                  ),
                ),
            ),
        ]),
    ),
)
