import S from '@sanity/desk-tool/structure-builder';
import { ratings } from '../schemas/documents/feedback';
// import { MdFeedback, MdInbox, MdCheckCircle, MdStarBorder, Fi } from 'react-icons/md'

export default S.listItem()
  .title('User feedback')
  // .icon(MdFeedback)
  .child(
    S.list()
      .title('Feedback')
      .items([
        S.documentTypeListItem('feedback').title('All feedback'),
        // .icon(MdFeedback)
        S.listItem()
          // .icon(MdInbox)
          .title('Inbox')
          .id('feedback-inbox')
          .child(
            S.documentList()
              .title('Inbox')
              .menuItems(S.orderingMenuItemsForType('feedback'))
              .schemaType('feedback')
              .filter(
                '_type == "feedback" && defined(comment) && (!defined(done) || done == false)'
              )
          ),
        S.listItem()
          // .icon(MdCheckCircle)
          .title('Done')
          .id('feedback-by-done')
          .child(
            S.documentList()
              .title('Done')
              .menuItems(S.orderingMenuItemsForType('feedback'))
              .schemaType('feedback')
              .filter('_type == "feedback" && done == true')
          ),
        S.listItem()
          // .icon(MdStarBorder)
          .title('Feedback by rating')
          .id('feedback-by-rating')
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
                        .menuItems(S.orderingMenuItemsForType('feedback'))
                        .filter(`_type == 'feedback' && rating == $rating && defined(comment)`)
                        .params({rating: parseInt(rating, 10)})
                    )
                )
              )
          ),
      ])
  );
