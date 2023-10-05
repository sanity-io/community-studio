import React from 'react'
//V3FIXME
//This currently only shows an error when opening the pane
import SanityMobilePreview from 'sanity-mobile-preview'
import { resolveProductionUrl } from '../../plugins/resolveProductionUrl'
import styles from './Preview.module.css'
import 'sanity-mobile-preview/dist/index.css?raw'

const ErrorDisplay = ({
  message = 'Fill all the required fields before accessing the preview',
}) => {
  return (
    <div className={styles.errorContainer}>
      <p>{message}</p>
    </div>
  )
}

const Preview = ({ document, isMobile }) => {
  const displayed = document?.displayed || {}
  const url = resolveProductionUrl(null, { document: displayed })

  if (!url) {
    return <ErrorDisplay />
  }

  return (
    <div className={styles.iframeContainer}>
      {isMobile ? (
        <SanityMobilePreview>
          <div className={styles.iframeContainer}>
            <iframe src={url} frameBorder={'0'} />
          </div>
        </SanityMobilePreview>
      ) : (
        <iframe src={url} frameBorder={'0'} />
      )}
    </div>
  )
}

export const WebPreview = ({ document }) => {
  return <Preview document={document} />
}

export const MobilePreview = ({ document }) => {
  return <Preview document={document} isMobile={true} />
}
