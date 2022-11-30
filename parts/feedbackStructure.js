import S from '@sanity/desk-tool/structure-builder';
import DoneIcon from '../schemas/components/icon/DoneIcon';
import MessageCircleIcon from '../schemas/components/icon/MessageCircleIcon';
import {ratings} from '../schemas/documents/feedback';
// import { MdFeedback, MdInbox, MdCheckCircle, MdStarBorder, Fi } from 'react-icons/md'
import InboxIcon from '../schemas/components/icon/InboxIcon';
import {OlistIcon} from '@sanity/icons';

export default S.listItem()
  .title('User feedback')
  .icon(MessageCircleIcon)
  .child(
    S.list()
      .title('Feedback')
      .items([
        S.documentTypeListItem('feedback').title('All feedback').icon(MessageCircleIcon),
        S.listItem()
          .icon(InboxIcon)
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
          .icon(DoneIcon)
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
          .icon(OlistIcon)
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
