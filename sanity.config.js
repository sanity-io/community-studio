import {defineConfig} from 'sanity';
import {deskTool} from 'sanity/desk';
import {visionTool} from '@sanity/vision';
import {schemaTypes} from './schemas';
import {structure} from './desk';
import {colorInput} from '@sanity/color-input';
import {markdownSchema} from 'sanity-plugin-markdown';
import {codeInput} from '@sanity/code-input';
import {getDefaultDocumentNode} from './desk/defaultDocumentNode';

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
    visionTool(),
    colorInput(),
    markdownSchema(),
    codeInput(),
  ],

  schema: {
    types: schemaTypes,
  },
});
