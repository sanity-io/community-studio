/* eslint-disable no-process-env */
import { initAuth0 } from '@auth0/nextjs-auth0';
import auth0config from '../../static/auth_config.json'

const {domain, clientId} = auth0config

export default initAuth0({
  domain,
  clientId,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  scope: 'openid profile',
  redirectUri: 'http://localhost:3000/api/callback',
  postLogoutRedirectUri: 'http://localhost:3000/',
  session: {
    cookieSecret: process.env.AUTH0_COOKIE_SECRET,
    cookieLifetime: 60 * 60 * 8
  }
});
