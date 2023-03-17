//V3FIXME
import PublishContributionAction from './publishContributionAction';
// import PublishPersonAction from './publishPersonAction';
// import PublishTicketAction from './publishTicketAction';

//V3FIXME
export const resolveDocumentActions = (prev, {schemaType}) => {
  // Contribution documents need a distinct publish action for curatedContribution creation
  if (schemaType.includes('contribution.')) {
    return [PublishContributionAction, ...prev.filter(({action}) => action !== 'publish')];
  }
  // // The person document calls /generate-ogimage when published
  // if (schemaType === 'person') {
  //   return [PublishPersonAction, ...prev.filter(({action}) => action !== 'publish')];
  // }
  // // Tickets have an auto-generated slug, hence the custom publish action
  // if (schemaType.includes('ticket')) {
  //   return [PublishTicketAction, ...prev.filter(({action}) => action !== 'publish')];
  // }
  // // Non-deletable documents
  // if (schemaType === 'person' || schemaType === 'taxonomy.contributionType') {
  //   return [
  //     ...prev.filter(
  //       ({action}) => action !== 'delete' && action !== 'duplicate' && action !== 'unpublish'
  //     ),
  //   ];
  // }
  return prev;
};
