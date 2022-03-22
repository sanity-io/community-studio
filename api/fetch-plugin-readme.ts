import dotenv from 'dotenv';
dotenv.config();

import fetch from 'axios';
import {VercelRequest, VercelResponse} from '@vercel/node';

export default async (req: VercelRequest, res: VercelResponse) => {
  const {readmeUrl} = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (typeof readmeUrl !== 'string') {
    return res.status(400).json({
      error: 'Missing readme URL',
    });
  }

  try {
    const readmeRequest = await fetch(readmeUrl);
    const markdown = await readmeRequest.data;

    return res.status(200).json({
      file: markdown,
    });
  } catch (error) {
    return res.status(500).json({
      error: "We couldn't fetch the selected readme URL",
    });
  }
};
