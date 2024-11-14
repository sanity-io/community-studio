import { Spinner } from '@sanity/ui'
import { useEffect, useState } from 'react'
import { useClient } from 'sanity'

type Tutorial = {
  state: 'loading' | 'idle'
  tutorial: any
}

export const Tutorial = ({ docId }: { docId: string }) => {
  // Simple component to open the contributor's profile on another tab
  const [status, setStatus] = useState<Tutorial>({ state: 'loading', tutorial: {} })

  const client = useClient({ apiVersion: '2022-10-31' })

  useEffect(() => {
    async function fetchTutorial() {
      const tutorial = await client.fetch('*[_type == "contribution.guide" && _id == $id][0]', {
        id: docId,
      })
      setStatus({ state: 'idle', tutorial })
    }
    fetchTutorial()
  }, [client, docId])

  if (status.state === 'loading' || !status.tutorial?.slug?.current) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '30px',
        }}
      >
        <Spinner />
      </div>
    )
  }

  return (
    <iframe
      style={{
        height: '100%',
        width: '100%',
        border: '0',
      }}
      src={`https://www.sanity.io/guides/${status.tutorial.slug.current}`}
      frameBorder={'0'}
    />
  )
}
