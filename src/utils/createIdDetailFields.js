import CustodianLink from '../../schemas/components/CustodianLink';

export const createIdDetailFields = (fieldName, icon) => {
  return {
    name: fieldName,
    type: 'object',
    icon: icon,
    fields: [
      {
        name: 'id',
        title: 'ID',
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
    ],
  };
};
