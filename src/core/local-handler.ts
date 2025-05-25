import { readTemplate, readJsonFile } from '../utils/file-utils'
import { generateMarkdown } from '../utils/markdown-utils'

export function runLocal(): void {
  try {
    const templatePath = process.argv[2] || './templates/example.hbs'
    const jsonFilePath = process.argv[3] || null

    const templateSource = readTemplate(templatePath)
    const jsonData = jsonFilePath ? readJsonFile(jsonFilePath) : {}

    const markdown = generateMarkdown(templateSource, jsonData)

    console.log('Generated Markdown:')
    console.log(markdown)
  } catch (error) {
    console.error(
      `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
