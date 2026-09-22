/**
 * Fetches a contribution's README from GitHub so the evaluator judges what the
 * project actually says about itself.
 *
 * Most tools and many starters carry almost nothing in the document: of the 29
 * tools in the labelled set, all 29 reached the model with no body text, and 17
 * of them fell below the substance gate as a result. The real description lives
 * in the repository. `contribution.tool` has a stored `readme` field for this,
 * but the webhook that populated it points at `/api/update-plugin-readme`, an
 * endpoint that no longer exists, so that copy has been going stale.
 *
 * Fetching at evaluation time means the model sees the current README rather
 * than whatever was cached before that endpoint disappeared.
 *
 * The URLs come from contributor-supplied fields, and in production those
 * fields contain things like "README", "hercial", an Atlassian admin console
 * and a Bitbucket link. Everything here is therefore built around refusing to
 * fetch anything that is not GitHub.
 */

/** The only hosts this module will ever request. */
const RAW_HOST = 'raw.githubusercontent.com'
const REPO_HOST = 'github.com'

/** READMEs can be enormous; the evaluator only reads the first few thousand characters anyway. */
const MAX_BYTES = 64_000

/** Case matters on raw.githubusercontent.com, so try the two common spellings. */
const FILENAMES = ['README.md', 'readme.md']

function parseUrl(value: unknown): URL | null {
  if (typeof value !== 'string' || !value.trim()) return null
  try {
    return new URL(value.trim())
  } catch {
    // Fields such as "README" and "hercial" are not URLs at all.
    return null
  }
}

/**
 * Turns whatever the contributor supplied into candidate raw README URLs.
 *
 * `HEAD` is used in place of a branch name because it resolves to the
 * repository's default branch, which avoids guessing between main, master and
 * the occasional alpha.
 */
export function toRawReadmeUrls(input: {
  readmeUrl?: string | null
  repositoryUrl?: string | null
  repository?: string | null
}): string[] {
  const candidates: string[] = []

  // An explicit readmeUrl is the contributor pointing at the file directly, so
  // it wins when it is already a raw GitHub URL.
  const explicit = parseUrl(input.readmeUrl)
  if (explicit?.hostname === RAW_HOST) candidates.push(explicit.toString())

  for (const value of [input.repositoryUrl, input.repository, input.readmeUrl]) {
    const url = parseUrl(value)
    if (!url || url.hostname !== REPO_HOST) continue

    // /owner/repo, optionally /tree/<branch>/<subpath> for a monorepo package.
    const segments = url.pathname.split('/').filter(Boolean)
    const [owner, repo, treeKeyword, , ...subpath] = segments
    if (!owner || !repo) continue

    const prefix = treeKeyword === 'tree' && subpath.length ? `${subpath.join('/')}/` : ''
    for (const filename of FILENAMES) {
      candidates.push(
        `https://${RAW_HOST}/${owner}/${repo.replace(/\.git$/, '')}/HEAD/${prefix}${filename}`,
      )
    }
  }

  return [...new Set(candidates)]
}

/**
 * Returns the first README that resolves, or null.
 *
 * Every failure is swallowed deliberately: a repository being private, renamed
 * or slow is not a reason to fail moderation. The evaluator simply judges the
 * contribution on whatever it already had.
 */
export async function fetchReadme(
  input: Parameters<typeof toRawReadmeUrls>[0],
  options: { timeoutMs?: number; fetchImpl?: typeof fetch } = {},
): Promise<{ text: string; url: string } | null> {
  const { timeoutMs = 4000, fetchImpl = fetch } = options
  const candidates = toRawReadmeUrls(input)
  if (!candidates.length) return null

  // One budget for the whole attempt, so a list of candidates cannot multiply
  // into a long stall inside the function's execution limit.
  const deadline = Date.now() + timeoutMs

  for (const url of candidates) {
    const remaining = deadline - Date.now()
    if (remaining <= 0) break
    try {
      const response = await fetchImpl(url, {
        signal: AbortSignal.timeout(remaining),
        headers: { accept: 'text/plain, text/markdown, */*' },
        redirect: 'follow',
      })
      if (!response.ok) continue
      const text = (await response.text()).slice(0, MAX_BYTES).trim()
      if (text) return { text, url }
    } catch {
      // Timeout, DNS failure, abort — try the next candidate if there is time.
    }
  }

  return null
}

/**
 * Chooses what the model reads.
 *
 * The author's own body wins when they wrote one: it was written for this
 * audience, whereas a README is written for people already installing the
 * thing. A freshly fetched README beats the stored copy, which is the stale
 * one. Anything is better than nothing.
 */
export function pickContent(sources: {
  bodyText?: string | null
  fetchedReadme?: string | null
  storedReadme?: string | null
}): string | null {
  const body = sources.bodyText?.trim()
  if (body && body.length >= 200) return body
  return sources.fetchedReadme?.trim() || body || sources.storedReadme?.trim() || null
}
