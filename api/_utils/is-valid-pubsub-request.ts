import { VercelRequest } from '@vercel/node'
import { OAuth2Client } from 'google-auth-library'

const authClient = new OAuth2Client()

export default async function isValidPubSubRequest(request: VercelRequest): Promise<boolean> {
  const [, idToken] = (request.headers.authorization ?? '').split('Bearer ')

  try {
    await authClient.verifyIdToken({ idToken })
    return true
  } catch {
    return false
  }
}
