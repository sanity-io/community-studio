import {defineConfig} from 'sanity';
import {deskTool} from 'sanity/desk';
import {visionTool} from '@sanity/vision';
import {dashboardTool} from '@sanity/dashboard';
import {schemaTypes} from './schemas';
import {structure} from './plugins/desk';
import {colorInput} from '@sanity/color-input';
import {markdownSchema} from 'sanity-plugin-markdown';
import {codeInput} from '@sanity/code-input';
import {getDefaultDocumentNode} from './plugins/desk/defaultDocumentNode';
import dashboardConfig from './plugins/dashboardConfig';
import {resolveProductionUrl} from './plugins/resolveProductionUrl';
//import {resolveDocumentActions} from './plugins/actions';
//import newDocumentStructure from './plugins/newDocumentStructure';
//import initialValueTemplates from './plugins/initialValueTemplates';

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
    //V3FIXME
    productionUrl: resolveProductionUrl,
    //V3FIXME
    //actions: resolveDocumentActions,
    //V3FIXME
    //newDocumentOptions: newDocumentStructure,
  },
  schema: {
    types: schemaTypes,
    //V3FIXME
    //templates: initialValueTemplates,
  },
});
