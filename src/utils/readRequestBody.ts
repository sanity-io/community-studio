<<<<<<< HEAD
import {IncomingMessage} from 'http'

export const readRequestBody = (req: IncomingMessage): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', chunk => {
      chunks.push(chunk)
    })
    req.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    req.on('error', error => {
      reject(error)
    })
  })
=======
import {VercelRequest} from '@vercel/node';
import {Observable, of} from 'rxjs';

/**
 * GCP Pub/Sub provides the message payload as a base64 encoded string at
 * `message.data`. This function decodes and parses the payload.
 */
export const readRequestBody = (request: VercelRequest): Observable<unknown> =>
  of(JSON.parse(Buffer.from(request.body.message.data, 'base64').toString()));
>>>>>>> 62f3a0d
