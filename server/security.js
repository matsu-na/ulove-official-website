import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

export function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const derived = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${derived}`
}

export function verifyPassword(password, stored) {
  if (typeof stored !== 'string' || !stored.includes(':')) return false
  const [salt, expected] = stored.split(':')
  const actual = scryptSync(password, salt, 64)
  const expectedBuffer = Buffer.from(expected, 'hex')
  if (expectedBuffer.length !== actual.length) return false
  return timingSafeEqual(actual, expectedBuffer)
}
