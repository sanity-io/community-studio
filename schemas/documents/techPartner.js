//Content type for Sanity partners

import figure from "../objects/figure"

 
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
        title: 'Partner Logos',
        name: 'partnerLogos',
        type: 'figure',
        description: 'Ideally this image has a transparent background for use over other images or on non-white backgrounds.',
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