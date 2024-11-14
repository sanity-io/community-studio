import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '81pocpw8',
    dataset: 'production',
  },
  // autoUpdates: true,
  reactCompiler: {
    target: '18',
  },
})
