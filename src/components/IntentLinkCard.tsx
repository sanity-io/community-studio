import {Card} from '@sanity/ui';
import {ComponentType, ComponentProps} from 'react';
import {useIntentLink} from 'sanity/router';

interface IntentLinkProps extends ComponentProps<typeof Card> {
  link: Parameters<typeof useIntentLink>[0];
}

/**
 * Render a Sanity UI Card component as an intent link.
 */
const IntentLinkCard: ComponentType<IntentLinkProps> = ({link, ...props}) => (
  <Card as="a" {...props} {...useIntentLink(link)} />
);

export default IntentLinkCard;
