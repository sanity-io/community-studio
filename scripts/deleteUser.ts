/**
 * This script requires a local create session token in the .env file.
 * It will remove a user from the contributor group and unpublish the user profile (the latter is WIP).
 * You have to hard code the userID.
 *
 * ⚠️ Double and triple-check that you have the right userID before running this.
 *
 * Can be run with:
 * sanity exec scripts/deleteUser.ts
 */

import { getCliClient } from '@sanity/cli'
import { SanityDocument } from '@sanity/client'

const SANITY_CREATE_SESSION_TOKEN = process.env.SANITY_CREATE_SESSION_TOKEN

const USER_QUERY = `*[
  _id == $docId && $userId in members
][0]`

const CONTRIBUTOR_DOC_ID = `_.groups.contributor`

async function deleteUserByID(userId: string) {
  const client = getCliClient().withConfig({
    token: SANITY_CREATE_SESSION_TOKEN,
  })
  const doc = await client.fetch<Promise<SanityDocument>>(USER_QUERY, {
    docId: CONTRIBUTOR_DOC_ID,
    userId,
  })
  const { members } = doc ?? []
  if (members) {
    const memberIndex = members.findIndex((member) => member === userId)
    if (memberIndex < 0) {
      console.log('User not in members array. Skipping job.')
      return
    }
    try {
      const userRemovalPatch = `members[${memberIndex}]`
      console.log(`Removing user: ${userRemovalPatch}`)
      const result = await client.patch(CONTRIBUTOR_DOC_ID).unset([userRemovalPatch]).commit()
      console.log(result)
      console.log('User access removed')
    } catch (error) {
      console.error(error)
    }
  }
  return null
}

async function hideUserProfile(userId: string) {
  const client = getCliClient()
  const doc = await client.fetch<Promise<SanityDocument>>(`*[_id == $userId][0]`, { userId })
  if (doc) {
    try {
      const hideUserProfile = await client.createOrReplace({
        ...doc,
        hidden: true,
        _id: userId,
      })
      console.log('User profile is hidden')
    } catch (error) {
      console.error(error)
    } finally {
      console.log('User hiding job done.')
    }
  }
}

// TODO: Need to deal with incoming refs.
async function unpublishUserProfile(userId: string) {
  const client = getCliClient()
  const doc = await client.fetch<Promise<SanityDocument>>(`*[_id == $userId][0]`, { userId })
  if (doc) {
    try {
      const setUserProfileDraft = await client.createOrReplace({
        ...doc,
        hidden: true,
        _id: `drafts.${userId}`,
      })
      const deletePublishedProfile = await client.delete(userId)
      console.log('User profile is unpublished')
    } catch (error) {
      console.error(error)
    } finally {
      console.log('User profile job done.')
    }
  }
}

function main() {
  if (!SANITY_CREATE_SESSION_TOKEN) {
    console.log('You have to have a session token to run this script')
  }
  const userId = ''
  if (userId) {
    deleteUserByID(userId)
    hideUserProfile(userId)
    // TODO: Enable when script is done
    //unpublishUserProfile(userId)
  } else {
    console.log('You have to set an userId')
  }
}
main()
