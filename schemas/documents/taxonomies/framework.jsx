import {getTaxonomySchema} from './getTaxonomy';
import React from 'react';
import FrameworkIcon from '../../components/icons/FrameworkIcon';

export default getTaxonomySchema({
  name: 'framework',
  title: 'Framework',
  // icon: FrameworkIcon,
  extraFields: [
    {
      name: 'language',
      title: 'Language',
      type: 'reference',
      to: [{type: 'taxonomy.language'}],
    },
    {
      name: 'logo',
      title: 'Logo with transparent background',
      type: 'image',
    },
    {
      name: 'color',
      title: 'Brand color of the framework',
      description:
        'Is used in the background of the logo, so make sure colors work well together. If the framework has no color, use a Sanity brand color, refer to the design documentation',
      type: 'color',
    },
  ],
  preview: {
    select: {
      title: 'title',
      ogImage: 'ogImage',
      indexable: 'indexable',
      logo: 'logo.asset',
    },
    prepare(props) {
      return {
        title: props.title,
        subtitle: 'Framework',
        media: props.logo ? props.logo : () => <FrameworkIcon />,
      };
    },
  },
});
