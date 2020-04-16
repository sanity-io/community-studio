import S from '@sanity/desk-tool/structure-builder'

const hiddenDocTypes = listItem =>
  ![
    'person',
    'ticket'
  ].includes(listItem.getId())

export default () =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Tickets')
        .schemaType('ticket')
        .child(
          S.documentList('ticket')
            .title('Tickets')
            .filter('_type == $type')
            .params({ type: 'ticket' })
        ),
      S.listItem()
        .title('Persons')
        .schemaType('person')
        .child(
          S.documentList('person')
            .title('Persons')
            .filter('_type == $type')
            .params({ type: 'person' })
        ),
      ...S.documentTypeListItems().filter(hiddenDocTypes)
    ])
