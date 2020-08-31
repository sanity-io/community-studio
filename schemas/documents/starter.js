export default {
  title: 'Starter',
  name: 'starter',
  type: 'document',
  fields: [
    {
      title: 'Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Description',
      name: 'description',
      type: 'text'
    },
    {
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title'
      }
    },
    {
      title: 'Repo ID',
      name: 'repoId',
      description:
        'A repo ID/slug for a GitHub repository (eg. sanity-io/some-template)',
      type: 'string',
      validation: Rule =>
        Rule.required().regex(/^[\w-]+\/[\w-]+$/, {name: 'repo id'})
    },
    {
      title: 'Image',
      name: 'image',
      description: 'Preferably SVG with aspect ratio 10/12 (portrait)',
      type: 'image'
    },
  ],
}
