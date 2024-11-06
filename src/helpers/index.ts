import { uppercaseHelper } from './upper-case'
import { formatDurationHumanReadableHelper } from './duration'

export function registerAllHelpers(): void {
  uppercaseHelper()
  formatDurationHumanReadableHelper()
}
