import dotenv from 'dotenv';
dotenv.config();

import fetch from 'axios';
import type {VercelRequest, VercelResponse} from '@vercel/node';
import {writeClient, readClient} from './curate-contribution';
import {isValidRequest} from '@sanity/webhook';

const secret = process.env.SANITY_WEBHOOK_SECRET || '';

export default async (request: VercelRequest, response: VercelResponse) => {
  if (!isValidRequest(request, secret)) {
    console.log('invalid webhook request');
    response.status(401).json({success: false, message: 'Invalid signature'});
    return;
  }
  const {_id, readmeUrl} = request?.body || {_id: '', readmeUrl: ''};
  console.log('got _id', _id);
  let readMeTxt;
  try {
    readMeTxt = await fetch(readmeUrl).then((res) => res.data);
    console.log('got readme');
  } catch (error) {
    return response.status(500).send("Didn't get readme");
  }

  const getPatch = (targetId: string, readmeTxt: string) => {
    return writeClient.patch(targetId).set({
      readme: readmeTxt,
    });
  };

  const hasDraft = await readClient.fetch(`count(*[_id == $id]) > 0`, {id: `drafts.${_id}`});
  console.log('has draft', hasDraft);
  let transaction = writeClient.transaction().patch(getPatch(_id, readMeTxt));
  if (hasDraft) {
    console.log('draft exists, patching');
    transaction = writeClient.transaction().patch(getPatch(`drafts.${_id}`, readMeTxt));
  }
  try {
    const result = await transaction.commit();
    console.log('result', result);
  } catch (error) {
    response.send(500).json({message: 'Error committing transaction'});
  }
  response.status(200).json({success: true});
};
