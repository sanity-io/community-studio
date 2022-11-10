import {VercelRequest} from '@vercel/node';
import {Observable, of} from 'rxjs';

/**
 * GCP Pub/Sub provides the message payload as a base64 encoded string at
 * `message.data`. This function decodes and parses the payload.
 */
export const readRequestBody = (request: VercelRequest): Observable<unknown> =>
  of(JSON.parse(Buffer.from(request.body.message.data, 'base64').toString()));
