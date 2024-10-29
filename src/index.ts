import { runAction } from './core/action-handler'
import { runLocal } from './core/local-handler'

async function run(): Promise<void> {
  const isLocal = !process.env.GITHUB_ACTIONS

  if (isLocal) {
    await runLocal()
  } else {
    await runAction()
  }
}

run()
