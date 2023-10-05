import {
  OkHandIcon,
  CloseCircleIcon,
  CheckmarkCircleIcon,
  StarIcon,
  HelpCircleIcon,
  DocumentRemoveIcon,
} from '@sanity/icons';
import { HourGlassIcon } from '../../schemas/components/icons/HourGlassIcon';

export default (S, context) =>
  S.listItem()
    .title('Curated contributions')
    .icon(OkHandIcon)
    .child(
      S.list()
        .title('Curated contributions')
        .items([
          S.listItem().title('Pending approval').icon(HourGlassIcon).child(
            S.documentList()
              .schemaType('curatedContribution')
              .title('Pending approval')
              .filter('_type == "curatedContribution" && !defined(approved)')
              .menuItems([])
              // We remove initialValueTemplates to hide the "Create new" action menu from the list
              .initialValueTemplates([])
          ),
          S.listItem()
            .title('Rejected')
            .icon(CloseCircleIcon)
            .child(
              S.documentList()
                .schemaType('curatedContribution')
                .title('Rejected')
                .filter('_type == "curatedContribution" && approved == false')
                .menuItems([])
                .initialValueTemplates([])
            ),
          S.listItem()
            .title('Approved')
            .icon(CheckmarkCircleIcon)
            .child(
              S.documentList()
                .schemaType('curatedContribution')
                .title('Approved')
                .filter('_type == "curatedContribution" && approved == true')
                .menuItems([])
                .initialValueTemplates([])
            ),
          S.listItem()
            .title('Featured')
            .icon(StarIcon)
            .child(
              S.documentList()
                .schemaType('curatedContribution')
                .title('Featured')
                .filter('_type == "curatedContribution" && featured == true')
                .menuItems([])
                .initialValueTemplates([])
            ),
          S.listItem()
            .title('Curation document not created')
            .icon(HelpCircleIcon)
            .child(
              S.documentList()
                .title('Curation document not created')
                .filter(
                  '!(_id in path("drafts.**")) && _type match "contribution.**" && count(*[_type == "curatedContribution" && contribution._ref == ^._id]) == 0'
                )
                .menuItems([])
                .initialValueTemplates([])
                .child((_id) =>
                  S.document()
                    .schemaType('curatedContribution')
                    .id(`curated.${_id}`)
                    .documentId(`curated.${_id}`)
                    .initialValueTemplate('create-curatedContribution', { contributionId: _id })
                )
            ),
          S.listItem()
            .title('Contribution document inexistent/deleted')
            .icon(DocumentRemoveIcon)
            .child(
              S.documentList()
                .title('Contribution document nonexistent/deleted')
                .schemaType('curatedContribution')
                .filter(
                  '!(_id in path("drafts.**")) && _type == "curatedContribution" && !defined(contribution->)'
                )
                .menuItems([])
                .initialValueTemplates([])
            ),
          S.divider(),
          S.documentTypeListItem('curatedContribution').title('All').icon(OkHandIcon),
        ])
    );
