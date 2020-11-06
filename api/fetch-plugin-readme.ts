require('dotenv').config();

import fetch from 'node-fetch';
import {NowRequest, NowResponse} from '@now/node';

export default async (req: NowRequest, res: NowResponse) => {
  const {readmeUrl} = req.query;

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (typeof readmeUrl !== 'string') {
    return res.status(400).json({
      error: 'Missing readme URL',
    });
  }

  try {
    const readmeRequest = await fetch(readmeUrl);
    const markdown = await readmeRequest.text();

    return res.status(200).json({
      file: markdown,
    });
  } catch (error) {
    return res.status(500).json({
      error: "We couldn't fetch the selected readme URL",
    });
  }
};
