/**
 * TODO: Deprecate this group
 */

export default {
  _id: '_.groups.agent',
  _type: 'system.group',
  grants: [
    {
      path: '**',
      permissions: ['read', 'create', 'update'],
    },
  ],
  members: [],
}
