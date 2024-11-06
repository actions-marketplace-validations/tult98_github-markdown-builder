import * as handlebars from 'handlebars'

export function formatDurationHumanReadableHelper(): void {
  handlebars.registerHelper(
    'formatDurationHumanReadable',
    (durationMs: number) => {
      if (durationMs < 1) {
        return `1ms`
      } else if (durationMs < 1000) {
        return `${Math.floor(durationMs)}ms`
      } else if (durationMs < 60000) {
        return `${(durationMs / 1000).toFixed(1)}s`
      } else {
        const minutes = Math.floor(durationMs / 60000)
        const seconds = Math.floor((durationMs % 60000) / 1000)
        return `${minutes}m${seconds}s`
      }
    }
  )
}
