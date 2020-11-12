import auth0 from '../src/utils/auth0'
import { createHash } from 'crypto'
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

const userIdFromSub = (sub: string) => {
  const hash = createHash('md5')
    .update(sub)
    .digest('hex')
  return `e-${hash}`
}

const auth0ToSanityUser = user => {
  const sessionExpires = new Date(
    new Date().getTime() + 7 * 24 * 60 * 60 * 1000
  ).toISOString()

  const userId = userIdFromSub(user.sub)

  return {
    userId,
    userFullName: user.name,
    userEmail: user.email,
    userImage: user.picture,
    userRole: 'editor',
    sessionExpires,
    sessionLabel: 'Community'
  }
}

const baseGroup = {
  _id: '_.groups.community',
  _type: 'system.group',
  grants: [
    {
      path: '*',
      permissions: ['read']
    },
    {
      path: 'stats.**',
      permissions: ['read']
    },
    {
      filter: '_type == "person"',
      permissions: ['read']
    },
    {
      filter: '_type == "person" && (_id == identity() || _id == "drafts." + identity())',
      permissions: ['read', 'create', 'update']
    },
    {
      filter: '[_type == "guide" && identity() in authors[]._ref]',
      permissions: ['read', 'create', 'update']
    }
  ],
  members: []
}

export default async function callback(req, res) {
  try {
    await auth0.handleCallback(req, res, {
      onUserLoaded: async (req, res, session, state) => {
        const user = auth0ToSanityUser(session.user)

        const githubHandle = session.user?.nickname
        const userDoc = {
          _id: user.userId,
          _type: 'person',
          name: user.userFullName,
          email: user.userEmail,
          social: githubHandle ? {
            github: githubHandle, // not included in Sanity user session
          } : undefined,
          imageUrl: user.userImage,
        }

        await client
          .create(userDoc)
          .catch(err => {
            if (err.statusCode === 409) {
              return client.patch(userDoc._id)
              .set({
                imageUrl: userDoc.imageUrl
              })
              // Use setIfMissing instead of set to avoid overwriting other social handles
              .setIfMissing({
                social: githubHandle ? {
                  github: githubHandle,
                } : undefined,
              })
              .commit()
            } else {
              throw err
            }
          })

        await sessionClient
          .createIfNotExists(baseGroup)
          .then((group) => {
            if (!(group.members || []).includes(user.userId)) {
              return sessionClient
                .patch(group._id)
                .setIfMissing({members: []})
                .append('members', [user.userId])
                .commit()
            }
          })

        const endUserClaimUrl = await sessionClient
          .request({
            uri: '/auth/thirdParty/session',
            method: 'POST',
            json: true,
            body: user
          })
          .then(result => {
            return result.endUserClaimUrl
          })
          .catch(err => {
            throw err
          })

        res.writeHead(302, {
          Location: `${endUserClaimUrl}?origin=${process.env.SANITY_STUDIO_URL}`,
        })
        res.end()

        return session
      }
    })
  } catch (error) {
    console.log(error)
    res.status(error.status || 500).end(error.message)
  }
}
