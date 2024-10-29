import * as handlebars from 'handlebars'

export function uppercaseHelper(): void {
  handlebars.registerHelper('uppercase', (str: string) => {
    return str.toUpperCase()
  })
}
