import React, {forwardRef, useCallback, useState, useEffect} from 'react';
import {withDocument} from 'part:@sanity/form-builder';
import {FormField} from '@sanity/base/components';
import client from 'part:@sanity/base/client';

const sanityClient = client.withConfig({apiVersion: '2022-11-30'});

const SaveTicketButton = forwardRef((props, ref) => {
  const [isSavedTicket, setIsSavedTicket] = useState();
  const [profileId, setProfileId] = useState();
  const [isPatching, setIsPatching] = useState(false);

  const {
    type,
    value = '',
    markers,
    presence,
    compareValue,
    onFocus,
    onBlur,
    onChange,
    document,
  } = props;

  const refId = document._id.startsWith('drafts.') ? document._id.slice(7) : document._id;

  const handleClick = async () => {
    setIsPatching(true);
    await sanityClient
      .patch(profileId)
      .setIfMissing({savedTickets: []})
      .append('savedTickets', [{_type: 'reference', _ref: refId}])
      .commit({autoGenerateArrayKeys: true})
      .then(() => setIsSavedTicket(true));
  };

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == 'person' && (_id == $id || _id == 'drafts.' + $id)][0]{
          _id,
          'isSaved': $ticketId in savedTickets[]._ref
        }`,
        {
          ticketId: refId,
          id: window._sanityUser.id,
        }
      )
      .then((res) => {
        setIsSavedTicket(res.isSaved);
        setProfileId(res._id);
      });
  }, []);

  console.log('saved', isSavedTicket);
  return <button onClick={handleClick}>{isSavedTicket ? 'Unsave Ticket' : 'Save Ticket'}</button>;
});

export default withDocument(SaveTicketButton);
