/**
 * The moderation policy for community contributions, expressed as atomic Jev
 * questions plus the code that combines their answers.
 *
 * Nothing in this file performs I/O, so `runPolicy` can be replayed against the
 * labelled dataset in `scripts/evaluate-contributions.ts` without calling Jev.
 *
 * Two rules from https://docs.typesafe.ai/model-jaggedness/jev-1.13 shape the
 * questions below:
 *
 * - One judgement per question. The old single "rate this 1-7 for spam" prompt
 *   bundled topic relevance, tone, completeness and prohibited content into one
 *   number, which is why a legitimate Sanity guide could come back as a 7.
 * - Jev reads questions literally, so each boundary case lives in `criteria`
 *   rather than being left to inference.
 */

/** The five contribution types that can reach the evaluator. */
export type ContributionType =
  | 'contribution.guide'
  | 'contribution.schema'
  | 'contribution.showcaseProject'
  | 'contribution.starter'
  | 'contribution.tool'

/** A contribution flattened into the fields the policy actually reads. */
export type ContributionState = {
  contributionType: string
  title: string
  summary: string | null
  content: string | null
  links: string[]
}

/**
 * Jev ingests `state` once and answers every question against it in parallel,
 * so asking all nine costs roughly the same as asking one. Questions that don't
 * apply to a given contribution type are still asked and simply ignored when
 * composing the decision — the "speculative fan-out" pattern.
 *
 * `boolean` is the AI SDK's name for what TypeSafe's own docs call a Noul: the
 * answer is `probability`, the model's P(true), not a confidence.
 */
export const QUESTIONS = {
  aboutSanity: {
    type: 'boolean',
    instructions:
      'Does this entry describe something that was built with Sanity, or something made to be used together with Sanity?',
    criteria: {
      true: 'The entry says the thing it describes uses Sanity, was built on Sanity, or is a plugin, template, schema, starter, guide or tool for Sanity.',
      false: 'Sanity is never connected to the thing being described.',
    },
  },
  aboutWebDevelopment: {
    type: 'boolean',
    instructions:
      'Does this entry name a specific web development technology, such as a framework, library, programming language, CMS, or hosting platform?',
    criteria: {
      true: 'A named technology appears, for example Next.js, Astro, React, Tailwind CSS, TypeScript, GROQ, Shopify or Vercel.',
      false: 'No specific development technology is named.',
    },
  },
  prohibitedCategory: {
    type: 'boolean',
    instructions:
      'Is this entry advertising something in a category this developer community does not accept?',
    criteria: {
      true: 'The entry advertises cryptocurrency, tokens or NFTs; online gambling, casinos or betting; adult or sexual content; medicines, supplements or medical treatments; academic essay or assignment writing services; or pirated, cracked or licence-bypassing software.',
      false: 'The entry is about none of those categories.',
    },
  },
  consumerUtility: {
    type: 'boolean',
    instructions:
      'Is the thing being advertised a ready-made consumer web tool for end users, rather than something a developer would build with?',
    criteria: {
      true: 'It is a finished online utility used by visiting a page, for example a file or image converter, watermark remover, background remover, AI headshot or avatar generator, video downloader, calculator, unit converter, name or text generator, temporary email service, typing test, or a browser game.',
      false:
        'It is something a developer installs, reads, copies or builds with, such as a plugin, library, starter, schema, code snippet, guide, or a website built for a client or organisation.',
    },
  },
  directoryPromotion: {
    type: 'boolean',
    instructions:
      'Does this entry mainly promote a directory, listing site, link submission service, or SEO backlink service?',
    criteria: {
      true: 'The thing being promoted is a catalogue of other products or a service for getting listed and acquiring backlinks.',
      false: 'The entry promotes something other than a directory or listing service.',
    },
  },
  trainingCourseSales: {
    type: 'boolean',
    instructions:
      'Is this entry an advertisement for a paid training course, bootcamp, certification or coaching programme?',
    criteria: {
      true: 'The entry sells enrolment in a course, class, bootcamp or certification, including online training with fees, batches or schedules.',
      false:
        'The entry is not selling course enrolment. Free written tutorials, guides and documentation are not course sales.',
    },
  },
  placeholderSubmission: {
    type: 'boolean',
    instructions: 'Is this a test, placeholder, or nonsense entry rather than a real submission?',
    criteria: {
      true: 'The title or content is filler such as "test", "New project", "asdf", random characters, or lorem ipsum.',
      false: 'The entry names and describes a real, specific thing, even if only briefly.',
    },
  },
  offTopicSubject: {
    type: 'boolean',
    instructions:
      'Is the subject of this entry unrelated to software, websites, digital products, design, or the work of a business that would commission a website?',
    criteria: {
      true: 'The subject is something like health advice, personal finance tips, travel deals, or general lifestyle content, with no connection to building or running a website.',
      false:
        'The subject relates to software, websites, digital products, design, or is a company, organisation, event or person whose website is being shown.',
    },
  },
  substance: {
    type: 'score',
    instructions:
      'How much does this entry explain about the thing it describes, beyond simply naming it?',
    criteria: [
      'Nothing beyond a name or a single generic phrase.',
      'A one-line description of what it is, with no further detail.',
      'A short but concrete description of what it is and who it is for.',
      'A detailed explanation covering what it is, how it works, or how to use it.',
    ],
  },
} as const

export type QuestionId = keyof typeof QUESTIONS

/** Jev's answers, reduced to the numbers the policy reads. */
export type Signals = Record<QuestionId, number>

export type Decision = {
  /** `undefined` leaves the contribution in the studio's "Pending approval" queue. */
  approved: boolean | undefined
  outcome: 'approve' | 'reject' | 'review'
  /** 0-7, kept on the same scale as the `spamRating` field the studio already shows. */
  spamRating: number
  reasons: string[]
}

/**
 * Thresholds are grouped here so tuning is a reviewable diff rather than a hunt
 * through branches. They were fitted against 384 human-labelled contributions;
 * see `scripts/evaluate-contributions.ts`.
 */
export type Thresholds = {
  spamSignal: number
  spamSignalStrong: number
  onTopic: number
  substance: number
  reject: number
  approve: number
}

export const THRESHOLDS: Thresholds = {
  /** P(true) at or above which a spam signal is treated as firing. */
  spamSignal: 0.7,
  /** P(true) at or above which a single spam signal is enough to auto-reject. */
  spamSignalStrong: 0.9,
  /** P(true) at or above which the contribution counts as on-topic. */
  onTopic: 0.5,
  /** `substance` score at or above which the entry says enough to auto-approve. */
  substance: 1.5,
  /** Risk at or above which we auto-reject. */
  reject: 3,
  /** Risk below which we auto-approve. */
  approve: 1,
}

/** Human-readable reason per spam signal, written for the moderator reading the queue. */
const SPAM_REASONS: Partial<Record<QuestionId, string>> = {
  prohibitedCategory: 'Advertises a category the community does not accept',
  consumerUtility: 'Advertises a ready-made consumer web tool rather than something to build with',
  directoryPromotion: 'Mainly promotes a directory or backlink service',
  trainingCourseSales: 'Advertises a paid training course',
  placeholderSubmission: 'Looks like a test or placeholder entry',
  offTopicSubject: 'Subject is unrelated to software, websites or a commissioned site',
}

/**
 * Signals that alone justify a rejection when the model is very sure and
 * nothing marks the contribution as on topic.
 *
 * Measured against the contributions whose labels we trust — the ones a
 * moderator explicitly approved after a rejection, and the ones a moderator
 * explicitly rejected — each of these fires almost only on spam:
 *
 *   prohibitedCategory   32 fires, 32 spam
 *   placeholderSubmission 16 fires, 16 spam
 *   directoryPromotion   16 fires, 16 spam
 *   trainingCourseSales   2 fires,  2 spam
 *   consumerUtility      43 fires, 41 spam
 *
 * `offTopicSubject` is the one spam question deliberately left off this list.
 * For a showcase the subject is legitimately a hotel or a law firm, so it fires
 * on exactly the client-work entries the old evaluator kept rejecting.
 */
const DECISIVE_SIGNALS: QuestionId[] = [
  'prohibitedCategory',
  'placeholderSubmission',
  'directoryPromotion',
  'trainingCourseSales',
  'consumerUtility',
]

/**
 * Signals that being on topic does not excuse.
 *
 * The on-topic discount exists to protect an agency's client work from
 * `offTopicSubject` and `consumerUtility`. It should not buy a crypto pitch a
 * pass just because it mentions a framework, which is what happened before
 * these two were separated out.
 */
const UNFORGIVABLE_SIGNALS: QuestionId[] = ['prohibitedCategory', 'placeholderSubmission']

/**
 * Turns Jev's answers into a decision.
 *
 * The shape that matters: being on topic *cancels* spam signals rather than
 * merely offsetting them. An agency showing a hotel site it built in Next.js and
 * Sanity trips `offTopicSubject` on the hotel, and the old evaluator rejected
 * exactly those. Here the named stack clears it.
 */
export function runPolicy(signals: Signals, thresholds: Thresholds = THRESHOLDS): Decision {
  const onTopic =
    signals.aboutSanity >= thresholds.onTopic || signals.aboutWebDevelopment >= thresholds.onTopic

  const firing = (Object.keys(SPAM_REASONS) as QuestionId[]).filter(
    (id) => signals[id] >= thresholds.spamSignal,
  )

  const decisive = firing.filter(
    (id) => DECISIVE_SIGNALS.includes(id) && signals[id] >= thresholds.spamSignalStrong,
  )

  // `offTopicSubject` is about the *subject* of a showcase, which for a client
  // website is legitimately a hotel or a law firm. On its own it is never spam.
  const substantiveFlags = firing.filter((id) => id !== 'offTopicSubject')

  let risk = substantiveFlags.length * 2 + (firing.includes('offTopicSubject') ? 1 : 0)
  if (decisive.length > 0) risk += 2
  if (onTopic) risk = Math.max(0, risk - 3)
  if (signals.substance < 1) risk += 1

  // Applied after the on-topic discount, so naming a framework cannot talk a
  // prohibited category or a placeholder entry back down into the review queue.
  //
  // The bar here is `spamSignal`, the same threshold that makes a signal fire at
  // all, and not `spamSignalStrong`. Gating the floor on the higher threshold
  // left a gap: a signal in the 0.70-0.89 band fired, was discounted by three
  // for being on topic, and came out at risk 0 — auto-approved with a spam
  // rating of 0. A crypto pitch that mentioned Next.js went live without a
  // human seeing it. Across the labelled set that band is 4/4 spam for
  // prohibitedCategory and 8/8 for placeholderSubmission, with no known-good
  // contribution anywhere in it, so there is nothing to protect by waiting for
  // 0.90.
  const unforgivable = firing.filter((id) => UNFORGIVABLE_SIGNALS.includes(id))
  if (unforgivable.length > 0) risk = Math.max(risk, thresholds.reject)

  const reasons = firing.map((id) => SPAM_REASONS[id] as string)

  let outcome: Decision['outcome']
  if (risk >= thresholds.reject) {
    outcome = 'reject'
  } else if (risk < thresholds.approve && signals.substance >= thresholds.substance) {
    outcome = 'approve'
  } else {
    outcome = 'review'
  }

  if (outcome === 'approve' && reasons.length === 0) {
    reasons.push(
      onTopic
        ? 'On topic for the community, with a substantive description'
        : 'No spam signals detected',
    )
  }
  if (outcome === 'review' && reasons.length === 0) {
    reasons.push(
      signals.substance < thresholds.substance
        ? 'Too little detail to judge automatically'
        : 'No clear signal either way',
    )
  }

  return {
    approved: outcome === 'approve' ? true : outcome === 'reject' ? false : undefined,
    outcome,
    spamRating: Math.max(0, Math.min(7, Math.round(risk))),
    reasons,
  }
}

/**
 * Builds the `state` Jev evaluates.
 *
 * Content is truncated because accuracy falls as the state fills with detail
 * unrelated to the decision, and the first few thousand characters carry the
 * signal. This replaces the old per-paragraph loop, which judged each paragraph
 * in isolation and rejected the whole contribution on the first one to cross the
 * threshold.
 */
export const CONTENT_LIMIT = 4000

/**
 * Every field across the five contribution types that holds a URL worth showing
 * the model, declared once.
 *
 * This list is the single most bug-prone thing in the evaluator, because it has
 * to track five schemas that name the same concept differently. It has been
 * wrong twice already:
 *
 * - The original evaluator branched on `externalUrl`, which exists on no type at
 *   all, so every guide took a hardcoded rating of 7 and was never evaluated.
 * - The first version of this list assumed `repositoryUrl`/`packageUrl` were
 *   universal. Starters use `repository`, `demoURL` and `purchaseUrl`, so every
 *   starter reached Jev with no links — losing the GitHub repository that
 *   distinguishes an open template from a paid one, which is exactly the
 *   distinction the false positives turned on.
 *
 * `tests/projection.test.ts` checks this list against `public/schema.json` in
 * both directions, so a third variation of that mistake fails a test instead of
 * silently degrading moderation.
 */
export const LINK_FIELDS = [
  // contribution.guide
  'externalLink',
  'canonicalUrl',
  // contribution.showcaseProject
  'url',
  // contribution.starter. The two deploy links are boilerplate URLs, but their
  // presence is signal in itself: a template with a working one-click deploy is
  // a real template.
  'repository',
  'demoURL',
  'purchaseUrl',
  'vercelDeployLink',
  'netlifyDeployLink',
  // contribution.tool
  'repositoryUrl',
  'packageUrl',
  'readmeUrl',
] as const

/**
 * Link fields present in the schemas but deliberately left out of the state,
 * listed so the projection test can tell an intentional omission from an
 * oversight.
 */
export const LINK_FIELDS_EXCLUDED = [
  // Studio v2 legacy, and the v2 support fields are hidden in the studio.
  'v2ReadmeUrl',
  // A repo slug such as "sanity-io/community-studio", not a URL, and hidden.
  'repoId',
] as const

/**
 * The `links` clause shared by the blueprint's event projection and the eval
 * harness, so the two cannot drift apart.
 */
export const LINKS_PROJECTION = `"links": [${LINK_FIELDS.join(', ')}]`

/**
 * The fields a README fetch needs, projected individually rather than only
 * inside `links`, because the fetcher has to tell a repository URL from a demo
 * URL to build a raw path.
 */
export const README_SOURCE_FIELDS = ['readmeUrl', 'repositoryUrl', 'repository'] as const

export const README_SOURCE_PROJECTION = README_SOURCE_FIELDS.join(', ')

export function buildState(input: {
  contributionType: string
  title?: string | null
  summary?: string | null
  content?: string | null
  links?: (string | null | undefined)[] | null
}): ContributionState {
  return {
    contributionType: input.contributionType.replace('contribution.', ''),
    title: (input.title ?? '').trim(),
    summary: input.summary?.trim() || null,
    content: input.content?.trim().slice(0, CONTENT_LIMIT) || null,
    links: (input.links ?? []).filter((url): url is string => typeof url === 'string' && !!url),
  }
}
