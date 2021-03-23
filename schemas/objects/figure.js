// Object for logos
export default {
    type: 'object',
    name: 'figure',
    fieldsets: [
        {
          name: 'logoVersion', 
          title: 'Logo Versions',
          options: {
            collapsible: true, // Makes the whole fieldset collapsible
            collapsed: false, // Defines if the fieldset should be collapsed by default or not
            }
        }
    ],
    fields: [
        {
            name: 'logoTransparent',
            type: 'image',
            title: 'Logo-Transparent Brackground',
            fieldset: 'logoVersion',
            options: {
              hotspot: true,
              accept: ".svg",
            },
            fields: [
              {
                name: 'alt',
                type: 'string',
                title: 'Alternative text',
                description:  'Alternative text is required.',
                validation: Rule => [
                    Rule.required(),
                ],
                options: {
                  isHighlighted: true,
                }
              },
              {
                name: 'caption',
                type: 'string',
                title: 'Caption',
                options: {
                  isHighlighted: true
                }
              }
            ]
        },
        {
            name: 'logoDark',
            type: 'image',
            title: ' Logo-Dark Brackground',
            fieldset: 'logoVersion',
            options: {
              hotspot: true,
              accept: ".svg",
            },
            fields: [
              {
                name: 'alt',
                type: 'string',
                title: 'Alternative text',
                description:  'Alternative text is required.',
                validation: Rule => [
                    Rule.required(),
                ],
                options: {
                  isHighlighted: true,
                }
              },
              {
                name: 'caption',
                type: 'string',
                title: 'Caption',
                options: {
                  isHighlighted: true
                }
              }
            ]
        },
          
    ]
  }