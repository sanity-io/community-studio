/**
 * TODO: Deprecate this group
 */

export default {
  _id: '_.groups.agent',
  _type: 'system.group',
  grants: [
    {
      filter: "_type == 'person'",
      permissions: ['read'],
    },
    {
      filter: "_type == 'person' && _id == identity()",
      permissions: ['read', 'create', 'update'],
    },
    {
      filter: `[!(_type == "person")]`,
      permissions: ['read', 'create', 'update'],
    },
  ],
  members: [],
}
