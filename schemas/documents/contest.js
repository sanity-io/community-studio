export default {
    name: 'taxonomy.contest',
    title: 'Contest',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string'
        },
        {
            title: 'Slug',
            name: 'slug',
            type: 'slug',
            options: {
                source: 'title'
            },
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text'
        }
    ]
}