import * as handlebars from 'handlebars'
import { registerAllHelpers } from '../helpers'
import { getAllGitHubContext } from './github-utils'

export function compileTemplate(templateSource: string, data: any): string {
  registerAllHelpers()
  const context = { data: data, github: getAllGitHubContext() }
  const template = handlebars.compile(templateSource)
  return template(context)
}
