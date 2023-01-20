/**
 * This is the base group settings for the contributors role
 */
type Grants = {
  path?: string;
  filter?: string;
  permissions: string[];
};

type Contributor = {
  _id: string;
  _type: string;
  grants?: Grants[];
  members: string[];
};

export const contributor: Contributor = {
  _id: '_.groups.contributor',
  _type: 'system.group',
  grants: [
    {
      path: '**',
      permissions: ['history', 'read'],
    },
    {
      filter: '_type match "contribution.*" && identity() in authors[]._ref',
      permissions: ['create', 'update'],
    },
    {
      filter: '_id == identity() || _id == "drafts." + identity()',
      permissions: ['create', 'update'],
    },
    {
      filter: '_type in ["sanity.fileAsset", "sanity.imageAsset"]',
      permissions: ['create', 'update'],
    },
  ],
  members: [],
};
