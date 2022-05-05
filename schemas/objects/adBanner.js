export default {
  title: 'Ad Banner',
  name: 'adBanner',
  type: 'object',
  fields: [
    {
      title: 'Body',
      name: 'body',
      type: 'simpleBlockContent',
    },
  ],
  preview: {
    select: {
      body: 'body',
    },
    prepare({body}) {
      const block = (body || []).find((subBlock) => subBlock._type === 'block');
      return {
        title: block
          ? block.children
              .filter((child) => child._type === 'span')
              .map((span) => span.text)
              .join('')
          : 'No title',
      };
    },
  },
};
