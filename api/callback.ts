import {createHash} from 'crypto';
import fetch from 'axios';
import sanityClient from '@sanity/client';
import url from 'url';
import {VercelRequest, VercelResponse} from '@vercel/node';

import OAuth2 from '../src/utils/oauth';
import agentGroup from '../src/roles/agent';
import {contributor} from '../src/roles/contributor';

const sanityOAuth2 = OAuth2({
  clientId: process.env.SANITY_OAUTH_CLIENT_ID,
  clientSecret: process.env.SANITY_OAUTH_CLIENT_SECRET,
  authorizationUrl: process.env.SANITY_OAUTH_AUTH_URL,
  tokenUrl: process.env.SANITY_OAUTH_TOKEN_URL,
  redirectUri: process.env.SANITY_OAUTH_CALLBACK_URL,
  useBasicAuthorizationHeader: false,
});

const opts = {};

const projectId = process.env.SANITY_PROJECT_ID;
const createSessionToken = process.env.SANITY_CREATE_SESSION_TOKEN;

const client = sanityClient({
  projectId,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  apiVersion: 'v1',
});

const sessionClient = client.config({
  token: createSessionToken,
});

const userIdFromEmail = (email: string) => {
  const hash = createHash('md5').update(email).digest('hex');
  return `e-${hash}`;
};

const userFromProfile = (user: any, role: any) => {
  const sessionExpires = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const userId = userIdFromEmail(user.email);

  return {
    userId,
    userFullName: user.name,
    userEmail: user.email,
    userImage: user.profileImage || `https://www.gravatar.com/avatar/${userId.slice(2)}?d=retro`,
    userRole: role,
    sessionExpires,
    sessionLabel: role === 'agent' ? 'SSO' : 'Community',
  };
};

export default async function callback(req: VercelRequest, res: VercelResponse) {
  if (!req.url) {
    throw new Error('missing url');
  }

  const urlObj = url.parse(req.url, true);

  const cookiesObj = req.headers.cookie
    ? Object.fromEntries(req.headers.cookie.split('; ').map((v) => v.split(/=(.+)/)))
    : {};

  if (urlObj.query.code && urlObj.query.state) {
    const authCode = urlObj.query.code;

    const queryState = Buffer.from(
      decodeURIComponent(
        Array.isArray(urlObj.query.state) ? urlObj.query.state[0] : urlObj.query.state
      ),
      'base64'
    ).toString();
    const cookieState = decodeURIComponent(cookiesObj.state);

    // Verify nonce state parameters match
    if (!queryState || queryState !== cookieState) {
      res.writeHead(302, {
        Location: `https://community.sanity.tools/?ref=cb`,
      });
      res.end();
    }

    try {
      const token = await sanityOAuth2.getAccessToken(authCode, opts);
      const profile = await fetch('https://api.sanity.io/v1/users/me', {
        headers: {
          Authorization: `${token.token_type} ${token.access_token}`,
        },
      }).then((res) => res.data);

      const role =
        (profile.provider === 'google' && profile.email.endsWith('@sanity.io')) ||
        (profile.provider === 'github' && profile.email === process.env.SANITY_TOKEN_A) ||
        (profile.provider === 'github' && profile.email === process.env.SANITY_TOKEN_B)
          ? 'agent'
          : 'editor';

      const user = userFromProfile(profile, role);

      const userDoc = {
        _id: user.userId,
        _type: 'person',
        name: user.userFullName,
        imageUrl: user.userImage,
      };

      await client.create(userDoc).catch((err: any) => {
        if (err.statusCode === 409) {
          return client
            .patch(userDoc._id)
            .set({
              imageUrl: userDoc.imageUrl,
            })
            .commit();
        } else {
          throw err;
        }
      });

      await sessionClient
        .createIfNotExists(role === 'agent' ? agentGroup : contributor)
        .then((group: any) => {
          if (!(group.members || []).includes(user.userId)) {
            return sessionClient
              .patch(group._id)
              .setIfMissing({members: []})
              .append('members', [user.userId])
              .commit();
          }
        });

      const endUserClaimUrl = await sessionClient
        .request({
          uri: '/auth/thirdParty/session',
          method: 'POST',
          json: true,
          body: user,
        })
        .then((result: any) => {
          return result.endUserClaimUrl;
        })
        .catch((err) => {
          throw err;
        });

      res.writeHead(302, {
        Location: `${endUserClaimUrl}?origin=${process.env.SANITY_STUDIO_URL}`,
      });
      res.end();
    } catch (error: any) {
      console.error(error);
      res.status(error.status || 400).end(error.message);
    }
  }
}
