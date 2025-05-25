import * as core from '@actions/core'

export async function createGitHubClient(): Promise<any> {
  const { Octokit } = await import('@octokit/rest')
  const token = core.getInput('repo-token') || process.env.GITHUB_TOKEN

  if (!token) {
    throw new Error('GitHub token is required to authenticate Octokit')
  }

  return new Octokit({ auth: token })
}

export async function addCommentToPullRequest(
  owner: string,
  repo: string,
  pull_number: number,
  body: string
): Promise<any> {
  const octokit = await createGitHubClient()
  const { data } = await octokit.issues.createComment({
    owner,
    repo,
    issue_number: pull_number,
    body
  })
  return data
}

export async function updateCommentOnPullRequest({
  owner,
  repo,
  comment_id,
  body,
  refreshMessagePosition,
  issueNumber
}: {
  owner: string
  repo: string
  comment_id: number
  body: string
  refreshMessagePosition: boolean
  issueNumber: number
}): Promise<any> {
  const octokit = await createGitHubClient()

  if (refreshMessagePosition) {
    await octokit.issues.deleteComment({
      owner,
      repo,
      comment_id
    })

    const { data } = await octokit.issues.createComment({
      owner,
      repo,
      issue_number: issueNumber,
      body
    })

    return data
  }

  const { data } = await octokit.issues.updateComment({
    owner,
    repo,
    comment_id,
    body
  })

  return data
}
