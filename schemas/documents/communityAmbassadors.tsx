import React from 'react';
import {Icon} from '../components/icons/Icon';

export const communityAmbassadors = {
  name: 'communityAmbassadors',
  title: 'Community Ambassador',
  icon: () => <Icon emoji="🥇" />,
  type: 'document',
  fields: [
    {
      name: 'persons',
      title: 'Persons to highlight as Community Ambassadors in the community pages',
      description: 'The order isn\'t relevant currently',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'person'}],
        }
      ]
    }
  ],
  preview: {
    prepare() {
      return {
        title: "Community ambassadors"
      }
    }
  }
}
