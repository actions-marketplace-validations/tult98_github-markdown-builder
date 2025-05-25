import { uppercaseHelper } from './upper-case'
import { formatDurationHumanReadableHelper } from './duration'
import { eqHelper } from './eq'

export function registerAllHelpers(): void {
  uppercaseHelper()
  formatDurationHumanReadableHelper()
  eqHelper()
}
