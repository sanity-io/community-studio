export interface Secrets {
  SANITY_PROJECT_ID: string
  SANITY_DATASET: string
  SANITY_WRITE_TOKEN: string
  SLACK_BOT_USER_TOKEN: string
  EMAIL_DOMAIN: string
}

export const externalDataSourceNames = ['slack-community'] as const

export type ExternalDataSourceName = (typeof externalDataSourceNames)[number]
