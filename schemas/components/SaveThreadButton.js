import React, {forwardRef, useCallback, useState, useEffect} from 'react';
import {withDocument} from 'part:@sanity/form-builder';
import {FormField} from '@sanity/base/components';
import client from 'part:@sanity/base/client';

const sanityClient = client.withConfig({apiVersion: '2022-11-30'});

const SaveTicketButton = forwardRef((props, ref) => {
  const [isSavedTicket, setIsSavedTicket] = useState();

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

  console.log('refId', refId);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == 'person' && (_id == $id || _id == 'drafts.' + $id) && references($ticketId)]`,
        {
          ticketId: refId,
          id: window._sanityUser.id,
        }
      )
      .then((res) => setIsSavedTicket(res.length > 0));
  }, []);

  console.log('saved', isSavedTicket);
  return <button>{isSavedTicket ? 'Unsave Ticket' : 'Save Ticket'}</button>;
});

export default withDocument(SaveTicketButton);
