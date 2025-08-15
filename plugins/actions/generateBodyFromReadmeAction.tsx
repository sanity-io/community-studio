import { SparklesIcon } from '@sanity/icons'
import { useState } from 'react'
import { useClient } from 'sanity'
import { DocumentActionComponent, useValidationStatus } from 'sanity'
import { Stack, Text, TextInput, Button, Flex, useToast } from '@sanity/ui'

const SCHEMA_ID = '_.schemas.default' // Replace with your deployed schema ID
const API_VERSION = 'vX'

// The portable text prompt template content

const PORTABLE_TEXT_PROMPT = `# Prompt Template for Generating Sanity Function Documentation Body

Using the README content provided here $readmeContent, generate a Portable Text body array for a Sanity Function documentation page. Follow this exact structure and formatting conventions.

## Output Structure

Generate a JSON array with the following sections in order:

(1-2 paragraphs)
- First paragraph: Describe "The Problem" this function solves or the challenge it addresses (extract from README's purpose/overview)
- Include specific pain points (time saved, manual work eliminated, etc.)
- Use **bold** for emphasis on key phrases
- Next paragraph: Describe "The Solution" this function provides IF the Readme provides enough context

### 2. Quick Start Section
\`\`\`
**Quick Start**

[View full instructions and source code](extract GitHub URL from README).

Initialize blueprints if you haven't already: \`npx sanity blueprints init\`

Then: \`npx sanity blueprints add function --example [extract-function-name-from-readme]\`

Then deploy: \`npx sanity blueprints deploy\`
\`\`\`

### 3. [CONDITIONAL] External Service Setup Section
**Only include if the README shows external service configuration steps (Slack, Telegram, Algolia, API keys, etc.)**

Format:
\`\`\`
**[Service Name] Setup**

[More detailed instructions in the GitHub README](GitHub_URL#implementation)

1. **Step Title**: Specific instructions with \`code snippets\` where needed
2. **Next Step**: Continue numbered list with clear actions
3. **Environment Variables**: Add \`ENV_VAR_NAME\` to your \`.env\` file
\`\`\`

For complex setups:
- Extract and summarize the main setup steps from the README
- Use numbered lists for sequential steps
- Include code formatting for commands, tokens, and variable names
- Reference back to the GitHub README for full details

### 4. How It Works Section
\`\`\`
**How It Works**

When [extract trigger condition from README], the function automatically:

• [Extract each step from the README's workflow/process description]
• [Action verb] the [what it processes]
• [Next action in sequence]
• [Final result/outcome]
\`\`\`

Use bullet points OR numbered list based on whether it's a sequence (numbers) or features (bullets).

### 5. Key Benefits Section
\`\`\`
**Key Benefits**

• **[Extract benefit from README]** with supporting detail
• **[Quantify if mentioned]** by eliminating [specific task]
• **[Extract improvement]** through [specific mechanism]
• [Generate 3-6 benefits based on README content]
\`\`\`

### 6. Technical Implementation Section
\`\`\`
**Technical Implementation**

The function uses [extract main technology/API from README] to [extract core functionality]. It's built with:

• Event-driven architecture (triggers on [extract trigger type])
• [Extract key technical features from README]
• [Extract integrations or APIs used]
• [Include error handling/logging if mentioned in README]
\`\`\`

### 7. Perfect For Section
\`\`\`
**Perfect For**

• [Infer user types from README use cases]
• [Extract or infer workflows that would benefit]
• [Identify team types or project scales]
• [Extract specific scenarios from README examples]
\`\`\`

Generate one paragraph about compatibility and customization options based on the README's configuration section or notes.

## Formatting Rules

1. **Text Formatting:**
   - Use \`**text**\` for bold emphasis
   - Use backticks for \`code\`, \`commands\`, \`field names\`, \`ENV_VARS\`
   - Links: \`[link text](URL)\`

2. **Lists:**
   - Use bullet points (•) for non-sequential items
   - Use numbered lists (1. 2. 3.) for steps or sequences
   - Bold the first phrase of each list item when it's a key concept

3. **Portable Text Specifics:**
   - Each paragraph is a separate block with style "normal"
   - List items have listItem property ("bullet" or "number")
   - Links are defined in markDefs array with unique keys
   - Code spans use marks: ["code"]
   - Bold text uses marks: ["strong"]

4. **Extraction Guidelines:**
   - Function name: Look for patterns like \`--example [name]\` or in the title/header
   - GitHub URL: Usually in the repository path or can be constructed from context
   - Environment variables: Look for \`.env\`, \`process.env\`, or "Environment Variables" sections
   - Benefits: May need to be inferred from features if not explicitly stated
   - Technical details: Look for "Implementation", "How it works", or code explanations

5. **Conditional Elements:**
   - If no external service setup found in README, skip section 3 entirely
   - If setup is just environment variables, incorporate into Quick Start
   - If setup has multiple steps (creating accounts, tokens, webhooks), use dedicated section

## Content Adaptation Patterns

### If README mentions AI/ML features:
- Emphasize automation and intelligence benefits
- Quantify time saved when mentioned
- Focus on consistency improvements

### If README mentions notifications/alerts:
- Include detailed setup for the notification service
- Emphasize real-time communication
- Mention "direct links" or "instant access" as benefits

### If README mentions sync/integration:
- Focus on keeping data synchronized
- Emphasize removing technical debt
- Include reliability and scalability benefits

### If README is minimal:
- Infer benefits from the function's purpose
- Keep technical implementation general but accurate
- Focus on the core value proposition

## Output Format
Return ONLY the body as a valid JSON array matching the Portable Text structure, with proper _key (unique strings), _type ("block"), children array with spans, marks, and markDefs properties. Each block should have appropriate style ("normal") and listItem ("bullet" or "number") properties where applicable.

---

README URL: $readmeUrl
README Content: $readmeContent`

function isValidGitHubReadmeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)

    // Must be GitHub domain
    if (!(urlObj.hostname === 'github.com' || urlObj.hostname === 'raw.githubusercontent.com')) {
      return false
    }

    // Valid formats:
    // 1. Tree URLs: /owner/repo/tree/branch/path
    // 2. Blob README URLs: /owner/repo/blob/branch/path/README.md
    // 3. Raw README URLs: /owner/repo/branch/path/README.md
    return (
      url.includes('/tree/') ||
      url.toLowerCase().includes('readme.md') ||
      url.toLowerCase().includes('readme') ||
      url.toLowerCase().endsWith('/readme')
    )
  } catch {
    return false
  }
}

function convertToRawGitHubUrl(url: string): string {
  try {
    const urlObj = new URL(url)

    // If it's already a raw URL, return as-is
    if (urlObj.hostname === 'raw.githubusercontent.com') {
      return url
    }

    // Convert github.com blob URLs to raw.githubusercontent.com
    if (urlObj.hostname === 'github.com' && url.includes('/blob/')) {
      // Extract path parts: /owner/repo/blob/branch/path/to/file
      const pathParts = urlObj.pathname.split('/')
      if (pathParts.length >= 5 && pathParts[3] === 'blob') {
        const owner = pathParts[1]
        const repo = pathParts[2]
        const branch = pathParts[4]
        const filePath = pathParts.slice(5).join('/')

        return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`
      }
    }

    // Convert github.com tree URLs to raw README.md
    if (urlObj.hostname === 'github.com' && url.includes('/tree/')) {
      // Extract path parts: /owner/repo/tree/branch/path/to/directory
      const pathParts = urlObj.pathname.split('/')
      if (pathParts.length >= 5 && pathParts[3] === 'tree') {
        const owner = pathParts[1]
        const repo = pathParts[2]
        const branch = pathParts[4]
        const directoryPath = pathParts.slice(5).join('/')

        // Append README.md to the directory path
        const readmePath = directoryPath ? `${directoryPath}/README.md` : 'README.md'

        return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${readmePath}`
      }
    }

    // Return original URL if no conversion needed
    return url
  } catch {
    return url
  }
}

function convertToTreeGitHubUrl(url: string): string {
  try {
    const urlObj = new URL(url)

    // Convert raw.githubusercontent.com URLs to tree format
    if (urlObj.hostname === 'raw.githubusercontent.com') {
      // Extract path parts: /owner/repo/branch/path/to/README.md
      const pathParts = urlObj.pathname.split('/')
      if (pathParts.length >= 4) {
        const owner = pathParts[1]
        const repo = pathParts[2]
        let branch = pathParts[3]
        let filePath = pathParts.slice(4).join('/')

        // Handle refs/heads/branch format - convert to just branch name
        if (branch === 'refs' && pathParts.length >= 6 && pathParts[4] === 'heads') {
          branch = pathParts[5]
          filePath = pathParts.slice(6).join('/')
        }

        // Remove README.md from the end if present
        const directoryPath = filePath.replace(/\/README\.md$/i, '').replace(/^README\.md$/i, '')

        return directoryPath
          ? `https://github.com/${owner}/${repo}/tree/${branch}/${directoryPath}`
          : `https://github.com/${owner}/${repo}/tree/${branch}`
      }
    }

    // Convert github.com blob URLs to tree format
    if (urlObj.hostname === 'github.com' && url.includes('/blob/')) {
      // Extract path parts: /owner/repo/blob/branch/path/to/README.md
      const pathParts = urlObj.pathname.split('/')
      if (pathParts.length >= 5 && pathParts[3] === 'blob') {
        const owner = pathParts[1]
        const repo = pathParts[2]
        const branch = pathParts[4]
        const filePath = pathParts.slice(5).join('/')

        // Remove README.md from the end if present
        const directoryPath = filePath.replace(/\/README\.md$/i, '').replace(/^README\.md$/i, '')

        return directoryPath
          ? `https://github.com/${owner}/${repo}/tree/${branch}/${directoryPath}`
          : `https://github.com/${owner}/${repo}/tree/${branch}`
      }
    }

    // If it's already a tree URL, return as-is
    if (urlObj.hostname === 'github.com' && url.includes('/tree/')) {
      return url
    }

    // Return original URL if no conversion possible
    return url
  } catch {
    return url
  }
}

const GenerateBodyFromReadmeAction: DocumentActionComponent = (props) => {
  const { isValidating } = useValidationStatus(props.id, props.type)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const toast = useToast()

  const client = useClient({
    apiVersion: API_VERSION,
  }).withConfig({
    useCdn: false,
  })

  const handleSubmit = async () => {
    setError('')

    if (!url.trim()) {
      setError('Please enter a GitHub README URL')
      return
    }

    if (!isValidGitHubReadmeUrl(url.trim())) {
      setError(
        'Please enter a valid GitHub README URL (e.g., https://github.com/sanity-io/sanity/tree/main/examples/functions/function-name)',
      )
      return
    }

    try {
      setIsLoading(true)

      // Convert GitHub URL to raw URL for fetching
      const rawUrl = convertToRawGitHubUrl(url.trim())

      // Convert GitHub URL to tree URL for agent instruction
      const treeUrl = convertToTreeGitHubUrl(url.trim())

      // First, fetch the README content
      const readmeResponse = await fetch(rawUrl)
      if (!readmeResponse.ok) {
        throw new Error('Failed to fetch README content')
      }
      const readmeContent = await readmeResponse.text()

      // Use Agent Actions to generate the body
      await client.agent.action.generate({
        schemaId: SCHEMA_ID,
        documentId: props.id,
        target: { path: 'body' },
        instruction: PORTABLE_TEXT_PROMPT,
        instructionParams: {
          readmeUrl: { type: 'constant', value: treeUrl },
          readmeContent: { type: 'constant', value: readmeContent },
        },
        noWrite: false,
      })

      setUrl('')
      setIsModalOpen(false)

      toast.push({
        status: 'success',
        title: 'Body generated successfully!',
        description: 'The README content has been processed and added to the body field.',
      })

      props.onComplete()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate body content'
      setError(errorMessage)
      toast.push({
        status: 'error',
        title: 'Generation failed',
        description: 'There was an error processing the README. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Only show this action for contribution.schema documents
  if (props.type !== 'contribution.schema') {
    return null
  }

  // If document doesn't exist (no draft or published), prompt user to create content first
  if (!props.draft && !props.published) {
    return {
      label: 'Generate Body from README',
      icon: SparklesIcon,
      disabled: true,
      title: 'Create some content in this document first before generating body from README',
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setUrl('')
      setError('')
      setIsModalOpen(false)
    }
  }

  return {
    label: 'Generate Body from README',
    icon: SparklesIcon,
    disabled: isValidating || isLoading,
    onHandle: () => {
      setIsModalOpen(true)
    },
    dialog: isModalOpen && {
      type: 'dialog',
      header: 'Generate Body from README',
      content: (
        <Stack space={4}>
          <Text size={1} muted>
            Enter the URL to a GitHub README file. The content will be processed using AI to
            generate a structured body for this recipe.
          </Text>

          <Stack space={2}>
            <Text weight="semibold" size={1}>
              GitHub README URL
            </Text>
            <TextInput
              placeholder="https://github.com/username/repo/README.md"
              value={url}
              onChange={(event) => setUrl(event.currentTarget.value)}
              disabled={isLoading}
              tone={error ? 'critical' : 'default'}
            />
            {error && (
              <Text size={1} tone="critical">
                {error}
              </Text>
            )}
          </Stack>

          <Flex gap={2} justify="flex-end">
            <Button text="Cancel" mode="ghost" onClick={handleClose} disabled={isLoading} />
            <Button
              text={isLoading ? 'Generating...' : 'Generate Body'}
              tone="primary"
              onClick={handleSubmit}
              disabled={isLoading || !url.trim()}
              loading={isLoading}
            />
          </Flex>
        </Stack>
      ),
    },
  }
}

export default GenerateBodyFromReadmeAction
