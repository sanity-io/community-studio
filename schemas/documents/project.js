import CustodianLink from '../../schemas/components/CustodianLink';
import {MasterDetailIcon} from '@sanity/icons';

export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: MasterDetailIcon,
  fields: [
    {
      name: 'projectId',
      title: 'Project ID',
      type: 'string',
      validation: (Rule) => Rule.max(10).error('Enter a valid ID'),
    },
    {
      name: 'link',
      title: 'View in Custodian',
      type: 'string',
      inputComponent: CustodianLink,
      hidden: ({currentUser}) => !currentUser.roles.find(({name}) => name == 'administrator'),
    },
    {
      name: 'stack',
      title: 'Tech Stack',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [
            {type: 'taxonomy.framework'},
            {type: 'taxonomy.language'},
            {type: 'techPartner'},
            {type: 'taxonomy.cssframework'},
          ],
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'projectId',
      stack0title: 'stack.0.title',
      stack0company: 'stack.0.companyName',
      stack1title: 'stack.1.title',
      stack1company: 'stack.1.companyName',
      stack2title: 'stack.2.title',
      stack2company: 'stack.2.companyName',
    },
    prepare(selection) {
      const {
        title,
        stack0title,
        stack0company,
        stack1title,
        stack1company,
        stack2title,
        stack2company,
      } = selection;
      const stack = [
        stack0title,
        stack0company,
        stack1title,
        stack1company,
        stack2title,
        stack2company,
      ].filter(Boolean);

      return {
        title: title,
        subtitle: stack.join(', '),
      };
    },
  },
};
