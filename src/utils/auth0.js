/* eslint-disable no-process-env */
import { initAuth0 } from '@auth0/nextjs-auth0'

export default initAuth0({
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  domain: process.env.AUTH0_DOMAIN,
  scope: process.env.AUTH0_SCOPE,
  redirectUri: process.env.AUTH0_ON_LOGIN,
  postLogoutRedirectUri: process.env.AUTH0_ON_LOGOUT,
  session: {
    cookieSecret: process.env.AUTH0_COOKIE_SECRET,
    cookieLifetime: process.env.AUTH0_COOKIE_EXPIRY
  }
})
