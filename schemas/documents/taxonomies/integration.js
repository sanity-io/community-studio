import React from 'react'
import Icon from '../../components/icon';
import {getTaxonomySchema} from './getTaxonomy';

export default getTaxonomySchema({
  name: 'integration',
  title: 'Integration / service',
  emoji: '🧩',
  extraFields: [
    {
      name: 'logo',
      title: 'Logo with transparent background',
      type: 'image',
    },
    {
      name: 'color',
      title: 'Brand color of the integration',
      description: 'Is used in the background of the logo, so make sure colors work well together. If the integration has no color, use a Sanity brand color, refer to the design documentation',
      type: 'color',
    },
  ],
  preview: {
    select: {
      title: 'title',
      indexable: 'indexable',
      logo: 'logo'
    },
    prepare(props) {
      return {
        title: props.title,
        subtitle: "Integration",
        media: props.logo ? props.logo : () => <Icon emoji="🧩" />,
      };
    },
  },
});
