import {defineConfig} from 'sanity';
import {deskTool} from 'sanity/desk';
import {visionTool} from '@sanity/vision';
import {dashboardTool} from '@sanity/dashboard';
import {schemaTypes} from './schemas';
import {colorInput} from '@sanity/color-input';
import {markdownSchema} from 'sanity-plugin-markdown';
import {codeInput} from '@sanity/code-input';
import {
  newDocumentOptions,
  resolveProductionUrl,
  dashboardConfig,
  structure,
  getDefaultDocumentNode,
  // initialValueTemplates
} from './plugins';

export default defineConfig({
  name: 'default',
  title: 'community-studio',

  projectId: '81pocpw8',
  dataset: 'test-ticket-import',

  plugins: [
    deskTool({
      structure,
      defaultDocumentNode: getDefaultDocumentNode,
    }),
    visionTool({defaultApiVersion: '2021-10-21'}),
    colorInput(),
    markdownSchema(),
    codeInput(),
    dashboardTool(dashboardConfig),
  ],
  document: {
    productionUrl: resolveProductionUrl,
    //V3FIXME
    //actions: resolveDocumentActions,
    newDocumentOptions,
  },
  schema: {
    types: schemaTypes,
    //V3FIXME
    //templates: initialValueTemplates,
  },
});
