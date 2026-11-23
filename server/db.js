import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'
import pg from 'pg'
import {
  EVENT,
  NEWS_CATEGORIES,
  news,
  guests,
  schedule,
  faqs,
  communityTopics,
  seedPosts,
  stats,
  timeline,
} from './seed.js'
import { hashPassword } from './security.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// Keep PostgreSQL DATE values as ISO date strings instead of local Date objects.
pg.types.setTypeParser(1082, (value) => value)

try {
  process.loadEnvFile(path.join(ROOT, '.env'))
} catch (error) {
  if (error.code !== 'ENOENT') console.warn(`[env] ${error.message}`)
}

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('缺少 DATABASE_URL，请在 .env 中配置 PostgreSQL 连接串')
}

export const DEMO_ACCOUNT = {
  nickname: '谷粒Demo',
  email: 'demo@yougu.com',
  password: 'yougu2026',
  bio: '在山谷里收集每一次心动。',
  joinedAt: '2026-09-18',
}

export const SITE_CONTENT = {
  event: EVENT,
  newsCategories: NEWS_CATEGORIES,
  news,
  guests,
  schedule,
  faqs,
  communityTopics,
  stats,
  timeline,
}

export const pool = new pg.Pool({
  connectionString,
  ssl: process.env.PGSSL === 'false' ? undefined : { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
})

pool.on('error', (error) => {
  console.error('[pg] idle client error', error.message)
})

export function query(text, params) {
  return pool.query(text, params)
}

export async function withTransaction(callback) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {})
    throw error
  } finally {
    client.release()
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function seedDatabase() {
  await withTransaction(async (client) => {
    const demo = await client.query('SELECT id FROM yougu_users WHERE email = $1', [DEMO_ACCOUNT.email])
    if (demo.rowCount === 0) {
      await client.query(
        `INSERT INTO yougu_users (id, nickname, email, password_hash, bio, joined_at)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          randomUUID(),
          DEMO_ACCOUNT.nickname,
          DEMO_ACCOUNT.email,
          hashPassword(DEMO_ACCOUNT.password),
          DEMO_ACCOUNT.bio,
          DEMO_ACCOUNT.joinedAt,
        ],
      )
    }

    for (const [key, payload] of Object.entries(SITE_CONTENT)) {
      await client.query(
        `INSERT INTO yougu_content_blocks (key, payload)
         VALUES ($1, $2::jsonb)
         ON CONFLICT (key) DO NOTHING`,
        [key, JSON.stringify(payload)],
      )
    }

    const seeded = await client.query("SELECT value FROM yougu_meta WHERE key = 'seeded_posts'")
    if (seeded.rowCount === 0) {
      const count = await client.query('SELECT count(*)::int AS count FROM yougu_posts')
      if (count.rows[0].count === 0) {
        const now = Date.now()
        for (const post of seedPosts) {
          await client.query(
            `INSERT INTO yougu_posts
              (id, author_id, author, role, topic, title, body, art, likes, created_at)
             VALUES ($1, NULL, $2, $3, $4, $5, $6, $7::jsonb, $8, $9)`,
            [
              post.id,
              post.author,
              post.role,
              post.topic,
              post.title,
              post.body,
              JSON.stringify(post.art),
              post.likes ?? 0,
              new Date(post.time ?? now),
            ],
          )
          for (const comment of post.comments ?? []) {
            await client.query(
              `INSERT INTO yougu_comments (id, post_id, author_id, author, body, created_at)
               VALUES ($1, $2, NULL, $3, $4, $5)`,
              [
                comment.id,
                post.id,
                comment.author,
                comment.body,
                new Date(comment.time ?? now),
              ],
            )
          }
        }
      }
      await client.query(
        `INSERT INTO yougu_meta (key, value)
         VALUES ('seeded_posts', 'true'::jsonb)
         ON CONFLICT (key) DO NOTHING`,
      )
    }
  })
}

async function createSchema() {
  await query(`
    CREATE TABLE IF NOT EXISTS yougu_content_blocks (
      key TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS yougu_users (
      id TEXT PRIMARY KEY,
      nickname TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      bio TEXT NOT NULL DEFAULT '',
      joined_at DATE NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS yougu_sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES yougu_users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS yougu_sessions_expires_idx ON yougu_sessions (expires_at);

    CREATE TABLE IF NOT EXISTS yougu_posts (
      id TEXT PRIMARY KEY,
      author_id TEXT REFERENCES yougu_users(id) ON DELETE SET NULL,
      author TEXT NOT NULL,
      role TEXT NOT NULL,
      topic TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      art JSONB,
      likes INTEGER NOT NULL DEFAULT 0 CHECK (likes >= 0),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS yougu_posts_created_idx ON yougu_posts (created_at DESC);

    CREATE TABLE IF NOT EXISTS yougu_comments (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL REFERENCES yougu_posts(id) ON DELETE CASCADE,
      author_id TEXT REFERENCES yougu_users(id) ON DELETE SET NULL,
      author TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS yougu_comments_post_idx ON yougu_comments (post_id, created_at);

    CREATE TABLE IF NOT EXISTS yougu_post_likes (
      post_id TEXT NOT NULL REFERENCES yougu_posts(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES yougu_users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (post_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS yougu_bookmarks (
      user_id TEXT NOT NULL REFERENCES yougu_users(id) ON DELETE CASCADE,
      post_id TEXT NOT NULL REFERENCES yougu_posts(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (user_id, post_id)
    );

    CREATE TABLE IF NOT EXISTS yougu_contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      topic TEXT NOT NULL,
      message TEXT NOT NULL,
      consent BOOLEAN NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS yougu_newsletter_subscriptions (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS yougu_meta (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL
    );
  `)
}

export async function initializeDatabase() {
  let lastError
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await createSchema()
      await seedDatabase()
      await query('DELETE FROM yougu_sessions WHERE expires_at <= now()')
      return
    } catch (error) {
      lastError = error
      console.error(`[db] initialization attempt ${attempt} failed: ${error.message}`)
      if (attempt < 3) await sleep(attempt * 1200)
    }
  }
  throw lastError
}

export async function getContent() {
  const result = await query('SELECT key, payload FROM yougu_content_blocks')
  return result.rows.reduce((content, row) => {
    content[row.key] = row.payload
    return content
  }, {})
}
