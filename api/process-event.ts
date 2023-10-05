import { createHandler } from './_utils/createHandler'
import { readSecrets } from './_utils/readSecrets'

export default createHandler(readSecrets(process.env))
