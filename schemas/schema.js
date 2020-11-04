// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

import aggregate from './documents/aggregate'
import contribution from './documents/contribution'
import docSearch from './documents/docSearch'
import emojiTracker from './documents/emojiTracker'
import guide from './documents/guide'
import person from './documents/person'
import plugin from './documents/plugin'
import project from './documents/project'
import starter from './documents/starter'
import tagOption from './documents/tagOption'
import ticket from './documents/ticket'

import authors from './objects/authors'
import emojiEntry from './objects/emojiEntry'
import emojiSummary from './objects/emojiSummary'
import message from './objects/message'
import searchEntry from './objects/searchEntry'
import simpleStats from './objects/simpleStats'
import tag from './objects/tag'
import richText from './objects/richText'
import studioImage from './objects/studioImage'
import simpleBlockContent from './objects/simpleBlockContent'



export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    // Document types
    aggregate,
    contribution,
    docSearch,
    emojiTracker,
    guide,
    person,
    plugin,
    project,
    starter,
    tagOption,
    ticket,
    // Object types
    authors,
    emojiEntry,
    emojiSummary,
    message,
    searchEntry,
    simpleStats,
    studioImage,
    tag,
    richText,
    simpleBlockContent
  ])
})
