# GitHub Markdown Builder

A GitHub Action to build dynamic markdown summaries for GitHub Actions and pull
requests using Handlebars templates and custom data.

## Description

MarkdownBuilder helps you create custom markdown summaries for GitHub Actions
workflows and pull requests using the power of Handlebars templating. With
MarkdownBuilder, you can customize your templates with optional JSON data,
posting the results directly to GitHub Action summaries or as comments on pull
requests.

Inspired by
[GitHub Test Reporter](https://github.com/ctrf-io/github-test-reporter)

## Support Us

If you find this project useful, consider giving it a GitHub star ⭐

It means a lot to us.

## Usage

Add MarkdownBuilder to your GitHub workflow by specifying the Handlebars
template and optional JSON data file. MarkdownBuilder will generate and post the
markdown summary as specified.

## Example Workflow

```yaml
name: Generate Markdown Summary
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Generate Markdown Summary
        uses: Ma11hewThomas/github-markdown-builder@v1.0.0
        with:
          template-file-path: './path/to/template.hbs'
          json-file-path: './path/to/data.json' # Optional
          summary: true # Set to true to post to GitHub Action summary
          pull-request: false # Set to true to comment on PR if available
```

## Inputs

| Name                 | Description                                       | Required | Default |
| -------------------- | ------------------------------------------------- | -------- | ------- |
| `template-file-path` | Path to the Handlebars template file to use.      | `true`   | -       |
| `json-file-path`     | Path to the optional JSON file for template data. | `false`  | -       |
| `summary`            | Post markdown to GitHub Action summary            | `false`  | `true`  |
| `pull-request`       | Comment markdown on Pull Request                  | `false`  | `false` |

## Outputs

| Name      | Description                     |
| --------- | ------------------------------- |
| `summary` | The generated markdown summary. |

## Posting a Summary to GitHub Actions

To post the markdown output to the GitHub Actions summary, set summary: true.
This will add the generated markdown to the GitHub Actions summary tab, visible
within the workflow logs.

## Commenting on a Pull Request

To add a comment directly to an open pull request, set pull-request: true.
Ensure your workflow is triggered by an event that provides a pull request
context (e.g., pull_request or pull_request_target events).

You must set the `GITHUB_TOKEN`, which is typically available by default in
GitHub Actions, but it needs to have write permissions for pull requests. For
guidance on configuring these permissions, please see GitHub's
[documentation](https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication#permissions-for-the-github_token).

```yaml
- name: Comment On Pull Request
  uses: Ma11hewThomas/github-markdown-builder@v1.0.0
  with:
    template-file-path: './path/to/template.hbs'
    json-file-path: './path/to/data.json' # Optional
    pull-request: true # Set to true to comment on PR if available
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Using Handlebars Templates with Custom Data

MarkdownBuilder uses Handlebars templates to let you customize the markdown
output. You provide a Handlebars template file (with a .hbs extension) and,
optionally, a JSON data file to define custom data that will populate your
template.

### Template Structure

In your template file, you can reference any data from the JSON file using the
`{{data.propertyName}}` syntax. For example, if your JSON file contains the
following:

```json
{
  "example": "Hello, World!",
  "title": "Markdown Summary",
  "items": ["Item 1", "Item 2", "Item 3"]
}
```

You can access these values in your Handlebars template as follows:

```handlebars
#
{{data.title}}

This is an example output:
{{data.example}}

## List of Items
{{#each data.items}}
  -
  {{this}}
{{/each}}
```

In this example:

- `{{data.title}}` will be replaced by "Markdown Summary".
- `{{data.example}}` will output "Hello, World!".
- The `{{#each data.details}}` block will iterate over each item in the items
  array, creating a bullet point list.

## GitHub Properties

MarkdownBuilder provides easy access to various GitHub context properties,
enabling you to incorporate GitHub-specific data directly into your Handlebars
templates. This can be especially useful for generating summaries or pull
request comments that reflect repository information, workflow details, or the
current pull request status.

These properties are accessible under the `github` property in your templates.

### Available GitHub Properties

The following GitHub properties are available for use in your Handlebars
templates:

- **Action Context** (accessed via `github`)

  - `action`: Name of the GitHub Action being executed
  - `actor`: The GitHub username of the person or app that triggered the
    workflow
  - `eventName`: The event that triggered the workflow
  - `sha`: The commit SHA that triggered the workflow
  - `ref`: The branch or tag reference of the repository
  - `workflow`: The name of the workflow
  - `job`: The job ID in the workflow
  - `runNumber`: The run number of the workflow
  - `runId`: The unique ID for the workflow run
  - `apiUrl`, `serverUrl`, `graphqlUrl`: URLs for GitHub API, server, and
    GraphQL endpoints
  - `buildUrl`: A direct URL to the summary view of the workflow run

- **Repository Context** (accessed via `github.repository`)

  - `cloneUrl`: URL to clone the repository
  - `createdAt`: Repository creation timestamp
  - `defaultBranch`: Default branch of the repository
  - `description`: Repository description
  - `fullName`: Full name of the repository (e.g., `owner/repo`)
  - `htmlUrl`: Web URL of the repository
  - `language`: Main language used in the repository
  - `licenseName`: Name of the license (if any)
  - `name`: Repository name
  - `openIssuesCount`: Count of open issues in the repository
  - `size`: Size of the repository in KB
  - `stargazersCount`: Number of stars the repository has received
  - `allowForking`: Whether the repository allows forking
  - `compareUrl`: URL to compare changes between the default branch and the
    latest commit
  - `contributorsUrl`: URL to view repository contributors
  - `deploymentsUrl`: URL to view repository deployments
  - `downloadsUrl`: URL to view repository downloads
  - `eventsUrl`: URL to view repository events
  - `forksUrl`: URL to view repository forks
  - `sshUrl`: SSH URL for cloning the repository
  - `stargazersUrl`: URL to view stargazers of the repository
  - `statusesUrl`: URL to view commit statuses
  - `subscriptionUrl`: URL to view repository subscription options
  - `tagsUrl`: URL to view repository tags
  - `teamsUrl`: URL to view repository teams

- **Pull Request Context** (only available if the workflow is triggered by a
  pull request event; accessed via `github.pullRequest`)

  - `additions`: Number of additions in the pull request
  - `assignee`: GitHub username of the assigned reviewer
  - `assignees`: List of all assigned reviewers
  - `authorAssociation`: Author’s association with the repository
  - `autoMerge`: Whether auto-merge is enabled
  - `pushedAt`: Timestamp of the last push to the pull request
  - `body`: Body content of the pull request
  - `changedFiles`: Number of changed files in the pull request
  - `closedAt`: Timestamp of when the pull request was closed
  - `comments`: Number of comments on the pull request
  - `createdAt`: Timestamp of when the pull request was created
  - `deletions`: Number of deletions in the pull request
  - `diffUrl`: URL to the diff of the pull request
  - `draft`: Whether the pull request is a draft
  - `htmlUrl`: Web URL of the pull request
  - `id`: ID of the pull request
  - `labels`: List of labels on the pull request
  - `number`: Pull request number
  - `patchUrl`: URL to the patch of the pull request
  - `rebaseable`: Whether the pull request can be rebased
  - `requestedReviewers`: List of requested reviewers
  - `requestedTeams`: List of requested teams for review
  - `reviewComments`: Number of review comments on the pull request
  - `state`: State of the pull request (e.g., open, closed, merged)
  - `title`: Title of the pull request

- **Sender Context** (details about the GitHub user who triggered the workflow;
  ; accessed via `github.sender`)
  - `login`: GitHub username of the sender
  - `id`: ID of the sender
  - `nodeId`: Node ID of the sender
  - `avatarUrl`: Avatar URL of the sender
  - `gravatarId`: Gravatar ID of the sender
  - `htmlUrl`: Web URL of the sender’s GitHub profile
  - `type`: Type of the sender (e.g., User, Bot)
  - `siteAdmin`: Whether the sender is a GitHub site admin

### Example Usage

You can use any of these properties in your Handlebars template by referencing
`{{github.propertyName}}`. For example:

```handlebars
# Workflow Summary **Repository**: [{{github.repository.fullName}}]({{github.repository.htmlUrl}})
**Workflow**:
{{github.workflow}}
(Run #{{github.runNumber}}) **Triggered By**:
{{github.actor}}

### Pull Request Details (if available)
{{#if github.pullRequest}}
  - Title:
  {{github.pullRequest.title}}
  - PR Number: #{{github.pullRequest.number}}
  - Created At:
  {{github.pullRequest.createdAt}}
  - Additions:
  {{github.pullRequest.additions}}
  - Deletions:
  {{github.pullRequest.deletions}}
{{/if}}
```

## Handling Missing Data

If certain properties in the JSON file are missing, Handlebars will leave the
corresponding placeholders empty. To prevent issues, you may want to use
Handlebars helpers or default values in your template where applicable.

By providing flexible templating, MarkdownBuilder allows you to dynamically
generate markdown content based on the data you supply, making it easy to adjust
outputs to suit different workflows and scenarios.

## HandleBars Helpers

MarkdownBuilder supports various Handlebars helpers, which enable more advanced
functionality in your templates. Helpers allow you to perform operations like
conditional checks, iterating over lists, and custom formatting. MarkdownBuilder
supports built-in
[Handlebars helpers](https://handlebarsjs.com/guide/builtin-helpers.html) as
well as a few custom helpers to extend functionality.

### Custom helpers

Coming Soon!
