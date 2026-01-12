import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '81pocpw8',
    dataset: 'production',
  },
  deployment: {
    autoUpdates: true,
  },
  reactStrictMode: true,
  reactCompiler: { target: '19' },
})
