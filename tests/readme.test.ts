/**
 * Tests for the GitHub README fetch.
 *
 * The URL cases are taken from real production values, which are far messier
 * than the schema suggests: `readmeUrl` currently holds things like "README",
 * "hercial", "https://admin.atlassian.com/" and a Bitbucket link. Because these
 * strings decide what the evaluator fetches, refusing everything that is not
 * GitHub is the property most worth testing.
 */
import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { fetchReadme, pickContent, toRawReadmeUrls } from '../src/contributionEvaluation/readme'

describe('toRawReadmeUrls', () => {
  test('derives a raw URL from a plain repository URL', () => {
    const urls = toRawReadmeUrls({
      repository: 'https://github.com/commercelayer/commercelayer-sanity-template',
    })
    assert.ok(
      urls.includes(
        'https://raw.githubusercontent.com/commercelayer/commercelayer-sanity-template/HEAD/README.md',
      ),
    )
  })

  test('keeps the package subpath for a monorepo tree URL', () => {
    // sanity-io/plugins hosts many plugins; the README lives beside the package.
    const urls = toRawReadmeUrls({
      repositoryUrl:
        'https://github.com/sanity-io/plugins/tree/main/plugins/sanity-plugin-transifex',
    })
    assert.ok(
      urls.includes(
        'https://raw.githubusercontent.com/sanity-io/plugins/HEAD/plugins/sanity-plugin-transifex/README.md',
      ),
    )
  })

  test('uses HEAD rather than guessing a branch name', () => {
    // Real repos in the dataset use main, master and alpha.
    const urls = toRawReadmeUrls({ repository: 'https://github.com/ricokahler/sanity-super-pane' })
    assert.ok(urls.every((u) => u.includes('/HEAD/')))
    assert.ok(!urls.some((u) => /\/(main|master|alpha)\//.test(u)))
  })

  test('prefers an explicit raw readmeUrl and keeps its exact path', () => {
    const urls = toRawReadmeUrls({
      readmeUrl:
        'https://raw.githubusercontent.com/sanity-plugin/structure-tool/refs/heads/master/SANITY_README.md',
      repositoryUrl: 'https://github.com/sanity-plugin/structure-tool',
    })
    assert.equal(
      urls[0],
      'https://raw.githubusercontent.com/sanity-plugin/structure-tool/refs/heads/master/SANITY_README.md',
      'the contributor pointed at a specific file; use it first',
    )
  })

  test('tries both common README spellings, since raw.githubusercontent.com is case sensitive', () => {
    const urls = toRawReadmeUrls({ repository: 'https://github.com/owner/repo' })
    assert.ok(urls.some((u) => u.endsWith('/README.md')))
    assert.ok(urls.some((u) => u.endsWith('/readme.md')))
  })

  test('strips a trailing .git', () => {
    const urls = toRawReadmeUrls({ repository: 'https://github.com/owner/repo.git' })
    assert.ok(urls.every((u) => !u.includes('repo.git')))
  })

  describe('refuses anything that is not GitHub', () => {
    // Every value below is really in the production dataset today.
    const hostile = [
      'README',
      'hercial',
      'https://admin.atlassian.com/',
      'https://aisongsgenerator.com',
      'https://assets.sogody.co.uk/SUSAM/READMEv3.md',
      'https://bitbucket.org/MotionPoint/motionpoint-sanity-plugin/raw/master/README.md',
      'http://localhost:8080/README.md',
      'http://169.254.169.254/latest/meta-data/',
      'file:///etc/passwd',
      'https://github.com.evil.example/owner/repo',
      'https://raw.githubusercontent.com.evil.example/owner/repo/HEAD/README.md',
    ]

    for (const value of hostile) {
      test(`ignores ${value}`, () => {
        assert.deepEqual(toRawReadmeUrls({ readmeUrl: value }), [])
        assert.deepEqual(toRawReadmeUrls({ repositoryUrl: value }), [])
      })
    }
  })

  test('produces nothing when there is nothing to go on', () => {
    assert.deepEqual(toRawReadmeUrls({}), [])
    assert.deepEqual(toRawReadmeUrls({ repository: null, readmeUrl: null }), [])
    assert.deepEqual(toRawReadmeUrls({ repository: 'https://github.com/owner' }), [])
  })
})

describe('fetchReadme', () => {
  const ok = (body: string) =>
    Promise.resolve(new Response(body, { status: 200 })) as ReturnType<typeof fetch>

  test('returns the first candidate that resolves', async () => {
    const seen: string[] = []
    const result = await fetchReadme(
      { repository: 'https://github.com/owner/repo' },
      {
        fetchImpl: ((url: string) => {
          seen.push(String(url))
          return String(url).endsWith('/README.md')
            ? ok('# Real readme')
            : (Promise.resolve(new Response('', { status: 404 })) as ReturnType<typeof fetch>)
        }) as unknown as typeof fetch,
      },
    )
    assert.equal(result?.text, '# Real readme')
    assert.equal(seen.length, 1, 'stops as soon as one resolves')
  })

  test('falls through a 404 to the next spelling', async () => {
    const result = await fetchReadme(
      { repository: 'https://github.com/owner/repo' },
      {
        fetchImpl: ((url: string) =>
          String(url).endsWith('/readme.md')
            ? ok('# lowercase')
            : (Promise.resolve(new Response('', { status: 404 })) as ReturnType<
                typeof fetch
              >)) as unknown as typeof fetch,
      },
    )
    assert.equal(result?.text, '# lowercase')
  })

  test('a failing fetch is not a failing evaluation', async () => {
    const result = await fetchReadme(
      { repository: 'https://github.com/owner/repo' },
      { fetchImpl: (() => Promise.reject(new Error('ENOTFOUND'))) as unknown as typeof fetch },
    )
    assert.equal(result, null)
  })

  test('never calls out when there is no GitHub URL', async () => {
    let called = false
    const result = await fetchReadme(
      { readmeUrl: 'https://admin.atlassian.com/' },
      {
        fetchImpl: (() => {
          called = true
          return ok('should never happen')
        }) as unknown as typeof fetch,
      },
    )
    assert.equal(result, null)
    assert.equal(called, false)
  })

  test('treats an empty README as no README', async () => {
    const result = await fetchReadme(
      { repository: 'https://github.com/owner/repo' },
      { fetchImpl: (() => ok('   \n  ')) as unknown as typeof fetch },
    )
    assert.equal(result, null)
  })
})

describe('pickContent', () => {
  const long = (word: string) => word.repeat(100)

  test('a substantial authored body wins over a README', () => {
    const body = long('author ')
    // Returned trimmed, so compare against the trimmed form.
    assert.equal(pickContent({ bodyText: body, fetchedReadme: '# readme' }), body.trim())
  })

  test('a fresh README beats a thin body', () => {
    assert.equal(pickContent({ bodyText: 'Short.', fetchedReadme: '# readme' }), '# readme')
  })

  test('a fresh README beats the stored copy, which is the stale one', () => {
    assert.equal(pickContent({ fetchedReadme: '# fresh', storedReadme: '# stale' }), '# fresh')
  })

  test('falls back to the stored copy when the fetch produced nothing', () => {
    assert.equal(pickContent({ fetchedReadme: null, storedReadme: '# stored' }), '# stored')
  })

  test('returns null when there is genuinely nothing', () => {
    assert.equal(pickContent({}), null)
    assert.equal(pickContent({ bodyText: '  ', storedReadme: '' }), null)
  })
})
