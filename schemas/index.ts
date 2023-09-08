import aggregate from './documents/aggregate';
import editorial from './documents/editorial';
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
import slackAuthor from './objects/slackAuthor';
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

export const schemaTypes = [
  // Document types
  aggregate,
  editorial,
  person,
  ticket,
  tag,
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
  simpleStats,
  guideBody,
  authors,
  emojiEntry,
  emojiSummary,
  message,
  searchEntry,
  studioImage,
  richText,
  simpleBlockContent,
  schemaEntryObj,
  slackAuthor,
  youtube,
  callout,
  figure,
  ...taxonomies,
  ...contributionTypeSections,
];
