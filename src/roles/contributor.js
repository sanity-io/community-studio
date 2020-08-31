/**
 * This is the base group settings for the contributors role
 */
export default {
  _id: '_.groups.contributor',
  _type: 'system.group',
  grants: [
    /**
     * Gives full permisions to own profile
     */
    {
      filter: "_type == 'person' && _id == identity()",
      permissions: ['read', 'create', 'update'],
    },
    /**
     * Gives permission to read,create,update all content where one is set as an author
     */
    {
      filter: 'identity() in authors[]._ref',
      permissions: ['read', 'create', 'update']
    }
  ],
  members: [],
}
