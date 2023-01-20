//V3FIXME
//PROBABLY NOT NECESSARY ANYMORE
import userStore from 'part:@sanity/base/user';
import client from 'part:@sanity/base/client';

export const getCurrentUser = () => {
  return new Promise(function (res, rej) {
    userStore.me.subscribe((user) => {
      client
        .withConfig({apiVersion: '2022-01-07'})
        .fetch(`*[_type == "person" && sanityId == $userId]`, {userId: user.id})
        .then((result) => {
          res(result[0]);
        });
    });
  });
};
