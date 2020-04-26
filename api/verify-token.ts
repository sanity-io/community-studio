require('dotenv').config()
import {google} from 'googleapis'
import crypto from 'crypto'
import fetch from 'node-fetch'
import sanityClient from '@sanity/client'
import {NowRequest, NowResponse} from '@now/node'

const client = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

const sessionClient = client.config({
  token: process.env.SANITY_CREATE_SESSION_TOKEN,
})

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.URL
)

const userIdFromEmail = (email) => {
  let hash = crypto.createHash('md5').update(email).digest('hex')
  return `e-${hash}`
}

const userFromTicket = (ticket) => {
  const sessionExpires = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()

  const userId = userIdFromEmail(ticket.payload.email)

  return {
    userId,
    userFullName: ticket.payload.name, //the user's full name.
    userEmail: ticket.payload.email, // the user's email address.
    userImage: ticket.payload.picture, //optional HTTPS URL to the user's profile image.
    userRole: 'administrator', //If the user should be able to log into the Sanity Studio, role must be either administrator or editor
    sessionExpires, //ISO timestamp for when the session should expire.
    sessionLabel: 'SSO', //optional label for the session.
  }
}

const baseGroup = {
  _id: '_.groups.agent',
  _type: 'system.group',
  grants: [
    {
      filter: "_type == 'ticket'",
      permissions: ['read', 'update'],
    },
    {
      filter: "_type == 'user'",
      permissions: ['read'],
    },
  ],
  members: [],
}

export default async (req: NowRequest, res: NowResponse) => {
  const requestBody = req.body
  const ticket = await oAuth2Client
    .verifyIdToken({
      idToken: requestBody.token,
      audience: process.env.CLIENT_ID,
    })
    .catch((error) => console.error(error))

  if (!ticket.payload.hd === 'sanity.io') {
    return {
      statusCode: 401,
      body: JSON.stringify({
        msg: 'Unauthorized',
      }),
    }
  }

  const url = `https://${process.env.SANITY_PROJECT_ID}.api.sanity.io/v1/auth/thirdParty/session`
  const user = userFromTicket(ticket)
  const body = JSON.stringify(user)

  const userDoc = {
    _id: user.userId,
    _type: 'user',
    name: user.userFullName,
    email: user.userEmail,
    imageUrl: user.userImage,
  }

  return client
    .createOrReplace(userDoc)
    .then(() => sessionClient.createIfNotExists(baseGroup))
    .then((group) =>
      sessionClient
        .patch(group._id)
        .set({members: Array.from(new Set(group.members).add(user.userId))})
        .commit()
    )
    .then(() =>
      fetch(url, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.SANITY_CREATE_SESSION_TOKEN}`,
        },
      }).catch((error) => console.error(error))
    )
    .then((res) => res.json())
    .then((json) => {
      const url =
        json.endUserClaimUrl +
        `?origin=${process.env.SANITY_STUDIO_URL}`.catch((error) => console.error(error))
      return res.json({
        statusCode: 200,
        body: JSON.stringify({
          endUserClaimUrl: url,
        }),
      })
    })
}
