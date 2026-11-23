import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
try {
  process.loadEnvFile(path.join(__dirname, '.env'))
} catch {
  // No local .env: the server will use environment variables.
}

const node = process.execPath
const children = []
let shuttingDown = false

function start(args, name) {
  const child = spawn(node, args, {
    stdio: 'inherit',
    env: process.env,
  })
  child.on('exit', (code) => {
    if (!shuttingDown && code !== 0) {
      console.error(`[dev] ${name} exited with code ${code}`)
      shutdown(code || 1)
    }
  })
  children.push(child)
  return child
}

function shutdown(code = 0) {
  if (shuttingDown) return
  shuttingDown = true
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM')
  }
  setTimeout(() => process.exit(code), 300)
}

async function waitForApi() {
  const port = Number(process.env.PORT || 8787)
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/api/health`)
      if (response.ok) return
    } catch {
      // The API is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error(`API did not become ready on port ${port}`)
}

start(['server/index.js'], 'api')

try {
  await waitForApi()
  start(['node_modules/vite/bin/vite.js'], 'web')
} catch (error) {
  console.error(`[dev] ${error.message}`)
  shutdown(1)
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))
