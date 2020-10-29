export default {
  name: 'project',
  type: 'document',
  title: 'Project',
  /* initialValue: {
    author: getAuthor()
  }, */
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Project name'
    },
    {
      name: 'url',
      type: 'url',
      title: 'URL'
    },
    {
      name: 'author',
      type: 'reference',
      to: [
        {
          type: 'person'
        }
      ]
    },

    {
      name: 'duration',
      type: 'object',
      title: 'Duration',
      fields: [
        {
          name: 'from',
          type: 'date',
          title: 'From'
        },
        {
          name: 'to',
          type: 'date',
          title: 'To',
          validation: Rule => Rule.required().min(Rule.valueOfField('from'))
        }
      ]
    },
    {
      name: 'studioGallery',
      type: 'array',
      title: 'Sanity Studio Screenshots',
      description: 'Here’s how to take a nice screenshot', // @todo: find instructions for how to take the best screenshot
      of: [
        {
          type: 'studioImage'
        }
      ]
    },
    {
      name: 'technologies',
      type: 'array',
      title: 'Technologies',
      of: [
        {
          name: 'technology',
          type: 'string'
        }
      ]
    },
    /**
     * @todo: Figure out how best to connect this with solutions on admin.sanity.io
     */
    {
      name: 'solutions',
      type: 'array',
      title: 'Solutions',
      of: [
        {
          name: 'solutions',
          type: 'string'
        }
      ]
    }
  ]
}

/**
 * @todo:
 * - Add collaborators
 */
