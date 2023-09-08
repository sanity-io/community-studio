import React from 'react';
import {useFormValue} from 'sanity';

const CustodianLink = (props) => {
  const {path} = props;
  const id = useFormValue([`${path[0]}`]).find((org) => org._key === path[1]._key).id;

  return (
    <>
      {id ? <a href={`https://custodian.sanity.io/${path[0]}/${id}`}>Open In Custodian</a> : null}
    </>
  );
};

export default CustodianLink;
