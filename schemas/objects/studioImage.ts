import { defineField } from "sanity";

export const studioImage = {
  name: 'studioImage',
  type: 'image',
  title: 'Studio image',
  options: {
    hotspot: true,
    storeOriginalFilename: false,
  },
  fields: [
    {
      name: 'version',
      type: 'string',
      title: 'Studio version',
    },
    defineField({
      name: 'caption',
      type: 'string',
      title: 'Caption',
      description:
        "⚡ Optional but highly encouraged to contextualize readers as they navigate through your project's images.",
      validation: (rule) =>
        rule.required().warning('Adding a caption will help contextualizing readers.'),
    }),
    {
      name: 'alt',
      type: 'string',
      title: 'Alternative text',
      description:
        "Optional. If the caption above is descriptive enough, there's no need to fill this field. Else, consider adding alternative text to make content more accessible.",

    },
  ],
  preview: {
    select: {
      imageUrl: 'asset.url',
      title: 'caption',
    },
  },
};
