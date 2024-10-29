import * as core from '@actions/core'
import { readTemplate, readJsonFile } from '../utils/file-utils'
import { generateMarkdown } from '../utils/markdown-utils'
import { getAllGitHubContext } from 'src/utils/github-utils'
import { addCommentToPullRequest } from 'src/client/github'
import { context } from '@actions/github'

export async function runAction(): Promise<void> {
  try {
    const templatePath = core.getInput('template-file-path', {
      required: true
    })
    const jsonFilePath = core.getInput('json-file-path')
    const summary = core.getInput('summary')
    const pullRequest = core.getInput('pull-request')

    const templateSource = readTemplate(templatePath)
    const jsonData = jsonFilePath ? readJsonFile(jsonFilePath) : {}

    const markdown = generateMarkdown(templateSource, jsonData)

    if (pullRequest && context.eventName === 'pull_request') {
      await addCommentToPullRequest(
        context.repo.owner,
        context.repo.repo,
        context.issue.number,
        markdown
      )
    }

    console.log('Generated Markdown:')
    console.log(markdown)

    console.log('summary' + summary)

    if (summary) core.summary.addRaw(markdown).write()

    getAllGitHubContext()

    core.setOutput('markdown', markdown)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Action failed with error: ${error.message}`)
    } else {
      core.setFailed('Action failed with an unknown error')
    }
  }
}
