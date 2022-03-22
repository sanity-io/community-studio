import {VercelRequest, VercelResponse} from '@vercel/node';
import fetch from 'axios';

export default async (req: VercelRequest, res: VercelResponse) => {
  const {repoId} = req.query;

  if (!repoId) {
    return res.status(400).end('No repoID provided');
  }

  const createRes = await fetch(`https://www.sanity.io/create?template=${repoId}`);
  return res.status(createRes.status).end('');
};
