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
import {googleMapsInput} from '@sanity/google-maps-input';
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
    googleMapsInput({
      apiKey: "AIzaSyCB5AUdHPHaA-5jjVNrRp1sF4RRFQNqkHU",
      defaultZoom: 11,
      defaultLocation: {
        lat: 40.7058254,
        lng: -74.1180863
      },
    }),
  ],
  document: {
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
