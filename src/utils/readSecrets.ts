<<<<<<< HEAD
import {Secrets} from '../types'
import {readEnv} from './readEnv'
=======
import {Secrets} from '../types';
import {readEnv} from './readEnv';
>>>>>>> 62f3a0d

export const readSecrets = (env: any): Secrets => ({
  SANITY_WRITE_TOKEN: readEnv(env, 'SANITY_WRITE_TOKEN'),
  SANITY_DATASET: readEnv(env, 'SANITY_DATASET'),
  EMAIL_DOMAIN: readEnv(env, 'EMAIL_DOMAIN'),
  SANITY_PROJECT_ID: readEnv(env, 'SANITY_PROJECT_ID'),
  SLACK_BOT_USER_TOKEN: readEnv(env, 'SLACK_BOT_USER_TOKEN'),
<<<<<<< HEAD
  SLACK_TOKEN_A: readEnv(env, 'SLACK_TOKEN_A'),
  SLACK_TOKEN_B: readEnv(env, 'SLACK_TOKEN_B'),
})
=======
});
>>>>>>> 62f3a0d
