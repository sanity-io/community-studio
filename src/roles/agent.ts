/**
 * TODO: Deprecate this group
 */

type Grants = {
  path?: string;
  filter?: string;
  permissions: string[];
};

type Agent = {
  _id: string;
  _type: string;
  grants?: Grants[];
  members: string[];
};

const agent: Agent = {
  _id: '_.groups.agent',
  _type: 'system.group',
  grants: [
    {
      path: '**',
      permissions: ['create', 'read', 'update', 'editHistory', 'history'],
    },
  ],
  members: [],
};

export default agent;
