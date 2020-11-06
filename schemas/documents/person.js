import React from 'react';
import Icon from '../components/icon';
import PathInput from '../components/PathInput';
import userAvatarPreview from '../components/userAvatarPreview';

export default {
  name: 'person',
  title: 'Person',
  type: 'document',
  icon: () => <Icon emoji="👤" />,
  initialValue: {
    public: true,
  },
  fields: [
    {
      name: 'name',
      title: 'Your name',
      type: 'string',
    },
    {
      name: 'public',
      type: 'boolean',
      title: 'Make my profile public?',
      description: 'Do you want to have your profile on sanity.io/community/people/handle?',
    },
    {
      name: 'handle',
      title: 'Handle in the Sanity community',
      description:
        "💡 this will define your profile's URL in the community, so avoid special characters, spaces and uppercase letters.",
      type: 'slug',
      inputComponent: PathInput,
      options: {
        basePath: 'sanity.io/community/people',
        source: 'title',
      },
      validation: (Rule) => [
        Rule.required('Please provide a handle for your profile'),
        // Rule.unique("There's another person with this handle, please choose another"),
      ],
    },
    {
      name: 'photo',
      title: 'Image',
      type: 'image',
      fields: [
        {
          name: 'alt',
          type: 'string',
          description: `Describe the photo for people who can't view it.`,
        },
      ],
    },
    // @TODO: consider removing this field
    {
      name: 'imageUrl',
      type: 'url',
      title: 'User avatar',
      inputComponent: userAvatarPreview,
      hidden: true,
    },
    {
      name: 'email',
      type: 'email',
      title: 'Public contact email',
      description:
        "💡 this email will be shown in your profile - make sure to delete it if you don't want others to have access to it.",
    },
    {
      name: 'location',
      type: 'string',
      title: 'Location',
      description: 'Where are you based? It could be your country or country & state',
    },
    {
      name: 'headline',
      type: 'string',
      title: 'Headline',
      description:
        'This will appear directly under your name on your profile, blog posts, etc. Keep it short and straight to the point, you have more room in your bio (below).',
    },
    {
      name: 'bio',
      type: 'simpleBlockContent',
      title: 'Your bio',
      // @TODO: provide examples and instructions here?
    },
    {
      name: 'usesSanitySince',
      type: 'date',
      title: 'When did you first start working with Sanity?',
      description:
        "You don't have to worry about getting the day or month right, just pick a date close to when you remember starting your first Sanity project.",
      options: {
        dateFormat: 'MMMM YYYY',
      },
    },
    {
      name: 'work',
      type: 'object',
      title: 'Work',
      options: {collapsible: true, collapsed: false},
      fields: [
        {
          name: 'company',
          title: 'Company name',
          type: 'string',
          description: 'Name of your workplace, your own company, or "Freelance" etc.',
        },
        {
          name: 'url',
          title: 'Company URL',
          description: '💡 freelancer? Plug-in your website or favorite social media.',
          type: 'url',
        },
        {
          name: 'title',
          title: 'Job title',
          type: 'string',
        },
        {
          name: 'availableForWork',
          title:
            'Are your or your company currently available for working on Sanity-based projects?',
          type: 'boolean',
        },
      ],
    },
    {
      name: 'slackId',
      title: 'Sanity Slack member ID',
      type: 'string',
      // @todo: review these instructions on how to find your slack id
      description:
        'To get your ID, open the Slack client, click on your profile picture on the top-right corner, "View profile", "More" on the sidebar that appears and then "Copy member ID". Questions? Reach out on the Slack #help channel 🤗',
    },
    {
      name: 'social',
      type: 'object',
      title: 'Social links',
      options: {collapsible: true, collapsed: false},
      description:
        'All of these are optional. Include the whole URL as opposed to just your handle 😉',
      // @TODO: Review this list
      // Knut on Slack: "I'm open to pruning! (twitter, github, linkedin, dev.to probably the most important ones?)"
      fields: [
        'Twitter',
        'dev.to',
        'LinkedIn',
        // 'Dribbble',
        // 'GitLab',
        // 'Medium',
        // 'Behance',
        // 'StackOverflow',
        // 'Youtube',
        // 'Facebook',
        // 'Twitch',
        // 'Mastodon',
        // 'Instagram',
      ].map((vendor) => ({
        name: vendor.toLowerCase().replace('.', ''),
        title: vendor,
        type: 'string',
      })),
    },
    {
      name: 'sanityId',
      title: 'Sanity ID',
      type: 'string',
      description: 'Added automatically on document creation.',
      readonly: true,
      hidden: true,
    },
    {
      name: 'github',
      title: 'GitHub username',
      type: 'string',
      description: 'Added by Auth0.',
      readonly: true,
      hidden: true,
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'handle.current',
      media: 'photo',
    },
  },
};
