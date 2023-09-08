import { createHandler } from '../src/createHandler'
import { readSecrets } from '../src/utils/readSecrets'

export default createHandler(readSecrets(process.env))
