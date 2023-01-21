// @TODO: update to live URL once community is merged to master
//V3FIXME
//Check this is still the correct url for the preview
const getPreviewUrl = ({type, slug}) =>
  `https://www.sanity.io/api/preview?type=${type}&slug=${slug}`;

//V3FIXME
export const resolveProductionUrl = (prev, {document}) => {
  if (!document?._type) {
    return prev;
  }
  //V3FIXME check the structure of the url for the new /template route
  if (document._type === 'contribution.starter') {
    if (document.repoId) {
      return `https://sanity.io/template/${document.repoId}`;
    }
    return prev;
  }
  if (document._type === 'person') {
    if (document.handle?.current) {
      return getPreviewUrl({type: 'person', slug: document.handle.current});
    }
    return prev;
  }
  if (document._type.startsWith('contribution.')) {
    if (document.slug?.current) {
      return getPreviewUrl({type: document._type, slug: document.slug.current});
    }
    return prev;
  }
};
