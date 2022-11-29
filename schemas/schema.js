// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator';

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type';

import aggregate from './documents/aggregate';
import contribution from './documents/contribution';
import docSearch from './documents/docSearch';
<<<<<<< HEAD
import editorial from './documents/editorial';
=======
>>>>>>> 62f3a0d
import emojiTracker from './documents/emojiTracker';
import person from './documents/person';
import tag from './documents/tag';
import ticket from './documents/ticket';
import taxonomies from './documents/taxonomies';
import techPartner from './documents/techPartner';

import authors from './objects/authors';
import emojiEntry from './objects/emojiEntry';
import emojiSummary from './objects/emojiSummary';
import message from './objects/message';
import searchEntry from './objects/searchEntry';
import simpleStats from './objects/simpleStats';
import richText from './objects/richText';
import studioImage from './objects/studioImage';
import simpleBlockContent from './objects/simpleBlockContent';
<<<<<<< HEAD
import slackAuthor from './objects/slackAuthor';
=======
>>>>>>> 62f3a0d
import contributions from './documents/contributions';
import curatedContribution from './documents/contributions/curatedContribution';
import studioTutorials from './documents/studioTutorials';
import guideBody from './objects/guideBody';
import communityBulletin from './documents/communityBulletin';
import globalSettings from './documents/globalSettings';
import schemaEntryObj from './objects/schemaEntryObj';
import youtube from './objects/youtube';
import callout from './objects/callout';
import figure from './objects/figure';
import contributionTypeSections from './objects/contributionTypeSections';
import contest from './documents/contest';
import feedback from './documents/feedback';
import landingGetStarted from './documents/landingGetStarted';
<<<<<<< HEAD
=======
import slackAuthor from './documents/slackAuthor';
>>>>>>> 62f3a0d

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    // Document types
    aggregate,
    contribution,
    docSearch,
<<<<<<< HEAD
    editorial,
    emojiTracker,
    person,
=======
    emojiTracker,
    person,
    tag,
>>>>>>> 62f3a0d
    ticket,
    studioTutorials,
    communityBulletin,
    globalSettings,
    ...contributions,
    curatedContribution,
    techPartner,
    contest,
    feedback,
    landingGetStarted,

    // Object types
    guideBody,
    authors,
    emojiEntry,
    emojiSummary,
    message,
    searchEntry,
    simpleStats,
<<<<<<< HEAD
    slackAuthor,
    studioImage,
    tag,
    richText,
    simpleBlockContent,
    schemaEntryObj,
=======
    studioImage,
    richText,
    simpleBlockContent,
    schemaEntryObj,
    slackAuthor,
>>>>>>> 62f3a0d
    youtube,
    callout,
    figure,
    ...taxonomies,
    ...contributionTypeSections,
  ]),
});
