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
          type: 'string',
          options: {
            isHighlighted: true
          }
        },
        {
          name: 'alt',
          title: 'Alternative text for screen readers',
          description: '⚡ Optional but highly encouraged to help make the content more accessible',
          type: 'string',
          options: {
            isHighlighted: true
          }
        },
      ],
      options: {
        storeOriginalFilename: false,
      },
    },
    // {
    //   title: 'YouTube embed',
    //   type: 'youtube',
    //   name: 'youtube',
    //   description: 'Paste your regular YouTube link, we\'ll figure out the rest'
    // },
    // {
    //   title: 'Code block',
    //   type: 'codeInput',
    //   name: 'code',
    // },
  ],
}