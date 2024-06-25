import {Rule} from 'sanity';

// Object for logos
export const figure = {
  type: 'object',
  name: 'figure',
  fieldsets: [
    {
      name: 'logoVersion',
      title: 'Logo Versions',
      options: {
        collapsible: true, // Makes the whole fieldset collapsible
        collapsed: false, // Defines if the fieldset should be collapsed by default or not
      },
    },
  ],
  fields: [
    {
      name: 'logoTransparent',
      type: 'image',
      title: 'Logo-Transparent Brackground',
      fieldset: 'logoVersion',
      options: {
        hotspot: true,
        accept: '.svg',
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Alternative text is required.',
          validation: (rule: Rule) => [rule.required()],
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
    },
    {
      name: 'logoDark',
      type: 'image',
      title: ' Logo-Dark Brackground',
      fieldset: 'logoVersion',
      options: {
        hotspot: true,
        accept: '.svg',
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Alternative text is required.',
          validation: (rule: Rule) => [rule.required()],
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
    },
  ],
};
