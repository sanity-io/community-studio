export default {
  name: 'guideBody',
  type: 'array',
  title: 'Guide content',
  of: [
    {
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading 2', value: 'h2'},
        {title: 'Heading 3', value: 'h3'},
        {title: 'Quote', value: 'blockquote'},
      ],
    },
    {
      type: 'image',
      fields: [
        {
          name: 'caption',
          title: 'Visible caption below the image',
          description:
            "⚡ Optional but highly encouraged to contextualize readers as they navigate through your guide's images.",
          type: 'string',
          options: {
            isHighlighted: true,
          },
          validation: (Rule) =>
            Rule.required().warning('Adding a caption will help contextualizing readers.'),
        },
        {
          name: 'alt',
          title: 'Alternative text for screen readers',
          description:
            "Optional. If the caption above is descriptive enough, there's no need to fill this field. Else, consider adding alternative text to make content more accessible.",
          type: 'string',
          options: {
            isHighlighted: true,
          },
        },
      ],
      options: {
        hotspot: true,
        storeOriginalFilename: false,
      },
    },
    {
      type: 'youtube',
    },
    {
      title: 'Code block',
      type: 'code',
    },
    {
      type: 'callout',
    },

    // {
    //V3FIXME
    //   type: 'twitterEmbed',
    // },

    // Types carried from admin.sanity.io that shouldn't be available:
    // (uncomment them when editing these migrated documents)
    // {
    //   type: 'youtube',
    //   name: 'youtubePlaylist',
    //   readOnly: true
    // },
    // @TODO: migrate all ui.screenshot blocks to plain image
    // {
    //   type: 'youtube',
    //   name: 'ui.screenshot',
    //   readOnly: true
    // },
    // {
    //   type: 'youtube',
    //   name: 'codesandbox',
    //   readOnly: true
    // },
    // {
    //   type: 'youtube',
    //   name: 'starterTemplates',
    //   readOnly: true
    // },
  ],
};
