import {NowRequest, NowResponse} from '@now/node';
import puppeteer from 'puppeteer';

import {writeClient} from './curate-contribution';

const query = /* groq */ `
*[_id == $id][0] {
  ogImage,
  _type,
  _type == "person" => {
    "title": name,
    "suptitle": "Contributor",
    "image": photo,
  },
  _type match "contribution.**" => {
    title,
    image,
  },
  _type == "contribution.tool" => {
    "toolColor": color,
    "suptitle": "Plugin / Tool",
  },
  _type == "contribution.schema" => {
    "suptitle": "Schema / Snippet",
    "snippet": schemaFiles[defined(code)][0].code,
  },
  _type == "contribution.showcaseProject" => {
    "suptitle": "Project",
    "image": coalesce(image, projectScreenshots[0], studioScreenshots[0]),
  },
  _type == "contribution.starter" => {
    "suptitle": "Starter",
  },
  _type == "contribution.guide" => {
    "suptitle": "Guide",
  },
  // If we automatize non-contributions:
  _type match "taxonomy.**" => {
    title,
    "image": logo,
    "toolColor": color,
  },
  _type == "caseStudy" => {
    "title": coalesce(projectOwner->.name, title),
    "suptitle": "Case Study",
    "image": coalesce(mainImage, previewImage),
  },
}
`;

export default async (req: NowRequest, res: NowResponse) => {
  // Used when we want to force a regeneration of the image
  const forceGenerate = req.query.forceGenerate === 'true';

  const {id: onDemandId} = req.query;
  const {ids: webhookIds} = typeof req.body === 'object' ? req.body : ({} as any);
  const allIds = [
    ...(onDemandId ? [onDemandId] : []),
    ...((typeof webhookIds === 'object' && webhookIds?.updated) || []),
    ...((typeof webhookIds === 'object' && webhookIds?.created) || []),
  ];
  const id = allIds[0];
  const publishedId = id?.replace('drafts.', '');

  if (!id) {
    return res.status(400).end('Missing document _id');
  }

  try {
    const data = await writeClient.fetch(query, {id});
    if (!data?.title) {
      return res.status(500).end("Couldn't find this _id");
    }
    if (data?.ogImage && !forceGenerate) {
      return res.status(200).json({message: 'ogImage already present'});
    }
    const path = `og-image?template=community&data=${encodeURIComponent(
      JSON.stringify({
        ...data,
        snippet: data.snippet?.code
          ? {
              ...data.snippet,
              // To prevent huge query strings that can't be parsed, we need to limit the size of the snippet
              code: data.snippet.code.slice(0, 600),
            }
          : undefined,
      })
    )}`;
    // const url = `http://localhost:3000/${path}`;
    const url = `https://www.sanity.work/${path}`;

    // For debugging URLs:
    // console.log({ url })
    // return res.status(200).end(url)

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({width: 1200, height: 630});
    await page.goto(url);
    // Wait for the image to load
    await page.waitForTimeout(1500);
    const screenshot = await page.screenshot();

    await browser.close();
    if (screenshot instanceof Buffer) {
      const newAsset = await writeClient.assets.upload('image', screenshot, {
        source: {
          name: 'get-contribution-image',
          id: 'get-contribution-image',
        },
      });
      const getPatch = (targetId: string) =>
        writeClient.patch(targetId).set({
          ogImage: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: newAsset._id,
            },
          },
        });
      const hasDraft = await writeClient.fetch(`defined(*[_id == "drafts.${publishedId}"])`);
      let transaction = writeClient.transaction().patch(getPatch(publishedId));
      if (hasDraft) {
        transaction = transaction.patch(getPatch(`drafts.${publishedId}`));
      }
      await transaction.commit();
      return res.status(200).json({message: 'Success', uploadedAsset: newAsset});
    } else {
      return res.status(500).json({message: 'Something went wrong, try again.'});
    }
    // return res.status(200).end(screenshot)
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: 'Something went wrong, try again.'});
  }
};
