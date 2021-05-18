import {NowRequest, NowResponse} from '@now/node';
import fetch from 'node-fetch';

export default async (req: NowRequest, res: NowResponse) => {
  const {repoId} = req.query;

  if (!repoId) {
    return res.status(400).end('No repoID provided');
  }

  const createRes = await fetch(`https://www.sanity.io/create?template=${repoId}`);
  return res.status(createRes.status).end("");
};
