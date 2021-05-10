import React from 'react'
import { FormField } from '@sanity/base/components'
import { Card, Button, Stack, Code } from '@sanity/ui'
import { withDocument } from 'part:@sanity/form-builder'
import client from 'part:@sanity/base/client';
import PatchEvent, { set, unset } from '@sanity/form-builder/PatchEvent'

const TYPES = {
  'contribution.guide': 'guides',
  'contribution.starter': 'create',
  'contribution.tool': 'plugins',
  'contribution.schema': 'schemas',
  'contribution.showcaseProject': 'projects'
}
const TYPES_TEXT = {
  'contribution.guide': 'guide',
  'contribution.starter': 'starter',
  'contribution.tool': 'plugin',
  'contribution.schema': 'schema',
  'contribution.showcaseProject': 'project'
}

export const TwitterShare = withDocument(
  React.forwardRef((props, ref) => {
    const { document, ...rest } = props
    console.log({ props })


    // const [tweet, setTweet] = useState('')
    const handleClick = async (event) => {
      const contributionData = await client.fetch(`*[_id == $contributionId][0]`, { contributionId: document.contribution._ref })

      const authorRefs = contributionData.authors.map(author => author._ref)
      const authorUrls = await client.fetch(`*[_id in $authors][].social.twitter`, { authors: authorRefs })
      const authorHandles = authorUrls.map(url => `@${url.split('/').pop()}`)

      const tweetString = `🎉 A new ${TYPES_TEXT[contributionData._type]} was published by ${authorHandles.join(', ')} \n\n${contributionData.title} \n\nhttps://sanity.io/${TYPES[contributionData._type]}/${contributionData.slug.current}?utm_source=twitter&utm_medium=social&utm_campaign=exchange_bot`

      props.onChange(PatchEvent.from(tweetString ? set(tweetString) : unset()))
    }

    return (
      <Stack space={2}>
        <FormField
          description={props.type.description} // creates description
          title={props.type.title} // Creates label
          __unstable_markers={props.markers} // handles all markers including validation
          __unstable_presence={props.presence} // handles presence avatars
          compareValue={props.compareValue && props.compareValue[field.name]} // handles "edited" status
        >
          {props.value &&
            <Card padding={[3, 3, 4]} radius={2} shadow={1}>
              <Code>
                {props.value}
              </Code>
            </Card>
          }
        </FormField>
        <Button
          fontSize={[1, 1, 2]}
          mode="ghost"
          padding={3}
          text="Generate Tweet"
          onClick={handleClick}
          ref={ref}
        />
      </Stack>
    )
  }
  )
)