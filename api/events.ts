import {createHandler} from '@/createHandler'
import {readSecrets} from '@/utils/readSecrets'

export default createHandler(readSecrets(process.env))
