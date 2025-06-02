import * as core from '@actions/core'
import { context } from '@actions/github'
import {
  addCommentToPullRequest,
  getCiSummaryComment,
  updateCommentOnPullRequest
} from 'src/client/github'
import { parseCiSummaryCommentToData } from 'src/helpers/ci-summary'
import { getAllGitHubContext } from 'src/utils/github-utils'
import { readJsonFile, readTemplate } from '../utils/file-utils'
import { generateMarkdown } from '../utils/markdown-utils'

type WorkflowInput = {
  name: string
  required: boolean
  status: string
  runUrl: string
  errors?: string[]
}

export async function runAction(): Promise<void> {
  try {
    const inputs = getActionInputs()
    validateInputs(inputs)

    const templateSource = readTemplate('templates/ci-summary-template.hbs')
    const jsonData = inputs.initJsonFilePath
      ? readJsonFile(inputs.initJsonFilePath)
      : {}
    const markdown = generateMarkdown(templateSource, jsonData)

    if (inputs.pullRequest && context.eventName === 'pull_request') {
      await handlePullRequestAction(inputs, templateSource, markdown)
    }

    logAndOutputResults(markdown, inputs.summary)
  } catch (error) {
    handleError(error)
  }
}

function getActionInputs() {
  console.log('====================DEBUG====================')
  console.log(
    core.getInput('workflow-required'),
    typeof core.getInput('workflow-required')
  )
  console.log(
    core.getInput('workflow-run-errors'),
    typeof core.getInput('workflow-run-errors')
  )
  console.log('====================DEBUG====================')
  return {
    initJsonFilePath: core.getInput('init-json-file-path'),
    pullRequest: core.getInput('pull-request'),
    summary: core.getInput('summary'),
    workflow: {
      name: core.getInput('workflow-name'),
      required: core.getInput('workflow-required') === 'true',
      status: core.getInput('workflow-status'),
      runUrl: core.getInput('workflow-run-url'),
      errors: core.getInput('workflow-run-errors') as unknown as string[]
    }
  }
}

function validateInputs(inputs: ReturnType<typeof getActionInputs>) {
  const { initJsonFilePath, workflow } = inputs

  if (
    initJsonFilePath &&
    (workflow.name ||
      workflow.required ||
      workflow.status ||
      workflow.runUrl ||
      workflow.errors)
  ) {
    throw new Error(
      'Do not provide any other input if you provide init-json-file-path'
    )
  }

  if (
    !initJsonFilePath &&
    (!workflow.name || !workflow.required || !workflow.runUrl)
  ) {
    throw new Error('Missing required inputs to update the existing CI Summary')
  }
}

async function handlePullRequestAction(
  inputs: ReturnType<typeof getActionInputs>,
  templateSource: string,
  initialMarkdown: string
): Promise<void> {
  const { initJsonFilePath, workflow } = inputs

  // If initializing with JSON file, create a new comment
  if (initJsonFilePath) {
    await addCommentToPullRequest(
      context.repo.owner,
      context.repo.repo,
      context.issue.number,
      initialMarkdown
    )
    return
  }

  // Otherwise update existing comment with new workflow data
  try {
    const comment = await getCiSummaryComment(context)

    if (!comment) {
      await addCommentToPullRequest(
        context.repo.owner,
        context.repo.repo,
        context.issue.number,
        initialMarkdown
      )
      return
    }

    await updateExistingComment(comment, workflow, templateSource)
  } catch (error) {
    // Handle specific API errors
    if (error instanceof Error) {
      core.warning(`Error handling comment: ${error.message}`)
      // Could implement retry logic here
    }
    throw error
  }
}

async function updateExistingComment(
  comment: any,
  workflow: WorkflowInput,
  templateSource: string
): Promise<void> {
  // Parse and update the comment data
  const summaryData = parseCiSummaryCommentToData(comment.body)

  // Prepare the new CI item
  const newCIItem = {
    name: workflow.name,
    required: workflow.required,
    status: workflow.status,
    reference: workflow.runUrl,
    errors: workflow.errors ? workflow.errors : undefined
  }

  // Update or add the workflow item
  const index = summaryData.items.findIndex(item => item.name === workflow.name)
  if (index === -1) {
    summaryData.items.push(newCIItem)
  } else {
    summaryData.items[index] = newCIItem
  }

  // Generate new markdown and update comment
  const newMarkdown = generateMarkdown(templateSource, summaryData)

  await updateCommentOnPullRequest({
    owner: context.repo.owner,
    repo: context.repo.repo,
    comment_id: Number(comment.id),
    body: newMarkdown,
    refreshMessagePosition: false,
    issueNumber: context.issue.number
  })
}

function logAndOutputResults(markdown: string, summary?: string): void {
  console.log('Generated Markdown:')
  console.log(markdown)

  if (summary) {
    core.summary.addRaw(markdown).write()
  }

  getAllGitHubContext()
  core.setOutput('markdown', markdown)
}

function handleError(error: unknown): void {
  if (error instanceof Error) {
    core.setFailed(`Action failed with error: ${error.message}`)
  } else {
    core.setFailed('Action failed with an unknown error')
  }
}
