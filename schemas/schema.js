// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

import person from './documents/person'
import tagOption from './documents/tagOption'
import ticket from './documents/ticket'

import message from './objects/message'
import tag from './objects/tag'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    // Document types
    person,
    tagOption,
    ticket,
    // Object types
    message,
    tag
  ])
})
