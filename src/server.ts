import http from 'http'
import { createHandler } from '../api/_utils/createHandler'
import { readEnv } from '../api/_utils/readEnv'
import { readSecrets } from '../api/_utils/readSecrets'

const port = Number(readEnv(process.env, 'PORT'))

http.createServer(createHandler(readSecrets(process.env))).listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log('Server listening on port %s', port)
})
