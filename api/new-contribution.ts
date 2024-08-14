import { VercelRequest, VercelResponse } from '@vercel/node'
import OpenAI from 'openai'
import { writeClient } from './curate-contribution'
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook'

// Next.js will by default parse the body, which can lead to invalid signatures
export const config = {
  api: {
    bodyParser: false,
  },
}

async function readBody(readable: VercelRequest) {
  const chunks = []
  for await (const chunk of readable) {
    // @ts-expect-error
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks).toString('utf8')
}

const slackWebhookUrl = process.env.SPAM_RATING_SLACK_WEBHOOK_URL
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})
const webhookSecret = process.env.SANITY_WEBHOOK_SECRET
const TOKEN_LIMIT = Number(process.env.OPENAI_TOKEN_LIMIT) || 4097
const SUBMIT_TO_OPENAI = true
const WRITE_TO_SANITY = true
const POST_TO_SLACK = false

const stopwords = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'but',
  'is',
  'if',
  'then',
  'else',
  'when',
])

function filterText(text: string) {
  return text
    .split(/\s+/)
    .filter((word) => {
      if (word.startsWith('http') || word.includes('http') || !stopwords.has(word.toLowerCase())) {
        return true
      }
      return false
    })
    .join(' ')
}

function chunkText(text: string, tokenLimit: number): string[] {
  const words = text.split(' ')
  let chunk = ''
  let chunks: string[] = []

  for (let word of words) {
    if ((chunk + word).length > tokenLimit) {
      chunks.push(chunk.trim())
      chunk = ''
    }
    chunk += ' ' + word
  }

  if (chunk.length > 0) {
    chunks.push(chunk.trim())
  }

  return chunks
}

async function getSpamScore(title: string, body: string, threshold: number, tokenLimit: number) {
  const paragraphs = body.split('\n\n') // Splitting by paragraphs
  for (const paragraph of paragraphs) {
    const filteredParagraph = filterText(paragraph)
    const subParagraphs = chunkText(filteredParagraph, tokenLimit - title.length)

    for (const subParagraph of subParagraphs) {
      try {
        if (!SUBMIT_TO_OPENAI) {
          console.log({ role: 'user', content: `title: ${title}\npart of body: ${subParagraph}` })
        }

        if (SUBMIT_TO_OPENAI) {
          const chatCompletion = await openai.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: `You are a helpful forum moderator for a developer oriented forum where people share plugins, code snippets, guides, and project showcases. They are allowed to be promotional. Mentions of web technologies makes it less likely to be spammy. Mentions of Sanity makes it less likely to be spammy. I will give you a title, and part of the description or body of a contribution entry, and you will return a rating of 1-7 of how likely it is to be spam, along with the reasons for why you either consider it safe or a high chance of it being spam as structured JSON format like {"rating": <number>, "reasons": ["reason1", "reason2"]}`,
              },
              {
                role: 'user',
                content: `title: ${title}\npart of body/description: ${subParagraph}`,
              },
            ],
            model: 'gpt-4',
          })

          if (chatCompletion.choices?.[0]?.finish_reason === 'stop') {
            const spamAnalysis = JSON.parse(chatCompletion?.choices[0]?.message?.content || '') || {
              rating: 0,
              reasons: [],
            }

            const { rating, reasons } = spamAnalysis

            if (rating >= threshold) {
              return { stopEarly: true, rating, reasons }
            }
          }
        }
      } catch (e) {
        console.log(e)

        throw e
      }
    }
  }
  return { stopEarly: false, rating: 0, reasons: [] } // Use 0 or any other default value
}

// Remember to check https://www.sanity.io/organizations/oSyH1iET5/project/81pocpw8/api/webhooks/Ntwg7QfpgBLdccnY
type WEBHOOK_BODY = {
  _id: string
  title: string
  body: string
  _type: string
  externalUrl: string
}

export default async function (req: VercelRequest, res: VercelResponse) {
  const signature = req.headers[SIGNATURE_HEADER_NAME] as string
  const body = await readBody(req)
  // Only run in environments with a webhook secret. This is to prevent running this function in development.
  if (webhookSecret) {
    if (!isValidSignature(body, signature, webhookSecret)) {
      res.status(401).json({ success: false, message: 'Invalid signature' })
      return
    }
  }
  const document = req.body as WEBHOOK_BODY

  async function getSpamScoreFromType(document: WEBHOOK_BODY) {
    const { title, _type, body, } = document
    switch (_type) {
      case 'contribution.guide':
        if (document?.externalUrl) {
          return ['title', 'slug', 'body'].every((key: string) => key in document)
            ? await getSpamScore(title, body, 4, TOKEN_LIMIT)
            : { rating: 7, reasons: ['Lacks body'] }
        } else {
          return { rating: 4, reasons: ['External content'] }
        }

        break
      case 'contribution.schema':
        return ['title', 'body',].every((key: string) => key in document)
          ? await getSpamScore(title, body, 4, TOKEN_LIMIT)
          : { rating: 7, reasons: ['Lacks required fields'] }
        break
      case 'contribution.showcaseProject':

        return ['title', 'body'].every((key: string) => key in document)
          ? { rating: 4, reasons: [`Showcases projects aren't rated yet`] }
          : { rating: 7, reasons: ['Lacks required fields'] }
        break
      case 'contribution.starter':

        return ['title', 'body'].every((key: string) => key in document)
          ? await getSpamScore(title, body, 4, TOKEN_LIMIT)
          : { rating: 7, reasons: ['Lacks required fields'] }
        break
      case 'contribution.starter':

        return ['title', 'body'].every((key: string) => key in document)
          ? await getSpamScore(title, body, 4, TOKEN_LIMIT)
          : { rating: 7, reasons: ['Lacks required fields'] }
        break
      case 'contribution.tool':
        return ['title', 'body'].every((key: string) => key in document)
          ? await getSpamScore(title, body, 4, TOKEN_LIMIT)
          : { rating: 7, reasons: ['Lacks required fields'] }
        break

      default:
        return { rating: 7, reasons: ['Unknown contribution type'] }
        break
    }
  }

  const { rating, reasons } = await getSpamScoreFromType(document)
  const curatedContribution = {
    _id: `curated.${document._id}`,
    _type: 'curatedContribution',
    approved: rating < 6,
    contribution: {
      _ref: document._id,
      _type: 'reference',
      _weak: true,
    },
    spamRating: rating,
    approvalReasons: reasons,
  }

  if (WRITE_TO_SANITY) {
    await writeClient.createIfNotExists(curatedContribution)
  }

  res.status(200).send('Contribution processed.')
}
