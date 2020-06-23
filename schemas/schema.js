// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

import contribution from './documents/contribution'
import docSearch from './documents/docSearch'
import emojiTracker from './documents/emojiTracker'
import person from './documents/person'
import tagOption from './documents/tagOption'
import ticket from './documents/ticket'

import emojiEntry from './objects/emojiEntry'
import emojiSummary from './objects/emojiSummary'
import message from './objects/message'
import searchEntry from './objects/searchEntry'
import tag from './objects/tag'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    // Document types
    contribution,
    docSearch,
    emojiTracker,
    person,
    tagOption,
    ticket,
    // Object types
    emojiEntry,
    emojiSummary,
    message,
    searchEntry,
    tag
  ])
})
