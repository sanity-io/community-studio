import { Box, Text, Flex, Spinner, useToast } from '@sanity/ui'
import { ComponentType, ComponentProps, useEffect } from 'react'
import { UserViewComponent } from 'sanity/desk'
import { useListeningQuery } from 'sanity-plugin-utils'
import ReferringDocumentsList, { Document } from './ReferringDocumentsList'

const typelessQuery = `
 *[references($id) && !(_id in path("drafts.*"))]
`

const typefulQuery = `
 *[references($id) && !(_id in path("drafts.*")) && _type in $types]
`

interface Props extends ComponentProps<UserViewComponent> {
  types: string[]
}

const ReferringDocumentsView: ComponentType<Props> = ({ document, types = [] }) => {
  const toast = useToast()

  const { data, loading, error } = useListeningQuery<Document[]>(
    types.length ? typefulQuery : typelessQuery,
    {
      params: {
        id: document.displayed._id ?? '',
        types,
      },
    },
  )

  useEffect(() => {
    if (error) {
      toast.push({
        status: 'error',
        id: `failed-to-load-taxonomy-contributions-` + types.join('-'),
        closable: true,
        title: 'An error occurred while loading contributions',
      })
    }
  }, [error, toast, types])

  if (!document?.displayed?._id) {
    return null
  }

  if (loading) {
    return (
      <Flex align="center" direction="column" gap={3} height="fill" justify="center">
        <Spinner muted />
        <Text muted size={1}>
          Loading&hellip;
        </Text>
      </Flex>
    )
  }

  if (!data) {
    return null
  }

  return <Box padding={3}>{data && <ReferringDocumentsList documents={data} />}</Box>
}

export default ReferringDocumentsView
