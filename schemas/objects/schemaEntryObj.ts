export default {
  name: 'schemaEntryObj',
  title: 'Schema or code snippet',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Title or filename for this snippet of code',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'code',
      title: 'Code',
      description: 'Remember to lint and proof-read your code. You can shift+click the gutter to highlight lines.',
      type: 'code',
    },
  ],
}
