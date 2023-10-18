import unescape from 'lodash/unescape'
import React from 'react'
import Markdown from 'react-markdown'
import { Card, Flex, Inline, Stack, Label, Box } from '@sanity/ui'

interface ThreadPreviewProps {
  document: {
    displayed: {
      thread: Array<{
        _key: string
        author: {
          slackId: string
          slackName: string
          isSanity: boolean
        }
        content: string
        timestamp: number
      }>
    }
  }
}

export function ThreadPreview({ document }: ThreadPreviewProps) {
  const { displayed } = document
  const { thread } = displayed

  return (
    <div>
      {thread &&
        thread.map(({ _key, author, content, timestamp }, index) => (
          <Card tone={author.isSanity ? 'primary' : 'positive'} key={_key} padding={2} margin={2}>
            <Stack>
              <Flex justify={'space-between'}>
                <Box>
                  <Inline>
                    <Label>👤{author.slackName}:</Label>
                    {author.isSanity ? <Label>Staff</Label> : null}
                  </Inline>
                </Box>
                <Box>
                  <Label>({new Date(timestamp * 1000).toDateString()})</Label>
                </Box>
              </Flex>
              <Markdown>{unescape(content)}</Markdown>
            </Stack>{' '}
          </Card>
        ))}
      {/* <pre>{JSON.stringify(displayed, null, 2)}</pre> */}
    </div>
  )
}
