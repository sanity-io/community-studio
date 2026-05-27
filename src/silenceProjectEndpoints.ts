// The community studio uses a third-party session minted in /api/callback.
// That session works for content endpoints (data/listen, data/query, data/doc),
// but the underlying user is not a "project user" — so account/project-level
// endpoints return 400 ("Invalid session, project user not found") or 401
// ("Invalid Token"). Studio 5.x probes those endpoints aggressively, which
// floods the console with errors and uncaught promise rejections.
//
// This module patches both window.fetch AND XMLHttpRequest at import time
// to short-circuit the known-failing endpoints with empty-but-shape-correct
// 200 responses. Patching both transports is necessary because Sanity's HTTP
// client uses XHR for many of these calls. Studio degrades gracefully when
// these endpoints return empty data — it renders the "feature unavailable"
// path, which is the same path it was already taking when the calls failed.
//
// Only requests to *.api.sanity.io with matching pathnames are touched.
// Everything else passes through to the real network.

type Matcher = {
  // Returns the mocked JSON body to use when the URL matches.
  match: (url: URL) => unknown | undefined
  label: string
}

const matchers: Matcher[] = [
  {
    label: 'projects/:id (get-project-org)',
    match: (url) => {
      // /v{date}/projects/{projectId}  (no further path segments)
      const m = url.pathname.match(/^\/v[\d-]+\/projects\/[^/]+$/)
      return m ? {} : undefined
    },
  },
  {
    label: 'projects/:id/datasets',
    match: (url) => {
      const m = url.pathname.match(/^\/v[\d-]+\/projects\/[^/]+\/datasets$/)
      return m ? [] : undefined
    },
  },
  {
    label: 'projects/:id/user-applications',
    match: (url) => {
      const m = url.pathname.match(/^\/v[\d-]+\/projects\/[^/]+\/user-applications$/)
      return m ? [] : undefined
    },
  },
  {
    label: 'projects/:id/grants',
    match: (url) => {
      // Sanity Studio's "Help and resources" menu calls this; when it 401s
      // the studio throws an unrecoverable error, so we mock it as no grants.
      const m = url.pathname.match(/^\/v[\d-]+\/projects\/[^/]+\/grants$/)
      return m ? [] : undefined
    },
  },
  {
    label: 'intake/telemetry-status',
    match: (url) => {
      const m = url.pathname.match(/^\/v[\d-]+\/intake\/telemetry-status$/)
      // Empty object treats consent as undetermined-but-not-prompting.
      return m ? {} : undefined
    },
  },
  {
    label: 'features',
    match: (url) => {
      const m = url.pathname.match(/^\/v[\d-]+\/features$/)
      return m ? [] : undefined
    },
  },
  {
    label: 'schedules/:projectId/:dataset',
    match: (url) => {
      const m = url.pathname.match(/^\/v[\d-]+\/schedules\/[^/]+\/[^/]+$/)
      return m ? {schedules: []} : undefined
    },
  },
  {
    label: 'journey/trial',
    match: (url) => (url.pathname.match(/^\/v[\d-]+\/journey\/trial$/) ? null : undefined),
  },
]

const isSanityApi = (host: string) => /(^|\.)api\.sanity\.io$/.test(host)

const findMatch = (url: URL): {body: unknown; label: string} | null => {
  if (!isSanityApi(url.host)) return null
  for (const matcher of matchers) {
    const body = matcher.match(url)
    if (body !== undefined) return {body, label: matcher.label}
  }
  return null
}

const installed = '__communityStudioFetchPatchInstalled' as const
declare global {
  interface Window {
    [installed]?: boolean
  }
}

function patchFetch() {
  if (typeof window.fetch !== 'function') return
  const originalFetch = window.fetch.bind(window)

  window.fetch = async function patchedFetch(
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> {
    let url: URL | null = null
    try {
      const raw =
        typeof input === 'string'
          ? input
          : input instanceof URL
          ? input.toString()
          : input.url
      url = new URL(raw, window.location.origin)
    } catch {
      return originalFetch(input as RequestInfo, init)
    }

    const match = findMatch(url)
    if (!match) return originalFetch(input as RequestInfo, init)

    return new Response(JSON.stringify(match.body), {
      status: 200,
      statusText: 'OK',
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'x-community-studio-mock': match.label,
      },
    })
  }
}

function patchXHR() {
  if (typeof XMLHttpRequest !== 'function') return

  // We hook open() to remember the URL, then send() to short-circuit before
  // the real network call. When matched, we fire load/readystatechange events
  // synchronously enough that callers reading status/responseText see the
  // mocked payload.
  const OriginalOpen = XMLHttpRequest.prototype.open
  const OriginalSend = XMLHttpRequest.prototype.send
  const OriginalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader
  const OriginalGetAllResponseHeaders = XMLHttpRequest.prototype.getAllResponseHeaders
  const OriginalGetResponseHeader = XMLHttpRequest.prototype.getResponseHeader

  type MockState = {
    method: string
    url: URL
    body: string
    label: string
  }

  const mockKey = '__communityStudioMock__' as const
  // We attach a non-enumerable property to each XHR instance when its URL
  // matches a silencer rule.
  const getMock = (xhr: XMLHttpRequest): MockState | undefined =>
    (xhr as unknown as Record<string, MockState | undefined>)[mockKey]
  const setMock = (xhr: XMLHttpRequest, mock: MockState | undefined) => {
    Object.defineProperty(xhr, mockKey, {value: mock, writable: true, configurable: true})
  }

  XMLHttpRequest.prototype.open = function patchedOpen(
    method: string,
    url: string | URL,
    async?: boolean,
    username?: string | null,
    password?: string | null,
  ) {
    let parsed: URL | null = null
    try {
      parsed = new URL(url.toString(), window.location.origin)
    } catch {
      // ignore
    }
    const match = parsed ? findMatch(parsed) : null
    if (match && parsed) {
      setMock(this, {
        method,
        url: parsed,
        body: JSON.stringify(match.body),
        label: match.label,
      })
    } else {
      setMock(this, undefined)
    }
    // eslint-disable-next-line prefer-rest-params
    return OriginalOpen.apply(this, arguments as unknown as Parameters<typeof OriginalOpen>)
  } as typeof XMLHttpRequest.prototype.open

  XMLHttpRequest.prototype.setRequestHeader = function patchedSetRequestHeader(
    name: string,
    value: string,
  ) {
    if (getMock(this)) return // swallow header writes on mocked requests
    // eslint-disable-next-line prefer-rest-params
    return OriginalSetRequestHeader.apply(
      this,
      arguments as unknown as Parameters<typeof OriginalSetRequestHeader>,
    )
  }

  XMLHttpRequest.prototype.send = function patchedSend(
    body?: Document | XMLHttpRequestBodyInit | null,
  ) {
    const mock = getMock(this)
    if (!mock) {
      // eslint-disable-next-line prefer-rest-params
      return OriginalSend.apply(this, arguments as unknown as Parameters<typeof OriginalSend>)
    }

    const xhr = this as XMLHttpRequest & {
      readyState: number
      status: number
      statusText: string
      response: unknown
      responseText: string
      responseURL: string
    }

    // Override the response surface with our mocked payload. XHR's readyState,
    // status, etc. are normally read-only, so we redefine them on this
    // instance only.
    const finalize = () => {
      Object.defineProperty(xhr, 'readyState', {value: 4, configurable: true})
      Object.defineProperty(xhr, 'status', {value: 200, configurable: true})
      Object.defineProperty(xhr, 'statusText', {value: 'OK', configurable: true})
      Object.defineProperty(xhr, 'responseURL', {value: mock.url.toString(), configurable: true})
      Object.defineProperty(xhr, 'response', {value: mock.body, configurable: true})
      Object.defineProperty(xhr, 'responseText', {value: mock.body, configurable: true})

      const dispatch = (type: string) => {
        try {
          xhr.dispatchEvent(new Event(type))
        } catch {
          // ignore — some environments don't allow synthetic dispatch
        }
      }

      dispatch('readystatechange')
      dispatch('load')
      dispatch('loadend')
    }

    // Fire async to match real network timing semantics; Sanity's client
    // expects callbacks to run in a microtask/task, not synchronously.
    setTimeout(finalize, 0)
  }

  XMLHttpRequest.prototype.getAllResponseHeaders = function patchedGetAllResponseHeaders() {
    const mock = getMock(this)
    if (!mock) return OriginalGetAllResponseHeaders.call(this)
    return (
      'content-type: application/json; charset=utf-8\r\n' +
      `x-community-studio-mock: ${mock.label}\r\n`
    )
  }

  XMLHttpRequest.prototype.getResponseHeader = function patchedGetResponseHeader(name: string) {
    const mock = getMock(this)
    if (!mock) return OriginalGetResponseHeader.call(this, name)
    const lower = name.toLowerCase()
    if (lower === 'content-type') return 'application/json; charset=utf-8'
    if (lower === 'x-community-studio-mock') return mock.label
    return null
  }
}

export function installSilencer() {
  // `sanity schema extract` runs this module inside a mocked browser
  // environment where `window` exists but `window.fetch` does not, so
  // checking both is necessary to avoid a build-time crash.
  if (typeof window === 'undefined' || typeof window.fetch !== 'function') return
  if (window[installed]) return
  window[installed] = true

  patchFetch()
  patchXHR()
}

installSilencer()
