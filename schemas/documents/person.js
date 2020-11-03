import React from 'react';
import Icon from '../components/icon';
import PathInput from '../components/PathInput';
import userAvatarPreview from '../components/userAvatarPreview';

export default {
  name: 'person',
  title: 'Person',
  type: 'document',
  icon: () => <Icon emoji="👤" />,
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
      description: 'Do you want to have your profile on sanity.io/community/people/@nickname?',
    },
    {
      name: 'nickname',
      title: 'Handle or nickname',
      description: '💡 this will define your profile\'s URL in the community, so avoid special characters, spaces and uppercase letters.',
      type: 'string',
      inputComponent: PathInput,
      options: {
        basePath: 'sanity.io/community/people',
      },
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
      description: 'This will appear directly under your name on your profile, blog posts, etc.',
    },
    // @TODO: consider removing this bio - it seems as if it's irrelevant now
    {
      name: 'bio',
      type: 'array',
      title: 'Bio',
      of: [
        {
          type: 'block',
        },
      ],
    },
    {
      name: 'work',
      type: 'object',
      title: 'Work',
      options: { collapsible: true, collapsed: false,},
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
      ],
    },
    {
      name: 'social',
      type: 'object',
      title: 'Social links',
      options: { collapsible: true, collapsed: false,},
      description:
        "All of these are optional. Include the whole URL as opposed to just your handle 😉",
      // @TODO: consider removing Dribbble, Mastodon, Behance and Facebook - they may be just extra noise
      fields: [
        'Twitter',
        'Dribbble',
        'GitLab',
        'Medium',
        'Behance',
        'LinkedIn',
        'StackOverflow',
        'Youtube',
        'Facebook',
        'Twitch',
        'Mastodon',
        'Instagram',
      ].map((vendor) => ({
        name: vendor.toLowerCase(),
        title: vendor,
        type: 'string',
      })),
    },
    {
      name: 'slackId',
      title: 'Sanity Slack member ID',
      type: 'string',
      // @todo: Instructions on how to find your slack id
      description: 'To get your ID, open the Slack client, click on your profile picture on the top-right corner, "View profile", "More" on the sidebar that appears and then "Copy member ID". Questions? Reach out on the Slack #help channel 🤗'
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
    {
      name: 'joinedDate',
      type: 'date',
      title: 'Joined date',
      readonly: true,
      hidden: true,
    },
  ],
};
