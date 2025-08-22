import { DuplicateDocumentActionComponent } from 'sanity'

export function createDuplicateWithoutSlugAction(
  originalAction: DuplicateDocumentActionComponent,
): DuplicateDocumentActionComponent {
  return function DuplicateWithoutSlugAction(props) {
    return originalAction({
      ...props,
      mapDocument: ({ slug, ...document }) => document,
    })
  }
}