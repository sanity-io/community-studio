require('dotenv').config();

import sanityClient from '@sanity/client';
import {NowRequest, NowResponse} from '@now/node';

const projectId = process.env.SANITY_PROJECT_ID;

const client = sanityClient({
  projectId,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_CURATION_WRITE_TOKEN,
  useCdn: false,
});

/**
 * Document types that don't need approval to show up in the website
 */
const UNCURATED_DOC_TYPES = [
  'contribution.snippet',
  'contribution.showcaseProject',
  'contribution.tool',
  'contribution.schema',
  'contribution.snippet',
  'contribution.guide',
]

export default async (req: NowRequest, res: NowResponse) => {
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
      _weak: true
    },
  }

  try {
    await client.createIfNotExists(curatedDoc)

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      error: "We couldn't create the document",
    });
  }
};
