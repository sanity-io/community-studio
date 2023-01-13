import React from 'react';

const CustodianLink = ({document}) => {
  return document?.projectId ? (
    <a href={`https://custodian.sanity.io/projects/${document.projectId}`}>Open In Custodian</a>
  ) : null;
};

export default CustodianLink;
