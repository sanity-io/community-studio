import auth0 from '../src/utils/auth0'
import crypto from 'crypto'
import fetch from 'node-fetch'
import sanityClient from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID
const createSessionToken = process.env.SANITY_CREATE_SESSION_TOKEN

const client = sanityClient({
  projectId,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false
})

const sessionClient = client.config({
  token: createSessionToken
})

const userIdFromEmail = (email: string) => {
  let hash = crypto
    .createHash('md5')
    .update(email)
    .digest('hex')
  return `e-${hash}`
}

const userFromTicket = ticket => {
  const sessionExpires = new Date(
    new Date().getTime() + 7 * 24 * 60 * 60 * 1000
  ).toISOString()

  const userId = userIdFromEmail(ticket.payload.email)

  return {
    userId,
    userFullName: ticket.payload.name, //the user's full name.
    userEmail: ticket.payload.email, // the user's email address.
    userImage: ticket.payload.picture, //optional HTTPS URL to the user's profile image.
    userRole: 'administrator', //If the user should be able to log into the Sanity Studio, role must be either administrator or editor
    sessionExpires, //ISO timestamp for when the session should expire.
    sessionLabel: 'SSO' //optional label for the session.
  }
}

const baseGroup = {
  _id: '_.groups.community',
  _type: 'system.group',
  grants: [
    {
      path: '_id in path('**')',
      permissions: ['read']
    },
    {s
      filter: "_type == 'person'",
      permissions: ['read']
    },
    {
      filter: "_type == 'person' && _id == identity()",
      permissions: ['read', 'create', 'update']
    },
    {
      filter: `[_type == "guide" && identity() in authors[]._ref]`,
      permissions: ['read', 'create', 'update']
    }
  ],
  members: []
}

const userIdFromEmail = (email: string) => {
  let hash = crypto
    .createHash('md5')
    .update(email)
    .digest('hex')
  return `e-${hash}`
}

export default async function login(req, res) {
  try {
    const { accessToken } = await auth0.getSession(req)

  } catch (error) {
    res.status(error.status || 500).end(error.message)
  }
}
