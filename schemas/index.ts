import {aggregate} from './documents/aggregate';
import {answerFeedback} from './documents/answerFeedback';
import {communityBulletin} from './documents/communityBulletin';
import {contest} from './documents/contest';
import {curatedContribution} from './documents/contributions/curatedContribution';
import {communityAmbassadors} from './documents/communityAmbassadors';
import {guide} from './documents/contributions/guide';
import {schema} from './documents/contributions/schema';
import {showcaseProject} from './documents/contributions/showcaseProject';
import {starter} from './documents/contributions/starter';
import {tool} from './documents/contributions/tool';
import {editorial} from './documents/editorial';
import {feedback} from './documents/feedback';
import {globalSettings} from './documents/globalSettings';
import {landingGetStarted} from './documents/landingGetStarted';
import {person} from './documents/person';
import {studioTutorials} from './documents/studioTutorials';
import {tag} from './documents/tag';
import {allTaxonomies} from './documents/taxonomies';
import {techPartner} from './documents/techPartner';
import {ticket} from './documents/ticket';

import {authors} from './objects/authors';
import {callout} from './objects/callout';
import {handpickedContributions, getStartedCli} from './objects/contributionTypeSections';
import {emojiEntry} from './objects/emojiEntry';
import {emojiSummary} from './objects/emojiSummary';
import {figure} from './objects/figure';
import {guideBody} from './objects/guideBody';
import {message} from './objects/message';
import {richText} from './objects/richText';
import {schemaEntryObj} from './objects/schemaEntryObj';
import {searchEntry} from './objects/searchEntry';
import {simpleBlockContent} from './objects/simpleBlockContent';
import {simpleStats} from './objects/simpleStats';
import {slackAuthor} from './objects/slackAuthor';
import {studioImage} from './objects/studioImage';

import {youtube} from './objects/youtube';

export const schemaTypes = [
  // Document types
  answerFeedback,
  aggregate,
  communityAmbassadors,
  editorial,
  person,
  ticket,
  tag,
  studioTutorials,
  communityBulletin,
  globalSettings,
  guide,
  schema,
  showcaseProject,
  starter,
  tool,
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
  ...allTaxonomies,
  handpickedContributions,
  getStartedCli,
];
