/**
 * Unit tests for the moderation policy.
 *
 * These run without touching the network: `runPolicy` takes Jev's answers as
 * plain numbers, so every decision path is testable from a fixed signal vector.
 *
 * The cases are the ones the curation history actually produced. The most
 * important is "an agency showing a client site" — a hotel or a law firm trips
 * `offTopicSubject` on its subject matter, and rejecting those is what produced
 * most of the 95 contributions a moderator had to approve by hand.
 */
import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import {
  QUESTIONS,
  THRESHOLDS,
  runPolicy,
  buildState,
  CONTENT_LIMIT,
  type Signals,
} from '../src/contributionEvaluation/questions'

/** A contribution with no spam signals and a solid description. */
const CLEAN: Signals = {
  aboutSanity: 0.95,
  aboutWebDevelopment: 0.9,
  prohibitedCategory: 0.01,
  consumerUtility: 0.03,
  directoryPromotion: 0.02,
  trainingCourseSales: 0.01,
  placeholderSubmission: 0.01,
  offTopicSubject: 0.05,
  substance: 2.5,
}

const signals = (overrides: Partial<Signals>): Signals => ({ ...CLEAN, ...overrides })

describe('runPolicy', () => {
  test('approves an on-topic contribution with a substantive description', () => {
    const decision = runPolicy(CLEAN)
    assert.equal(decision.outcome, 'approve')
    assert.equal(decision.approved, true)
    assert.ok(decision.reasons.length > 0, 'a decision always explains itself')
  })

  test('maps each outcome onto the approved field the studio queues read', () => {
    assert.equal(runPolicy(CLEAN).approved, true)
    assert.equal(runPolicy(signals({ prohibitedCategory: 0.97 })).approved, false)
    // undefined, not false — this is what puts a contribution in "Pending approval"
    assert.equal(runPolicy(signals({ substance: 0.4 })).approved, undefined)
  })

  describe('signals that being on topic must not excuse', () => {
    // Regression for a hole Cursor Bugbot found after merge. The floor that
    // stops the on-topic discount was gated on `spamSignalStrong` (0.90) while
    // signals fire from `spamSignal` (0.70). Anything in between fired, got
    // discounted by three for naming a framework, and came out at risk 0 —
    // auto-approved, published, with a spam rating of 0.
    //
    // The whole band is swept rather than one comfortable value. The original
    // test for this used 0.97, which passed while 0.70 through 0.89 shipped
    // broken.
    for (const id of ['prohibitedCategory', 'placeholderSubmission'] as const) {
      test(`${id} is never auto-approved at any firing strength`, () => {
        for (let value = THRESHOLDS.spamSignal; value <= 1; value += 0.01) {
          const decision = runPolicy(signals({ [id]: Number(value.toFixed(2)) }))
          assert.notEqual(
            decision.outcome,
            'approve',
            `${id}=${value.toFixed(2)} with a named stack was auto-approved`,
          )
          assert.notEqual(decision.approved, true)
        }
      })

      test(`${id} rejects across the band, on topic or not`, () => {
        for (const value of [0.7, 0.75, 0.8, 0.89, 0.9, 0.99]) {
          for (const topical of [true, false]) {
            const decision = runPolicy(
              signals({
                [id]: value,
                aboutSanity: topical ? 0.95 : 0.02,
                aboutWebDevelopment: topical ? 0.93 : 0.03,
              }),
            )
            assert.equal(
              decision.outcome,
              'reject',
              `${id}=${value} onTopic=${topical} gave ${decision.outcome}`,
            )
          }
        }
      })
    }

    test('a signal just below the firing threshold still approves', () => {
      // The floor must not creep below where signals fire, or a clean
      // contribution with a trace of noise gets rejected.
      const decision = runPolicy(signals({ prohibitedCategory: THRESHOLDS.spamSignal - 0.01 }))
      assert.equal(decision.outcome, 'approve')
    })
  })

  test('rejects a prohibited category outright', () => {
    const decision = runPolicy(
      signals({ prohibitedCategory: 0.98, aboutSanity: 0.02, aboutWebDevelopment: 0.03 }),
    )
    assert.equal(decision.outcome, 'reject')
    assert.match(decision.reasons.join(' '), /does not accept/)
  })

  test('rejects placeholder submissions', () => {
    const decision = runPolicy(
      signals({
        placeholderSubmission: 0.96,
        aboutSanity: 0.05,
        aboutWebDevelopment: 0.05,
        substance: 0.2,
      }),
    )
    assert.equal(decision.outcome, 'reject')
  })

  test('rejects a consumer utility that names no stack and no Sanity', () => {
    // The shape of most real spam: watermark removers, headshot generators,
    // unit converters. 41 of the 43 contributions matching this were rejected.
    const decision = runPolicy(
      signals({
        consumerUtility: 0.95,
        aboutSanity: 0.02,
        aboutWebDevelopment: 0.04,
        offTopicSubject: 0.8,
      }),
    )
    assert.equal(decision.outcome, 'reject')
  })

  describe('being on topic cancels spam signals', () => {
    test('does not reject a client website whose subject is off topic', () => {
      // "Baltic Village", "Waldhaus Sils", "Jennifer Fisher": real sites built
      // with Sanity, described in the language of the client's business.
      const decision = runPolicy(
        signals({ offTopicSubject: 0.92, aboutSanity: 0.9, aboutWebDevelopment: 0.85 }),
      )
      assert.notEqual(decision.outcome, 'reject')
    })

    test('off-topic subject alone never rejects, even with no Sanity signal', () => {
      const decision = runPolicy(
        signals({ offTopicSubject: 0.95, aboutSanity: 0.1, aboutWebDevelopment: 0.1 }),
      )
      assert.notEqual(decision.outcome, 'reject')
    })

    test('a named stack keeps a utility-looking contribution out of auto-reject', () => {
      const decision = runPolicy(
        signals({ consumerUtility: 0.95, aboutSanity: 0.88, aboutWebDevelopment: 0.9 }),
      )
      assert.notEqual(decision.outcome, 'reject')
    })
  })

  describe('uncertainty goes to a human', () => {
    test('sends a contribution with too little detail to review', () => {
      const decision = runPolicy(signals({ substance: 0.5 }))
      assert.equal(decision.outcome, 'review')
      assert.equal(decision.approved, undefined)
      assert.match(decision.reasons.join(' '), /too little detail/i)
    })

    test('sends a single moderately-confident spam signal to review', () => {
      // 0.7-0.9 is the band where the model is leaning but not sure.
      const decision = runPolicy(
        signals({ consumerUtility: 0.75, aboutSanity: 0.04, aboutWebDevelopment: 0.05 }),
      )
      assert.equal(decision.outcome, 'review')
    })
  })

  describe('thresholds', () => {
    test('a signal just below spamSignal does not fire', () => {
      const below = runPolicy(
        signals({
          consumerUtility: THRESHOLDS.spamSignal - 0.01,
          aboutSanity: 0.02,
          aboutWebDevelopment: 0.02,
        }),
      )
      assert.equal(
        below.reasons.some((r) => /consumer web tool/.test(r)),
        false,
      )
    })

    test('a signal exactly at spamSignal fires', () => {
      const at = runPolicy(
        signals({
          consumerUtility: THRESHOLDS.spamSignal,
          aboutSanity: 0.02,
          aboutWebDevelopment: 0.02,
        }),
      )
      assert.ok(at.reasons.some((r) => /consumer web tool/.test(r)))
    })

    test('spamRating stays inside the 0-7 range the schema documents', () => {
      const worst = runPolicy({
        aboutSanity: 0,
        aboutWebDevelopment: 0,
        prohibitedCategory: 1,
        consumerUtility: 1,
        directoryPromotion: 1,
        trainingCourseSales: 1,
        placeholderSubmission: 1,
        offTopicSubject: 1,
        substance: 0,
      })
      assert.ok(worst.spamRating >= 0 && worst.spamRating <= 7, `got ${worst.spamRating}`)
      assert.equal(worst.outcome, 'reject')

      const best = runPolicy(CLEAN)
      assert.ok(best.spamRating >= 0 && best.spamRating <= 7, `got ${best.spamRating}`)
    })
  })
})

describe('buildState', () => {
  test('strips the contribution. prefix and drops empty fields', () => {
    const state = buildState({
      contributionType: 'contribution.showcaseProject',
      title: '  Baltic Village  ',
      summary: '   ',
      content: null,
      links: ['https://example.com', null, undefined, ''],
    })
    assert.equal(state.contributionType, 'showcaseProject')
    assert.equal(state.title, 'Baltic Village')
    assert.equal(state.summary, null)
    assert.equal(state.content, null)
    assert.deepEqual(state.links, ['https://example.com'])
  })

  test('truncates content so a long body cannot crowd out the decision', () => {
    const state = buildState({
      contributionType: 'contribution.guide',
      title: 'A guide',
      content: 'x'.repeat(CONTENT_LIMIT * 2),
    })
    assert.equal(state.content?.length, CONTENT_LIMIT)
  })

  test('tolerates a contribution with nothing but a type', () => {
    const state = buildState({ contributionType: 'contribution.tool' })
    assert.equal(state.title, '')
    assert.deepEqual(state.links, [])
  })
})

describe('question set', () => {
  test('every question the policy reads exists in the question set', () => {
    // Guards against renaming a question without updating the policy, which
    // would otherwise read `undefined` and compare it as NaN.
    for (const id of Object.keys(CLEAN)) {
      assert.ok(id in QUESTIONS, `${id} is read by the policy but not asked`)
    }
    assert.equal(Object.keys(QUESTIONS).length, Object.keys(CLEAN).length)
  })

  test('score questions have at least two ordered levels', () => {
    for (const [id, question] of Object.entries(QUESTIONS)) {
      if (question.type !== 'score') continue
      assert.ok(question.criteria.length >= 2, `${id} needs at least two levels`)
    }
  })

  test('yes/no questions describe both outcomes', () => {
    for (const [id, question] of Object.entries(QUESTIONS)) {
      if (question.type !== 'boolean') continue
      assert.ok(question.criteria.true, `${id} has no true criteria`)
      assert.ok(question.criteria.false, `${id} has no false criteria`)
    }
  })
})
