import React, {forwardRef, useCallback, useState, useEffect} from 'react';
import {withDocument} from 'part:@sanity/form-builder';
import {Flex, Button, Spinner, Card} from '@sanity/ui';
import {FormField} from '@sanity/base/components';
import client from 'part:@sanity/base/client';
import {useId} from '@reach/auto-id';
import {PinRemovedIcon, PinIcon} from '@sanity/icons';

const sanityClient = client.withConfig({apiVersion: '2022-11-30'});

const SpinnerIcon = (
  <>
    <Flex align="center" height="fill" justify="center">
      <Spinner muted />
    </Flex>
  </>
);

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

  const refId = document._id?.startsWith('drafts.') ? document._id.slice(7) : document._id;

  const handleClick = async () => {
    if (isSavedTicket) {
      const ticket = [`savedTickets[_ref=="${refId}"]`];
      setIsPatching(true);
      await sanityClient
        .patch(profileId)
        .unset(ticket)
        .commit()
        .then(() => {
          setIsSavedTicket(false);
          setIsPatching(false);
        });
    } else {
      setIsPatching(true);
      await sanityClient
        .patch(profileId)
        .setIfMissing({savedTickets: []})
        .append('savedTickets', [{_type: 'reference', _ref: refId}])
        .commit({autoGenerateArrayKeys: true})
        .then(() => {
          setIsSavedTicket(true);
          setIsPatching(false);
        });
    }
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

  const inputId = useId();

  return (
    <FormField
      compareValue={compareValue}
      __unstable_markers={markers}
      __unstable_presence={presence}
      inputId={inputId}
    >
      <Flex justify="flex-end">
        <Button
          onFocus={onFocus}
          onBlur={onBlur}
          ref={ref}
          fontSize={1}
          onClick={handleClick}
          tone={isSavedTicket ? 'brand' : 'positive'}
          type="button"
          icon={isPatching ? SpinnerIcon : isSavedTicket ? PinRemovedIcon : PinIcon}
          text={
            isPatching ? null : isSavedTicket ? 'Remove From Saved Tickets' : 'Add to Saved Tickets'
          }
        />
      </Flex>
    </FormField>
  );
});

export default withDocument(SaveTicketButton);
