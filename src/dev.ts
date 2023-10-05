import { createServer } from 'http'
import dotenv from 'dotenv'
import { createHandler } from '../api/_utils/createHandler'
import { readEnv } from '../api/_utils/readEnv'
import { readSecrets } from '../api/_utils/readSecrets'

const env = dotenv.config().parsed

const secrets = readSecrets(env)
const port = Number(readEnv(env, 'PORT'))

createServer(createHandler(secrets)).listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log('Development server listening on port %d', port)
})
