import {useClient} from 'sanity';

export const getCurrentUser = () => {
  return new Promise(async function (res, rej) {
    const me = await useClient().request({uri: '/users/me'})
    useClient()
        .withConfig({apiVersion: '2022-01-07'})
        .fetch(`*[_type == "person" && sanityId == $userId]`, {userId: me.id})
        .then((result) => {
          res(result[0]);
        })
        .catch((err) => {
          rej(err);
        });
  });
};
