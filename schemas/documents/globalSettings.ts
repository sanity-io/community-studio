import {EarthAmericasIcon} from '@sanity/icons';

const scriptBodyType = {
  type: 'array',
  of: [
    {
      title: 'Block',
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading 2', value: 'h2'},
        {title: 'Heading 3', value: 'h3'},
        {title: 'Quote', value: 'blockquote'},
      ],
    },
  ],
  validation: (Rule) => Rule.required(),
};

export const globalSettings = {
  name: 'globalSettings',
  title: 'Global settings',
  icon: EarthAmericasIcon,
  type: 'document',
  fields: [
    {
      ...scriptBodyType,
      name: 'answersConversionScript',
      title: 'Conversion script for answers / tickets',
    },
    {
      ...scriptBodyType,
      name: 'guidesConversionScript',
      title: 'Conversion script for guides',
    },
    {
      name: 'menuIntegrations',
      title: 'Integrations in the global nav',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'taxonomy.framework'}, {type: 'taxonomy.integration'}]}],
      validation: (Rule) => [
        Rule.required().min(6).error('We need at least 6 integrations for the menu.'),
        Rule.unique(),
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: `Global settings`,
      };
    },
  },
};
