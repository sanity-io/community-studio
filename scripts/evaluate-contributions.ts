/**
 * Eval harness for the contribution evaluator.
 *
 * The labelled data is the studio's own curation history: every
 * `curatedContribution` carries the rating the old GPT-4 evaluator produced and
 * the `approved` boolean a moderator was free to overrule. Where the two
 * disagree, the moderator is the label.
 *
 *   pnpm eval:fetch    Pull the labelled contributions into .eval-cache/
 *   pnpm eval:run      Ask Jev about every contribution, caching the answers
 *   pnpm eval:report   Replay the policy over the cached answers and score it
 *   pnpm eval:sweep    Sweep the policy thresholds over the cached answers
 *
 * Jev's answers are cached per contribution, so `report` and `sweep` re-run for
 * free. Tuning the policy never costs another API call; only new contributions
 * or edited questions do.
 */
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { evaluateContribution } from '../src/contributionEvaluation/evaluate'
import {
  LINKS_PROJECTION,
  QUESTIONS,
  THRESHOLDS,
  runPolicy,
  type Signals,
} from '../src/contributionEvaluation/questions'

const CACHE = path.join(__dirname, '..', '.eval-cache')
const DATASET = path.join(CACHE, 'dataset.json')
const SIGNALS = path.join(CACHE, 'signals.json')

const PROJECT_ID = process.env.SANITY_PROJECT_ID || '81pocpw8'
const DATASET_NAME = process.env.SANITY_DATASET || 'production'
const API = `https://${PROJECT_ID}.apicdn.sanity.io/v2024-10-01/data/query/${DATASET_NAME}`

/**
 * How each slice of the curation history maps onto an expected outcome.
 *
 * `overruled_false_positive` is the group that motivated this work: the old
 * evaluator rated them spam and a human had to approve them by hand. Auto
 * rejecting any of these is the failure we most want to eliminate.
 *
 * `passed_untouched` is a weaker label than the rest — it means nobody
 * intervened, not that anybody affirmed it — so it is reported separately.
 */
const GROUPS = {
  overruled_false_positive: {
    filter: 'spamRating >= 5 && approved == true',
    expected: 'approve',
    limit: 100,
  },
  upheld_reject: { filter: 'spamRating >= 5 && approved == false', expected: 'reject', limit: 175 },
  missed_spam: { filter: 'spamRating < 5 && approved == false', expected: 'reject', limit: 50 },
  passed_untouched: {
    filter: 'spamRating < 5 && approved == true',
    expected: 'approve',
    limit: 125,
  },
} as const

type Label = keyof typeof GROUPS

type Record_ = {
  id: string
  label: Label
  expected: 'approve' | 'reject'
  oldRating: number
  type: string
  title: string
  description: string | null
  body: string | null
  urls: string[]
}

/** A normalised projection, so the field contract lives here rather than in a webhook config. */
const PROJECTION = `{
  _id, spamRating, approved,
  "c": contribution->{
    _type, title, description,
    "bodyText": pt::text(body[0...8]),
    readme,
    ${LINKS_PROJECTION.replace('"links"', '"urls"')}
  }
}`

async function query<T>(groq: string): Promise<T> {
  const res = await fetch(`${API}?query=${encodeURIComponent(groq)}`)
  if (!res.ok) throw new Error(`Sanity ${res.status}: ${await res.text()}`)
  return ((await res.json()) as { result: T }).result
}

async function cmdFetch() {
  fs.mkdirSync(CACHE, { recursive: true })
  const out: Record_[] = []

  for (const [label, group] of Object.entries(GROUPS) as [Label, (typeof GROUPS)[Label]][]) {
    let fetched = 0
    for (let offset = 0; offset < group.limit; offset += 25) {
      const rows = await query<any[]>(
        `*[_type == "curatedContribution" && ${group.filter}] | order(_id asc)[${offset}...${offset + 25}]${PROJECTION}`,
      )
      if (!rows.length) break
      for (const row of rows) {
        if (!row.c?.title) continue // contribution deleted; nothing to judge
        out.push({
          id: row._id,
          label,
          expected: group.expected,
          oldRating: row.spamRating,
          type: row.c._type.replace('contribution.', ''),
          title: row.c.title,
          description: row.c.description?.trim() || null,
          body: (row.c.bodyText || row.c.readme || '').trim().slice(0, 4000) || null,
          urls: (row.c.urls || []).filter(Boolean),
        })
        fetched++
      }
    }
    console.log(`${label.padEnd(26)} ${fetched}`)
  }

  fs.writeFileSync(DATASET, JSON.stringify(out, null, 2))
  console.log(`\n${out.length} contributions -> ${path.relative(process.cwd(), DATASET)}`)
}

/**
 * Cache key covers the questions as well as the content, so editing a question's
 * wording invalidates its cached answers instead of silently reusing them.
 */
function cacheKey(record: Record_): string {
  return createHash('sha256')
    .update(JSON.stringify({ record, questions: QUESTIONS }))
    .digest('hex')
    .slice(0, 16)
}

type CachedSignals = { key: string; signals: Signals; inputTokens: number }

function loadDataset(): Record_[] {
  if (!fs.existsSync(DATASET)) throw new Error('No dataset. Run `pnpm eval:fetch` first.')
  return JSON.parse(fs.readFileSync(DATASET, 'utf8'))
}

function loadSignals(): Record<string, CachedSignals> {
  return fs.existsSync(SIGNALS) ? JSON.parse(fs.readFileSync(SIGNALS, 'utf8')) : {}
}

async function cmdRun() {
  if (!process.env.AI_GATEWAY_API_KEY) throw new Error('Set AI_GATEWAY_API_KEY')

  const dataset = loadDataset()
  const cached = loadSignals()
  const todo = dataset.filter((r) => cached[r.id]?.key !== cacheKey(r))

  console.log(`${dataset.length} contributions, ${todo.length} to evaluate`)
  if (!todo.length) return

  let done = 0
  let failed = 0
  const CONCURRENCY = 8

  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      for (;;) {
        const record = todo.pop()
        if (!record) return
        try {
          const result = await evaluateContribution({
            contributionType: record.type,
            title: record.title,
            summary: record.description,
            content: record.body,
            links: record.urls,
          })
          cached[record.id] = {
            key: cacheKey(record),
            signals: result.signals,
            inputTokens: result.usage.inputTokens ?? 0,
          }
        } catch (error) {
          failed++
          console.error(`  ${record.id}: ${(error as Error).message}`)
        }
        if (++done % 25 === 0) {
          console.log(`  ${done}/${done + todo.length}`)
          fs.writeFileSync(SIGNALS, JSON.stringify(cached, null, 2))
        }
      }
    }),
  )

  fs.writeFileSync(SIGNALS, JSON.stringify(cached, null, 2))
  const tokens = Object.values(cached).reduce((sum, c) => sum + c.inputTokens, 0)
  console.log(
    `\n${done - failed} evaluated, ${failed} failed. ` +
      `${tokens} input tokens total, $${(tokens * 4.2e-8).toFixed(4)} at Jev's $0.042/Mtok.`,
  )
}

type Row = Record_ & { outcome: 'approve' | 'reject' | 'review'; signals: Signals }

function join(): Row[] {
  const cached = loadSignals()
  return loadDataset()
    .filter((r) => cached[r.id])
    .map((r) => ({
      ...r,
      signals: cached[r.id].signals,
      outcome: runPolicy(cached[r.id].signals).outcome,
    }))
}

function pct(n: number, d: number): string {
  return d === 0 ? '   n/a' : `${((n / d) * 100).toFixed(1).padStart(5)}%`
}

function cmdReport() {
  const rows = join()
  console.log(`Scored ${rows.length} contributions against the moderators' decisions.\n`)

  console.log('Per label — how the new evaluator routes each slice of history')
  console.log(
    `${''.padEnd(26)} ${'n'.padStart(4)} ${'approve'.padStart(8)} ${'review'.padStart(8)} ${'reject'.padStart(8)}`,
  )
  for (const label of Object.keys(GROUPS) as Label[]) {
    const group = rows.filter((r) => r.label === label)
    if (!group.length) continue
    const count = (o: string) => group.filter((r) => r.outcome === o).length
    console.log(
      `${label.padEnd(26)} ${String(group.length).padStart(4)} ` +
        `${pct(count('approve'), group.length)}   ${pct(count('review'), group.length)}   ${pct(count('reject'), group.length)}`,
    )
  }

  // The headline number: contributions a human had to rescue that we would
  // auto-reject all over again.
  const fps = rows.filter((r) => r.label === 'overruled_false_positive')
  const stillRejected = fps.filter((r) => r.outcome === 'reject')
  const spam = rows.filter((r) => r.expected === 'reject')
  const caught = spam.filter((r) => r.outcome === 'reject')
  const autoDecided = rows.filter((r) => r.outcome !== 'review')

  console.log('\nHeadline')
  console.log(
    `  False positives repeated      ${stillRejected.length}/${fps.length} (${pct(stillRejected.length, fps.length).trim()})`,
  )
  console.log(
    `  Spam auto-rejected            ${caught.length}/${spam.length} (${pct(caught.length, spam.length).trim()})`,
  )
  console.log(
    `  Decided without a human       ${autoDecided.length}/${rows.length} (${pct(autoDecided.length, rows.length).trim()})`,
  )

  if (stillRejected.length) {
    console.log('\n  Still auto-rejected despite a human having approved them:')
    for (const r of stillRejected.slice(0, 12)) {
      const firing = (Object.keys(QUESTIONS) as (keyof Signals)[])
        .filter((id) => id !== 'substance' && r.signals[id] >= THRESHOLDS.spamSignal)
        .map((id) => `${id}=${r.signals[id].toFixed(2)}`)
      console.log(`    [${r.type}] ${r.title} — ${firing.join(' ') || 'no flags'}`)
    }
  }

  const wrongApprovals = spam.filter((r) => r.outcome === 'approve')
  if (wrongApprovals.length) {
    console.log(`\n  Auto-approved but rejected by a moderator (${wrongApprovals.length}):`)
    for (const r of wrongApprovals.slice(0, 12)) console.log(`    [${r.type}] ${r.title}`)
  }
}

/**
 * Sweeps the risk thresholds.
 *
 * The column that governs the choice is "good auto-rejected": contributions a
 * moderator was happy with that the policy would reject without asking. That is
 * the failure this refactor exists to remove, so it is the one traded against
 * spam coverage rather than aggregate accuracy.
 */
function cmdSweep() {
  const rows = join()
  const good = rows.filter((r) => r.expected === 'approve')
  const spam = rows.filter((r) => r.expected === 'reject')
  const overruled = rows.filter((r) => r.label === 'overruled_false_positive')

  console.log(
    'reject approve   good auto-rejected   of which overruled   spam caught   auto-decided',
  )
  for (const reject of [2, 3, 4, 5]) {
    for (const approve of [1, 2, 3]) {
      if (approve >= reject) continue
      const thresholds = { ...THRESHOLDS, reject, approve }
      const outcome = (r: Row) => runPolicy(r.signals, thresholds).outcome
      const badReject = good.filter((r) => outcome(r) === 'reject').length
      const overruledReject = overruled.filter((r) => outcome(r) === 'reject').length
      const caught = spam.filter((r) => outcome(r) === 'reject').length
      const decided = rows.filter((r) => outcome(r) !== 'review').length
      const current =
        reject === THRESHOLDS.reject && approve === THRESHOLDS.approve ? '  <- current' : ''
      console.log(
        `${String(reject).padStart(6)} ${String(approve).padStart(7)}   ` +
          `${String(badReject).padStart(3)}/${good.length} ${pct(badReject, good.length)}     ` +
          `${String(overruledReject).padStart(10)}/${overruled.length}   ` +
          `${String(caught).padStart(6)}/${spam.length}   ` +
          `${pct(decided, rows.length)}${current}`,
      )
    }
  }
}

/**
 * Regression gate over the cached answers.
 *
 * A probabilistic evaluator cannot be unit tested into correctness, but it can
 * be held to a budget. These numbers are the ones measured when the policy
 * landed; a change that pushes past them either found a real improvement and
 * should move the budget in the same commit, or regressed and should not merge.
 *
 * Runs offline against .eval-cache, so it is safe in CI without an API key —
 * but it only covers contributions already in the cache. Re-run `eval:run`
 * after editing a question, or the cache key mismatch will shrink the sample.
 */
const BUDGET = {
  /** Contributions a moderator rescued that we would auto-reject again. */
  maxFalsePositivesRepeated: 2,
  /** Any contribution a moderator was happy with that we would auto-reject. */
  maxGoodAutoRejected: 14,
  /**
   * Share of moderator-rejected contributions we auto-reject. Ratcheted from
   * 0.55 to 0.58 when the unforgivable-signal floor and the corrected link
   * fields took the measured figure to 0.615. Headroom is left because
   * `jev-latest` is an alias and can move under us.
   */
  minSpamCaught: 0.58,
  /** Share of contributions decided without a human. */
  minAutoDecided: 0.78,
  /** Guards against the cache quietly emptying and every check passing. */
  minSampleSize: 350,
}

function cmdCheck() {
  const rows = join()
  const good = rows.filter((r) => r.expected === 'approve')
  const spam = rows.filter((r) => r.expected === 'reject')
  const overruled = rows.filter((r) => r.label === 'overruled_false_positive')

  const measured = {
    maxFalsePositivesRepeated: overruled.filter((r) => r.outcome === 'reject').length,
    maxGoodAutoRejected: good.filter((r) => r.outcome === 'reject').length,
    minSpamCaught: spam.filter((r) => r.outcome === 'reject').length / spam.length,
    minAutoDecided: rows.filter((r) => r.outcome !== 'review').length / rows.length,
    minSampleSize: rows.length,
  }

  const failures: string[] = []
  for (const [key, limit] of Object.entries(BUDGET)) {
    const value = measured[key as keyof typeof measured]
    const ok = key.startsWith('max') ? value <= limit : value >= limit
    const shown = key.startsWith('min') && limit < 1 ? value.toFixed(3) : String(value)
    console.log(
      `${ok ? 'ok  ' : 'FAIL'}  ${key.padEnd(28)} ${shown.padStart(8)}  ` +
        `(${key.startsWith('max') ? 'max' : 'min'} ${limit})`,
    )
    if (!ok) failures.push(`${key}: ${shown} breaches ${limit}`)
  }

  if (failures.length) {
    console.error(`\n${failures.length} budget(s) breached:`)
    for (const failure of failures) console.error(`  ${failure}`)
    process.exitCode = 1
    return
  }
  console.log('\nAll budgets met.')
}

const COMMANDS: Record<string, () => void | Promise<void>> = {
  fetch: cmdFetch,
  run: cmdRun,
  report: cmdReport,
  sweep: cmdSweep,
  check: cmdCheck,
}

const command = process.argv[2]
if (!command || !COMMANDS[command]) {
  console.error(`Usage: evaluate-contributions <${Object.keys(COMMANDS).join('|')}>`)
  process.exit(1)
}
void Promise.resolve(COMMANDS[command]()).catch((error) => {
  console.error(error)
  process.exit(1)
})
