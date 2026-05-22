// The community studio uses a third-party session minted in /api/callback.
// That session works for content endpoints (data/listen, data/query, data/doc),
// but the underlying user is not a "project user" — so account/project-level
// endpoints return 400 ("Invalid session, project user not found") or 401
// ("Invalid Token"). Studio 5.x probes those endpoints aggressively, which
// floods the console with errors and uncaught promise rejections.
//
// This module patches window.fetch once, at import time, to short-circuit the
// known-failing endpoints with empty-but-shape-correct 200 responses. The
// targeted endpoints all degrade gracefully when they return empty data —
// Studio just renders the "feature unavailable" path, which is the same path
// it was already taking when these calls failed.
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

const installed = '__communityStudioFetchPatchInstalled' as const
declare global {
  interface Window {
    [installed]?: boolean
  }
}

export function installSilencer() {
  // `sanity schema extract` runs this module inside a mocked browser
  // environment where `window` exists but `window.fetch` does not, so
  // checking both is necessary to avoid a build-time crash.
  if (typeof window === 'undefined' || typeof window.fetch !== 'function') return
  if (window[installed]) return
  window[installed] = true

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
      // Non-URL input — pass through.
      return originalFetch(input as RequestInfo, init)
    }

    if (!isSanityApi(url.host)) {
      return originalFetch(input as RequestInfo, init)
    }

    for (const matcher of matchers) {
      const body = matcher.match(url)
      if (body === undefined) continue

      return new Response(JSON.stringify(body), {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'x-community-studio-mock': matcher.label,
        },
      })
    }

    return originalFetch(input as RequestInfo, init)
  }
}

installSilencer()
