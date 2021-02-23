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
