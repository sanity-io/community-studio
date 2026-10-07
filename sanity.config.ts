import { codeInput } from '@sanity/code-input'
import { colorInput } from '@sanity/color-input'
import { googleMapsInput } from '@sanity/google-maps-input'
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { markdownSchema } from 'sanity-plugin-markdown'

import {
  resolveProductionUrl,
  getDefaultDocumentNode,
  resolveDocumentActions,
  newDocumentOptions,
  initialValueTemplates,
} from './plugins'
import { structure } from './plugins/desk'
import { schemaTypes } from './schemas'

const isDev = process.env.NODE_ENV === 'development'
export default defineConfig({
  auth: {
    loginMethod: 'dual',
    redirectOnSingle: false,
    providers: (prev) => [
      ...(isDev ? [...prev] : []),
      {
        name: 'community',
        title: 'Log in with your Sanity Account',
        url: '/login',
        logo: '/sanity-login.png',
      },
    ],
  },
  name: 'default',
  title: 'community-studio',

  projectId: '81pocpw8',
  dataset: 'production',

  plugins: [
    structureTool({
      structure,
      defaultDocumentNode: getDefaultDocumentNode,
    }),
    visionTool({ defaultApiVersion: '2021-10-21' }),
    colorInput(),
    markdownSchema(),
    codeInput(),
  ],
  document: {
    productionUrl: resolveProductionUrl,
    actions: resolveDocumentActions,
    newDocumentOptions,
  },
  schema: {
    types: schemaTypes,
    templates: initialValueTemplates,
  },
})
