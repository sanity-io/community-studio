import { gateway } from '@ai-sdk/gateway'
import { experimental_evaluate as evaluate } from 'ai'
import {
  QUESTIONS,
  buildState,
  runPolicy,
  type ContributionState,
  type Decision,
  type QuestionId,
  type Signals,
} from './questions'

/**
 * Jev, TypeSafe's System One model, reached through the Vercel AI Gateway the
 * studio's functions already deploy behind. Billing, rate limits and request
 * logs stay with the rest of the project's AI usage.
 */
const MODEL_ID = 'typesafe-ai/jev'

export type Evaluation = Decision & {
  signals: Signals
  model: string
  /** Jev evaluates every question against one state, so this is the whole call. */
  usage: { inputTokens: number | undefined; outputTokens: number | undefined }
}

/**
 * Reads one answer as a plain number: P(true) for a yes/no question, or the
 * position on the level scale for a score.
 */
function toSignal(answer: { type: string } & Record<string, unknown>): number {
  if (answer.type === 'boolean') return answer.probability as number
  if (answer.type === 'score') return answer.score as number
  throw new Error(`Unexpected answer type from ${MODEL_ID}: ${answer.type}`)
}

/**
 * Evaluates one contribution and returns both the decision and the numbers
 * behind it, so a moderator overruling the result can see what drove it.
 */
export async function evaluateContribution(
  input: Parameters<typeof buildState>[0],
  options: { abortSignal?: AbortSignal } = {},
): Promise<Evaluation & { state: ContributionState }> {
  const state = buildState(input)

  const result = await evaluate({
    model: gateway.evaluation(MODEL_ID),
    state,
    questions: QUESTIONS,
    abortSignal: options.abortSignal,
  })

  const signals = Object.fromEntries(
    Object.keys(QUESTIONS).map((id) => [
      id,
      toSignal(result.answers[id as QuestionId] as { type: string } & Record<string, unknown>),
    ]),
  ) as Signals

  return {
    ...runPolicy(signals),
    signals,
    state,
    model: result.response.modelId,
    usage: { inputTokens: result.usage.inputTokens, outputTokens: result.usage.outputTokens },
  }
}
