//V3FIXME
import sanityClient from '@sanity/client';
import {VercelRequest, VercelResponse} from '@vercel/node';
import dotenv from 'dotenv';

dotenv.config();

export const writeClient = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_CURATION_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2022-01-07',
});

export const readClient = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  useCdn: false,
  apiVersion: '2022-01-07',
});

/**
 * Document types that don't need approval to show up in the website
 */
const UNCURATED_DOC_TYPES = [
  'contribution.showcaseProject',
  'contribution.tool',
  'contribution.schema',
  'contribution.guide',
];

export default async (req: VercelRequest, res: VercelResponse) => {
  const {docId, contributionType} = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (typeof docId !== 'string') {
    return res.status(400).json({
      error: 'Missing doc id',
    });
  }
  if (typeof contributionType !== 'string') {
    return res.status(400).json({
      error: 'Missing contribution type',
    });
  }

  const curatedDoc = {
    _id: `curated.${docId}`,
    _type: 'curatedContribution',
    // If the document type needs approval, we set undefined to call the attention to admin editors for this curatedContribution
    approved: UNCURATED_DOC_TYPES.includes(contributionType) ? true : undefined,
    contribution: {
      _type: 'reference',
      _ref: docId,
      // Make sure the author can delete their document
      _weak: true,
    },
  };

  try {
    await writeClient.createIfNotExists(curatedDoc);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "We couldn't create the document",
    });
  }
};
