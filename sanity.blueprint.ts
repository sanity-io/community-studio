import { defineBlueprint, defineDocumentFunction } from '@sanity/blueprints'
import { LINKS_PROJECTION, README_SOURCE_PROJECTION } from './src/contributionEvaluation/questions'

/**
 * Infrastructure for the community studio's content-triggered automation.
 *
 * The contribution evaluator used to be a Vercel serverless function behind a
 * GROQ-powered webhook. Two of the bugs that produced its false positives came
 * from that arrangement rather than from the model:
 *
 * - The payload shape lived in a webhook configured through the management UI,
 *   so the handler read `externalUrl`, a field no contribution type has. Here the
 *   `projection` is version controlled next to the code that consumes it.
 * - The endpoint was public, and its signature check silently passed every
 *   request. A function has no endpoint to forge.
 */
export default defineBlueprint({
  resources: [
    defineDocumentFunction({
      name: 'evaluate-contribution',
      // The default is 10s. Evaluation is one Jev call (~0.8s) plus, for tools
      // and starters, a README fetch from GitHub bounded at 4s. 30s leaves room
      // for a slow hop without the function being killed mid-write.
      timeout: 30,
      event: {
        // `create` covers a contribution being published for the first time.
        // `update` is included because a contributor can publish an empty draft
        // and fill it in afterwards; the function itself skips contributions
        // that have already been curated, so a republish costs one GROQ read
        // rather than another model call.
        on: ['create', 'update'],

        // Listed explicitly rather than matched with a wildcard. The function
        // writes a curatedContribution, and a pattern like `contribution.*`
        // combined with a careless rename is how a function ends up triggering
        // itself.
        // The dataset is pinned twice, in `resource` below and again here.
        // `resource` does not show up in `sanity blueprints plan`, and this
        // project has more than twenty dataset copies — including a full
        // `development` clone of production. A function that quietly ran against
        // all of them would evaluate the same backlog over and over. The
        // redundant check is visible in the plan output, so it is verifiable
        // before a deploy rather than after a bill.
        filter:
          'sanity::dataset() == "production" && _type in ["contribution.guide", ' +
          '"contribution.schema", "contribution.showcaseProject", ' +
          '"contribution.starter", "contribution.tool"]',

        // Exactly what the evaluator reads, flattened here so the function needs
        // no follow-up request. `body` is Portable Text on four of the five
        // types; tools carry Markdown in `readme` instead.
        projection: `{
          _id,
          _type,
          title,
          description,
          "bodyText": pt::text(body[0...8]),
          readme,
          ${README_SOURCE_PROJECTION},
          ${LINKS_PROJECTION}
        }`,

        resource: {
          type: 'dataset',
          id: '81pocpw8.production',
        },
      },
    }),
  ],
})
