import { PinRemovedIcon, PinIcon } from '@sanity/icons'
import { Flex, Button, Spinner } from '@sanity/ui'
import React, { useState, useEffect } from 'react'
import { useFormValue, useCurrentUser } from 'sanity'
//V3FIXME
import { useSanityClient } from '../../src/hooks/useSanityClient'

const SpinnerIcon = (
  <>
    <Flex align="center" height="fill" justify="center">
      <Spinner muted />
    </Flex>
  </>
)

const SaveTicketButton = (props) => {
  const [isSavedTicket, setIsSavedTicket] = useState<boolean>()
  const [profileId, setProfileId] = useState()
  const [isPatching, setIsPatching] = useState(false)
  const documentId = useFormValue(['_id']) as string
  const currentUser = useCurrentUser()

  const sanityClient = useSanityClient()

  const { id, focusRef, onBlur, onFocus, readOnly } = props
  const fwdProps = { id, ref: focusRef, onBlur, onFocus, readOnly }

  const refId = documentId?.startsWith('drafts.') ? documentId.slice(7) : documentId

  const handleClick = async () => {
    if (isSavedTicket) {
      const ticket = [`savedTickets[_ref=="${refId}"]`]
      setIsPatching(true)
      await sanityClient
        .patch(profileId)
        .unset(ticket)
        .commit()
        .then(() => {
          setIsSavedTicket(false)
          setIsPatching(false)
        })
    } else {
      setIsPatching(true)
      await sanityClient
        .patch(profileId)
        .setIfMissing({ savedTickets: [] })
        .append('savedTickets', [{ _type: 'reference', _ref: refId }])
        .commit({ autoGenerateArrayKeys: true })
        .then(() => {
          setIsSavedTicket(true)
          setIsPatching(false)
        })
    }
  }

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == 'person' && (_id == $id || _id == 'drafts.' + $id)][0]{
          _id,
          'isSaved': $ticketId in savedTickets[]._ref
        }`,
        {
          ticketId: refId,
          id: currentUser.id,
        },
      )
      .then((res) => {
        setIsSavedTicket(res.isSaved)
        setProfileId(res._id)
      })
  }, [])

  return (
    <Flex justify="flex-start">
      <Button
        {...fwdProps}
        fontSize={1}
        onClick={handleClick}
        tone={isSavedTicket ? 'primary' : 'positive'}
        type="button"
        icon={isPatching ? SpinnerIcon : isSavedTicket ? PinRemovedIcon : PinIcon}
        text={
          isPatching ? null : isSavedTicket ? 'Remove From Saved Tickets' : 'Add to Saved Tickets'
        }
      />
    </Flex>
  )
}

export default SaveTicketButton
