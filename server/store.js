import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'
import { seedPosts } from './seed.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, 'data')
const DB_PATH = path.join(DATA_DIR, 'db.json')

export const DEMO_ACCOUNT = {
  nickname: '谷粒Demo',
  email: 'demo@yougu.com',
  password: 'yougu2026',
  bio: '在山谷里收集每一次心动。',
  joinedAt: '2026-09-18',
}

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

function createSeedDatabase() {
  const now = Date.now()
  const demoUser = {
    id: randomUUID(),
    nickname: DEMO_ACCOUNT.nickname,
    email: DEMO_ACCOUNT.email,
    passwordHash: hashPassword(DEMO_ACCOUNT.password),
    bio: DEMO_ACCOUNT.bio,
    joinedAt: DEMO_ACCOUNT.joinedAt,
    savedPostIds: [],
  }

  const posts = seedPosts.map((post) => ({
    id: post.id ?? randomUUID(),
    authorId: null,
    author: post.author,
    role: post.role,
    topic: post.topic,
    createdAt: post.time ?? now,
    title: post.title,
    body: post.body,
    art: post.art,
    likes: post.likes ?? 0,
    likedBy: [],
    comments: (post.comments ?? []).map((comment) => ({
      id: comment.id ?? randomUUID(),
      authorId: null,
      author: comment.author,
      body: comment.body,
      createdAt: comment.time ?? now,
    })),
  }))

  return {
    meta: {
      version: 1,
      createdAt: new Date(now).toISOString(),
    },
    users: [demoUser],
    sessions: [],
    posts,
    messages: [],
    subscriptions: [],
  }
}

let database = null

function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

export function loadDb() {
  if (database) return database
  ensureDataDir()
  try {
    if (fs.existsSync(DB_PATH)) {
      const parsed = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
      if (!Array.isArray(parsed.users) || !Array.isArray(parsed.posts)) throw new Error('数据库结构不正确')
      database = parsed
      return database
    }
  } catch (error) {
    console.warn(`[db] 无法读取现有数据库，将重新生成模拟数据：${error.message}`)
  }
  database = createSeedDatabase()
  saveDb()
  return database
}

export function saveDb() {
  if (!database) return
  ensureDataDir()
  fs.writeFileSync(DB_PATH, JSON.stringify(database, null, 2), 'utf8')
}

export function getDbPath() {
  return DB_PATH
}

export function publicUser(user) {
  if (!user) return null
  return {
    id: user.id,
    nickname: user.nickname,
    email: user.email,
    bio: user.bio,
    joinedAt: user.joinedAt,
  }
}

export function createSession(db, userId, remember) {
  const now = Date.now()
  db.sessions = db.sessions.filter((session) => session.expiresAt > now)
  const token = randomBytes(32).toString('hex')
  const maxAge = remember ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 60 * 24
  db.sessions.push({
    token,
    userId,
    createdAt: now,
    expiresAt: now + maxAge,
  })
  saveDb()
  return { token, maxAge }
}

export function removeSession(db, token) {
  if (!token) return
  db.sessions = db.sessions.filter((session) => session.token !== token)
  saveDb()
}

export function findSessionUser(db, token) {
  if (!token) return null
  const now = Date.now()
  const session = db.sessions.find((item) => item.token === token && item.expiresAt > now)
  if (!session) {
    if (db.sessions.some((item) => item.token === token)) {
      db.sessions = db.sessions.filter((item) => item.expiresAt > now)
      saveDb()
    }
    return null
  }
  return db.users.find((user) => user.id === session.userId) ?? null
}
