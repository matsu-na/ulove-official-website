import { spawn } from 'node:child_process'

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

start(['server/index.js'], 'api')
start(['node_modules/vite/bin/vite.js'], 'web')

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))
