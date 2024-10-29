import { compileTemplate } from './handlebars-utils'

export function generateMarkdown(templateSource: string, data: any): string {
  return compileTemplate(templateSource, data)
}
