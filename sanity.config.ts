import { codeInput } from '@sanity/code-input'
import { colorInput } from '@sanity/color-input'
import { googleMapsInput } from '@sanity/google-maps-input'
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { markdownSchema } from 'sanity-plugin-markdown'

import {
  resolveProductionUrl,
  getDefaultDocumentNode,
  resolveDocumentActions,
  newDocumentOptions,
} from './plugins'
import { structure } from './plugins/desk'
import { schemaTypes } from './schemas'

const isDev = process.env.NODE_ENV === 'development'
export default defineConfig({
  auth: {
    loginMethod: 'dual',
    redirectOnSingle: false,
    providers: (prev) => [
      ...(isDev && [...prev]),
      {
        name: 'community',
        title: 'Log in with your Sanity Account',
        url: '/static/auth/login',
        logo: '/static/sanity-login.png',
      },
    ],
  },
  name: 'default',
  title: 'community-studio',

  projectId: '81pocpw8',
  dataset: 'test-ticket-import',

  plugins: [
    deskTool({
      structure,
      defaultDocumentNode: getDefaultDocumentNode,
    }),
    visionTool({ defaultApiVersion: '2021-10-21' }),
    colorInput(),
    markdownSchema(),
    codeInput(),
    googleMapsInput({
      apiKey: 'AIzaSyCB5AUdHPHaA-5jjVNrRp1sF4RRFQNqkHU',
      defaultZoom: 11,
      defaultLocation: {
        lat: 40.7058254,
        lng: -74.1180863,
      },
    }),
  ],
  document: {
    productionUrl: resolveProductionUrl,
    actions: resolveDocumentActions,
    newDocumentOptions,
  },
  schema: {
    types: schemaTypes,
  },
})
