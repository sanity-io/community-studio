import {VercelRequest, VercelResponse} from '@vercel/node';
import {from} from 'rxjs';
import {mergeMap, tap} from 'rxjs/operators';
import {handleMessage} from '@/handleMessage';
import {Secrets, ExternalDataSourceName, externalDataSourceNames} from '@/types';
import isSlackDataSource from '@/utils/is-slack-data-source';
import isValidPubSubRequest from '@/utils/is-valid-pubsub-request';
import {readRequestBody} from '@/utils/readRequestBody';

// tslint:disable-next-line:no-console
const log: typeof console.log = (...args: any[]) => console.log(...args);

export const createHandler =
  (secrets: Secrets) => async (request: VercelRequest, res: VercelResponse) => {
    if (!(await isValidPubSubRequest(request))) {
      res.status(401).json({
        success: false,
        message: 'Invalid signature',
      });

      return;
    }

    if (request.method !== 'POST') {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Nothing to see here');
      return;
    }

    const [sourceName] = ([] as ExternalDataSourceName[]).concat(
      request.query.sourceName as ExternalDataSourceName
    );

    if (!externalDataSourceNames.includes(sourceName)) {
      res.status(422).json({
        success: false,
      });

      return;
    }

    log('%s %s', request.method, request.url);

    if (isSlackDataSource(sourceName)) {
      from(readRequestBody(request))
        .pipe(
          tap((params) => {
            log('Got event %s', JSON.stringify(params));
          }),
          mergeMap(handleMessage(secrets)),
          tap((response) => {
            res.writeHead(response.status, response.headers);
            res.end(response.body);
          })
        )
        .subscribe({
          // tslint:disable-next-line:no-console
          error: console.error,
        });
    }
  };
