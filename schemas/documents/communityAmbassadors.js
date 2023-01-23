import React from "react"
import Icon from "../components/icon"

export default {
  name: 'communityAmbassadors',
  title: 'Community Ambassador',
  icon: () => <Icon emoji="🥇" />,
  type: 'document',
  fields: [
    {
      name: 'chosenPersons',
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
