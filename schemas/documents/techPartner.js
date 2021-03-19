//Content type for Sanity partners
 
export default{
    title:  "Technology Partner",
    name: "techPartner",
    type: "document",

    fields: [
      {

        title: "Company Name",
        name: "companyName",
        type: "string",
      },
      {
        title: 'One Liner',        
        name: 'oneLiner',        
        type: 'string'
      },
      {
        title: 'Short Description',        
        name: 'shortDesc',        
        type: 'text'
      },
      {
        title: 'Long Description',         
        name: 'longDesc',        
        type: 'array',         
        of: [{type: 'block'}]
      },
      {
        title: 'Partner Logo',
        name: 'partnerLogo',
        type: 'image',
        description: 'Ideally this image has a transparent background for use over other images or on non-white backgrounds.',
        options: {
            hotspot: true // <-- Defaults to false
        },
        fields: [
            {
                name: 'alt',
                type: 'string',
                title: 'Alt Text',
                description:  'Alternative text is required.',
                validation: Rule => [
                    Rule.required(),
                ],
                options: {
                    isHighlighted: true // <-- make this field easily accessible
                }
            },
            {
                // Editing this field will be hidden behind an "Edit"-button
                name: 'caption',
                type: 'string',
                title: 'Caption',
            },
            // https://www.sanity.io/docs/schema-types/reference-type
        ]
      },
      // Start references 
      {
        name: 'editors',
        type: 'array',
        title: '🖊️ Editor(s)',
        description:
          'Ask about context,to make appropiate description',
        of: [
          {
            type: 'reference',
            to: [{type: 'person'}],
          },
        ],
      },
      {
        name: 'techProjects',
        type: 'array',
        title: 'Partner Project(s)',
        description:
          'Ask about context,to make appropiate description',
        of: [
          {
            type: 'reference',
            to: [{type: 'contribution.showcaseProject'}],
            title: 'Partner Projects',
          },
        ],
      },
      {
        name: 'techStarters',
        type: 'array',
        title: 'Partner Starter(s)',
        description:
          'Ask about context,to make appropiate description',
        of: [
          {
            type: 'reference',
            to: [{type: 'contribution.starter'}],
            title: 'Partner Starters',
          },
        ],
      },
      {
        name: 'techPlugins',
        type: 'array',
        title: 'Partner Plugin(s)',
        description:
          'Ask about context,to make appropiate description',
        of: [
          {
            type: 'reference',
            to: [{type: 'contribution.tool'}],
            title: 'Partner Plugins',
          },
        ],
      },
      {
        name: 'techSnippets',
        type: 'array',
        title: 'Partner Snippet(s)',
        description:
          'Ask about context,to make appropiate description',
        of: [
          {
            type: 'reference',
            to: [{type: 'contribution.schema'}],
            title: 'Partner Snippets',
          },
        ],
      },
    ]
  }