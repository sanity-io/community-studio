import React from 'react';
//V3FIXME
//This currently only shows an error when opening the pane
import {resolveProductionUrl} from '../../plugins/resolveProductionUrl';
import styles from './Preview.module.css';
import SanityMobilePreview from 'sanity-mobile-preview';
import 'sanity-mobile-preview/dist/index.css?raw';

const ErrorDisplay = ({message = 'Fill all the required fields before accessing the preview'}) => {
  return (
    <div className={styles.errorContainer}>
      <p>{message}</p>
    </div>
  );
};

const getURL = (displayed) => {
  switch (displayed.deploymentType) {
    case 'sanityCreate':
      return resolveProductionUrl(displayed);
    case 'vercel':
      return displayed.vercelDeployLink;
    default:
      return undefined;
  }
};

const Preview = ({document, isMobile}) => {
  const displayed = document?.displayed || {};
  let url = resolveProductionUrl(null, {document: document.displayed});

  if (!url && displayed._type === 'contribution.schema') {
    return (
      <ErrorDisplay
        message={`In order to preview your schema, you'll need to publish it first. You can use the "👀 Hide this Schema?" field while you're working on it.`}
      />
    );
  }
  if (!url) {
    return <ErrorDisplay />;
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
  );
};

export const WebPreview = ({document}) => {
  return <Preview document={document} />;
};

export const MobilePreview = ({document}) => {
  return <Preview document={document} isMobile={true} />;
};
