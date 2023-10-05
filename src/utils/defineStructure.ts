import {ConfigContext} from 'sanity';
import {StructureBuilder} from 'sanity/desk';

/**
 * Helper for creating composable desk structure parts.
 * https://sanity-io.slack.com/archives/C0422PD4R55/p1666277298301549?thread_ts=1666274555.608539&cid=C0422PD4R55
 */
export default function defineStructure<StructureType>(
  factory: (S: StructureBuilder, context: ConfigContext) => StructureType
) {
  return factory;
}
