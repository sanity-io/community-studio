import dotenv from 'dotenv';
dotenv.config();

import fetch from 'axios';
import type {VercelRequest, VercelResponse} from '@vercel/node';
import {writeClient, readClient} from './curate-contribution';

type PluginType = {
  _id: string;
  readmeUrl: string;
  readme?: string;
};

const handlerSecret = process.env.SANITY_WEBHOOK_SECRET || '';

const allPublishedPluginsQuery = `*[
  _type == "contribution.tool"
  && (hidden != true)
  && installWith match "sanity install"
  && !(_id in path("drafts.**"))
  && readmeUrl != null
]{
  _id,
  readme,
  readmeUrl
}`;

const buildPatches = (docs: [PluginType]) =>
  docs.map((doc: PluginType) => ({
    id: doc._id,
    patch: {
      set: {
        readme: doc.readme,
      },
    },
  }));

const createTransaction = (patches: any) =>
  patches.reduce(
    (tx: any, patch: any) => tx.patch(patch.id, patch.patch),
    writeClient.transaction()
  );

const commitTransaction = (tx: any) => tx.commit();

export default async (request: VercelRequest, response: VercelResponse) => {
  const {secret} = request.query;
  if (handlerSecret !== secret) {
    return response.status(401).send('Unauthorized');
  }
  let pluginsWithReadmes = [] as any;
  try {
    const plugins = await readClient.fetch(allPublishedPluginsQuery);
    pluginsWithReadmes = await Promise.all(
      plugins
        .map(async (plugin: PluginType): Promise<PluginType | undefined> => {
          const newReadme = await fetch(plugin.readmeUrl)
            .then((res) => res.data)
            .catch((err) => {
              console.log(err.response.status);
              return '';
            });
          // Only update if the readme has changed
          if (plugin.readme !== newReadme) {
            return {
              _id: plugin?._id,
              readmeUrl: plugin?.readmeUrl,
              readme: newReadme,
            };
          }
          return;
        })
        .filter(({_id}: {_id: string}) => _id)
    );
  } catch (error) {
    console.log(error);
    return response.status(500).json({message: 'error'});
  }

  try {
    const patches = buildPatches(pluginsWithReadmes);
    if (patches.length === 0) {
      return response.status(200).json({message: 'no patches'});
    }
    const tx = createTransaction(patches);
    const result = await commitTransaction(tx);
    console.log(result);
  } catch (error) {
    console.log(error);
    return response.status(500).json({message: 'error'});
  }
  return response.status(200).json({success: true});
};
