import * as core from '@actions/core'

const MAX_RETRIES = 5

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
  etag
}: {
  owner: string
  repo: string
  comment_id: number
  body: string
  etag?: string
}): Promise<any> {
  const octokit = await createGitHubClient()

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const { data } = await octokit.request(
        'PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}',
        {
          owner,
          repo,
          comment_id,
          body,
          headers: etag ? { 'If-Match': etag } : undefined
        }
      )
      return data // success!
    } catch (error: any) {
      if (error.status === 412 && attempt < MAX_RETRIES) {
        console.warn(`ETag mismatch on attempt ${attempt}, retrying...`)
        // Optional: get updated etag here if desired
        await wait(300 * attempt) // exponential backoff
      } else {
        throw error
      }
    }
  }

  throw new Error('Failed to update comment after max retries')
}

async function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
