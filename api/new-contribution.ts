import {VercelRequest, VercelResponse} from '@vercel/node';
import axios from 'axios';
import OpenAI from 'openai';
import toMarkdown from '@sanity/block-content-to-markdown';
import {writeClient, readClient} from './curate-contribution';
import {isValidSignature, SIGNATURE_HEADER_NAME} from '@sanity/webhook';

// Next.js will by default parse the body, which can lead to invalid signatures
export const config = {
  api: {
    bodyParser: false,
  },
};

async function readBody(readable: VercelRequest) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

const slackWebhookUrl = process.env.SPAM_RATING_SLACK_WEBHOOK_URL;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;
const TOKEN_LIMIT = process.env.OPENAI_TOKEN_LIMIT || 4097;
const SUBMIT_TO_OPENAI = true;
const WRITE_TO_SANITY = false;
const POST_TO_SLACK = false;

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
]);

function filterText(text: string) {
  return text
    .split(/\s+/)
    .filter((word) => {
      if (word.startsWith('http') || word.includes('http') || !stopwords.has(word.toLowerCase())) {
        return true;
      }
      return false;
    })
    .join(' ');
}

function chunkText(text: string, tokenLimit: number): string[] {
  const words = text.split(' ');
  let chunk = '';
  let chunks: string[] = [];

  for (let word of words) {
    if ((chunk + word).length > tokenLimit) {
      chunks.push(chunk.trim());
      chunk = '';
    }
    chunk += ' ' + word;
  }

  if (chunk.length > 0) {
    chunks.push(chunk.trim());
  }

  return chunks;
}

async function getSpamScore(title: string, body: string, threshold: number, tokenLimit: number) {
  const paragraphs = body.split('\n\n'); // Splitting by paragraphs
  for (const paragraph of paragraphs) {
    const filteredParagraph = filterText(paragraph);
    const subParagraphs = chunkText(filteredParagraph, tokenLimit - title.length);

    for (const subParagraph of subParagraphs) {
      try {
        if (!SUBMIT_TO_OPENAI) {
          console.log({role: 'user', content: `title: ${title}\npart of body: ${subParagraph}`});
        }

        if (SUBMIT_TO_OPENAI) {
          const chatCompletion = await openai.chat.completions.create({
            messages: [
              {
                role: 'system',
                content: `You are a helpful project gallery forum moderator. I will give you a title, and part of the body of a post, and you will return a rating of 1-7 of how likely it is to be spam, along with the reasons for why you either consider it safe or a high chance of it being spam as structured JSON format like {"rating": <number>, "reasons": ["reason1", "reason2"]}`,
              },
              {role: 'user', content: `title: ${title}\npart of body: ${subParagraph}`},
            ],
            model: 'gpt-3.5-turbo',
          });

          if (chatCompletion.choices?.[0]?.finish_reason === 'stop') {
            const spamAnalysis = JSON.parse(chatCompletion?.choices[0]?.message?.content) || {
              rating: 0,
              reasons: [],
            };

            const {rating, reasons} = spamAnalysis;

            if (rating >= threshold) {
              return {stopEarly: true, rating, reasons};
            }
          }
        }
      } catch (e) {
        console.log(e);

        throw e;
      }
    }
  }
  return {stopEarly: false, rating: 0, reasons: []}; // Use 0 or any other default value
}

export default async function (req: VercelRequest, res: VercelResponse) {
  const signature = req.headers[SIGNATURE_HEADER_NAME] as string;
  const body = await readBody(req);
  // Only run in environments with a webhook secret. This is to prevent running this function in development.
  if (webhookSecret) {
    if (!isValidSignature(body, signature, webhookSecret)) {
      res.status(401).json({success: false, message: 'Invalid signature'});
      return;
    }
  }
  const document = req.body;

  const title = document?.title;
  const bodyMarkdown = toMarkdown(document.body, {});

  const {rating, reasons} = await getSpamScore(title, bodyMarkdown, 4, TOKEN_LIMIT);

  const curatedContribution = {
    _type: 'curatedContribution',
    approved: rating < 4,
    contribution: {
      _ref: document._id,
      _type: 'reference',
      _weak: true,
    },
    spamRating: rating,
    approvalReasons: reasons,
  };

  if (WRITE_TO_SANITY) {
    await writeClient.createIfNotExists(curatedContribution);
  }

  if (POST_TO_SLACK) {
    const slackMessage = {
      text: `New contribution received: ${title}.\nSpam Rating: ${rating}\nReasons: ${reasons.join(
        ', '
      )}`,
    };

    await axios.post(slackWebhookUrl, slackMessage);
  }

  res.status(200).send('Contribution processed.');
}
