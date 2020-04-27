import {NowRequest, NowResponse} from '@now/node';

export default async (req: NowRequest, res: NowResponse) => {
  res.send({
    domain: 'sanity-io-demo.eu.auth0.com',
    clientId: 'cssYOH8VE9jX6i1SIn95svqf4B5Mx32A',
  });
};
