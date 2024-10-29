import * as fs from 'fs'

export function readTemplate(filePath: string): string {
  if (!filePath.endsWith('.hbs') && !filePath.endsWith('.md')) {
    throw new Error(
      `File must have a handlebars or markdown extension: ${filePath}`
    )
  }
  if (!fs.existsSync(filePath)) {
    throw new Error(`Template file not found: ${filePath}`)
  }
  return fs.readFileSync(filePath, 'utf-8')
}

export function readJsonFile(filePath: string): any {
  if (!fs.existsSync(filePath)) {
    throw new Error(`JSON file not found: ${filePath}`)
  }
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(fileContent)
}
