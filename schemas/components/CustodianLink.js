import React from 'react';

const CustodianLink = ({parent}) => {
  return parent.id ? (
    <a href={`https://custodian.sanity.io/projects/${parent.id}`}>Open In Custodian</a>
  ) : null;
};

export default CustodianLink;
