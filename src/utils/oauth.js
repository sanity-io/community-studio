import fetch from 'axios'
import querystring from 'querystring'

export function OAuth2(conf) {
  function tokenRequest(data) {
    const header = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    Object.assign(data, {
      client_id: conf.clientId,
      client_secret: conf.clientSecret
    })
    return fetch({
      url: conf.tokenUrl,
      method: 'POST',
      headers: header,
      data: querystring.stringify(data)
    })
      .then((res) => {
        return res.data
      })
  }

  function getAccessToken(authCode, opts) {
    let tokenRequestData = {
      code: authCode,
      grant_type: 'authorization_code',
      redirect_uri: conf.redirectUri
    }
    tokenRequestData = Object.assign(tokenRequestData, opts.additionalTokenRequestData)
    return tokenRequest(tokenRequestData)
  }

  function refreshToken(token) {
    return tokenRequest({
      refresh_token: token,
      grant_type: 'refresh_token',
      redirect_uri: conf.redirectUri
    })
  }

  return {
    getAccessToken,
    refreshToken
  }
}
