import { PublishIcon } from '@sanity/icons'
import { useToast } from '@sanity/ui'
import { useState, useEffect } from 'react'
import {
  DocumentActionComponent,
  SanityDocument,
  Image,
  File,
  useDocumentOperation,
  useValidationStatus,
} from 'sanity'
import speakingurl from 'speakingurl'

interface Contribution extends SanityDocument {
  name: string
  title: string
  headline: string
  slug: {
    current: string
  }
  readmeUrl: string
  image: Image
  photo: Image
  projectScreenshots: Image[]
  studioScreenshots: Image[]
  schemaFiles: File[]
}

const PublishContributionAction: DocumentActionComponent = (props) => {
  const { patch, publish } = useDocumentOperation(props.id, props.type)
  const { isValidating, validation: markers } = useValidationStatus(props.id, props.type)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const toast = useToast()

  // See https://github.com/sanity-io/sanity/issues/1932 to understand the need for this
  const [canPublish, allowPublish] = useState(false)

  useEffect(() => {
    if (status === 'error') {
      toast.push({
        status: 'error',
        id: 'failed-to-publish-contribution',
        closable: true,
        title: 'Something went wrong',
        description: `Open it in a new tab and make sure it's rendering a raw text or markdown file, then try again. If this problem persists, get in touch with the Sanity team.`,
      })

      setStatus('idle')
    }
  }, [status, toast])

  useEffect(() => {
    // If the document has no changes or is already published, the publish operation will be disabled
    if (publish.disabled) {
      allowPublish(false)
      return
    }
    // Otherwise, it might be the case that the document isn't valid, so we must check validity
    if (!isValidating && Array.isArray(markers)) {
      const errorMarkers = markers.filter((marker) => marker.level !== 'warning')
      // If there are no validation markers, the document is perfect and good for publishing
      if (errorMarkers.length === 0) {
        allowPublish(true)
      } else {
        allowPublish(false)
      }
    }
  }, [publish.disabled, isValidating])

  useEffect(() => {
    // if the status was loading and the draft has changed
    // to become `null` the document has been published
    if (status === 'loading' && !props.draft) {
      // Signal that the action is completed
      props.onComplete()
    }
  }, [props.draft])

  async function onHandle() {
    // This will update the button text
    setStatus('loading')

    const document = (props.draft || props.published) as Contribution

    if (!document) {
      return
    }

    // Schemas' slugs are auto-generated and hidden from users
    if (props.type === 'contribution.schema' && !document.slug?.current) {
      const slugFriendlyId = props.id.replace('drafts.', '').split('-')[0]
      const slugFriendlyTitle = speakingurl(document.title || document.headline || '', {
        symbols: true,
      })
      patch.execute(
        [
          {
            set: {
              slug: {
                current: `${slugFriendlyTitle}-${slugFriendlyId}`,
              },
            },
          },
        ],
        {},
      )
    }

    // If no published version of the contribution and its publishedAt property isn't defined, set it as the current date and time
    if (!props.published && !document.publishedAt) {
      patch.execute(
        [
          {
            set: {
              publishedAt: new Date(Date.now()).toISOString(),
            },
          },
        ],
        {},
      )
    }

    if (props.type === 'contribution.tool') {
      const readmeUrl = (props.draft || props.published || {}).readmeUrl
      if (!readmeUrl) {
        setStatus('error')
        return
      }
      try {
        const res = await fetch(`/api/fetch-plugin-readme?readmeUrl=${readmeUrl}`)
        const { file } = await res.json()

        if (typeof file === 'string') {
          // Set the readme file
          patch.execute([{ set: { readme: file } }])
        } else {
          // When erroing out, props.onComplete will be called by the popover or Snackbar above ;)
          setStatus('error')
        }
      } catch (error) {
        setStatus('error')
      }
    }

    // Perform the publish, the effect above will deal with it when its done
    publish.execute()
    // And request the back-end to generate an OG image for this contribution
  }

  const disabled =
    !canPublish || publish.disabled !== false || status === 'loading' || status === 'error'

  return {
    disabled,
    label: status === 'loading' ? 'Publishing…' : 'Publish',
    icon: PublishIcon,
    shortcut: disabled ? null : 'Ctrl+Alt+P',
    onHandle,
  }
}

export default PublishContributionAction
