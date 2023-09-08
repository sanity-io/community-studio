import {YouTubePreview, icon} from '../components/YouTubePreview';


export default {
  name: 'youtube',
  title: 'YouTube embed',
  type: 'object',
  icon,
  fields: [
    {
      name: 'url',
      title: 'URL of the video',
      description: "Paste in the URL and we'll figure out the rest",
      type: 'url',
    },
    {
      name: 'title',
      title: 'Video title / headline',
      description: '⚡ Optional but highly encouraged for accessibility & SEO.',
      type: 'string',
    },
    {
      name: 'publishDate',
      title: 'Publish date',
      description: '❓ Optional.',
      type: 'date',
    },
    {
      name: 'description',
      title: 'Short description',
      description: '❓ Optional',
      type: 'string',
    },
  ],
  components: {
    preview: YouTubePreview,
  },
  preview: {
    select: {
      url: 'url',
    },
  },
};
