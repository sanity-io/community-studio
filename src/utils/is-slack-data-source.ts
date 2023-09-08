import {ExternalDataSourceName} from '@/types';

const slackDataSourceNames: ExternalDataSourceName[] = ['slack-community'];

export default function isSlackDataSource(sourceName: ExternalDataSourceName): boolean {
  return slackDataSourceNames.includes(sourceName);
}
