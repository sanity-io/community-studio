import { Rule } from 'sanity'
import {BulbOutlineIcon, InfoOutlineIcon, CheckmarkCircleIcon, PlugIcon} from '@sanity/icons';
import {toPlainText} from '@portabletext/react';
import simpleBlockContent from './simpleBlockContent';

export default {
  name: 'callout',
  title: 'Callout',
  type: 'object',
  fields: [
    {
      name: 'calloutType',
      title: 'Callout type',
      description: 'Defines the icon and color of the callout in the website. Defaults to "Protip"',
      type: 'string',
      options: {
        list: [
          {
            value: 'protip',
            title: 'Protip (green)',
          },
          {
            value: 'gotcha',
            title: 'Gotcha (yellow)',
          },
          {
            value: 'example',
            title: 'Example (gray)',
          },
        ],
      },
    },
    {
      name: 'body',
      title: 'Content/body of the callout',
      type: 'array',
      validation: (rule: Rule) => rule.required(),
      of: [
        ...simpleBlockContent.of,
        {
          type: 'image',
          options: {
            storeOriginalFilename: false,
            hotspot: true,
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      body: 'body',
      calloutType: 'calloutType',
    },
    prepare({body, calloutType}) {
      return {
        title: calloutType ,
        subtitle: body ? toPlainText(body) : 'Empty',
        media: calloutType ? mapping(calloutType).Icon : mapping('protip').Icon,
      }
    },
  },
};

function mapping(calloutType: string) {
  const mappings = {
        protip: {
          Icon: BulbOutlineIcon,
          title: 'Protip',
          state: 'success',
        },
        example: {
          Icon: PlugIcon,
          title: 'Example',
          state: 'enterprise',
        },
        enterprise: {
          Icon: CheckmarkCircleIcon,
          title: 'Example',
          state: 'enterprise',
        },
        gotcha: {
          Icon: InfoOutlineIcon,
          title: 'Gotcha',
          state: 'warning',
        },
        editorExperience: {
          Icon: BulbOutlineIcon,
          title: 'Editor Experience',
          state: 'success',
        },
      }
      return mappings[calloutType] || mappings.protip;
    }