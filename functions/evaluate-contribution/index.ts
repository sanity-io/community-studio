import { createClient } from '@sanity/client'
import { documentEventHandler } from '@sanity/functions'
import { evaluateContribution } from '../../src/contributionEvaluation/evaluate'

/**
 * Scores a new community contribution for spam and records the result as a
 * curatedContribution.
 *
 * Three outcomes, not two. A contribution is auto-approved only when it is
 * clearly fine and auto-rejected only when it is clearly spam; anything in
 * between leaves `approved` unset, which is what puts it in the studio's
 * "Pending approval" list for a human. The evaluator this replaced always set
 * `approved`, so that queue was never used and 95 contributions had to be
 * approved by hand after being rejected automatically.
 *
 * The shape of the event payload is defined by the `projection` in
 * `sanity.blueprint.ts`.
 */
type ContributionEvent = {
  _id: string
  _type: string
  title: string | null
  description: string | null
  bodyText: string | null
  readme: string | null
  links: (string | null)[] | null
}

export const handler = documentEventHandler(async ({ context, event }) => {
  const contribution = event.data as ContributionEvent
  const curationId = `curated.${contribution._id}`

  const client = createClient({
    ...context.clientOptions,
    apiVersion: '2026-02-27',
    // The existence check below has to reflect writes made moments ago, and the
    // edge cache does not guarantee that. A stale miss would mean evaluating
    // the same contribution twice and overwriting nothing, but paying for it.
    useCdn: false,
  })

  // A contributor can publish more than once. Curation is the moderator's
  // record, so an existing one is never overwritten — and checking first saves
  // a model call rather than relying on createIfNotExists to discard the work.
  const alreadyCurated = await client.fetch<boolean>('defined(*[_id == $id][0]._id)', {
    id: curationId,
  })

  if (alreadyCurated) {
    console.log(`${contribution._id} is already curated; nothing to do`)
    return
  }

  let curation: {
    approved: boolean | undefined
    spamRating: number
    approvalReasons: string[]
    evaluationModel?: string
  }

  try {
    const evaluation = await evaluateContribution({
      contributionType: contribution._type,
      title: contribution.title,
      summary: contribution.description,
      content: contribution.bodyText || contribution.readme,
      links: contribution.links,
    })

    curation = {
      approved: evaluation.approved,
      spamRating: evaluation.spamRating,
      approvalReasons: evaluation.reasons,
      evaluationModel: evaluation.model,
    }

    // The signals are the audit trail. A moderator overruling a decision in the
    // studio can only see the reasons; these logs are what makes it possible to
    // work out afterwards which question drove it.
    console.log(
      JSON.stringify({
        contribution: contribution._id,
        type: contribution._type,
        outcome: evaluation.outcome,
        spamRating: evaluation.spamRating,
        signals: evaluation.signals,
      }),
    )
  } catch (error) {
    // An evaluation that cannot run is not a reason to reject someone's work,
    // or to drop it. Leave it for a human and say why.
    console.error(`Evaluation failed for ${contribution._id}`, error)
    curation = {
      approved: undefined,
      spamRating: 0,
      approvalReasons: ['Automatic evaluation failed — needs manual review'],
    }
  }

  await client.createIfNotExists({
    _id: curationId,
    _type: 'curatedContribution',
    contribution: {
      _ref: contribution._id,
      _type: 'reference',
      // Keeps the contributor able to delete their own document.
      _weak: true,
    },
    ...curation,
  })
})
