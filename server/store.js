import { randomBytes, randomUUID } from 'node:crypto'
import { query, withTransaction } from './db.js'
import { hashPassword, verifyPassword } from './security.js'

export function publicUser(user) {
  if (!user) return null
  return {
    id: user.id,
    nickname: user.nickname,
    email: user.email,
    bio: user.bio,
    joinedAt: String(user.joined_at).slice(0, 10),
  }
}

export async function authenticate(email, password) {
  const result = await query('SELECT * FROM yougu_users WHERE email = $1', [email])
  const user = result.rows[0]
  if (!user) return null
  if (!verifyPassword(password, user.password_hash)) return null
  return publicUser(user)
}

export async function findUserByEmail(email) {
  const result = await query('SELECT id FROM yougu_users WHERE email = $1', [email])
  return result.rows[0] ?? null
}

export async function createUser({ nickname, email, password }) {
  const result = await query(
    `INSERT INTO yougu_users (id, nickname, email, password_hash, bio, joined_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      randomUUID(),
      nickname,
      email,
      hashPassword(password),
      '刚刚抵达山谷，正在寻找同频的人。',
      new Date().toISOString().slice(0, 10),
    ],
  )
  return publicUser(result.rows[0])
}

export async function updateUser(userId, { nickname, bio }) {
  const fields = []
  const values = []
  if (nickname) {
    values.push(nickname)
    fields.push(`nickname = $${values.length}`)
  }
  if (typeof bio === 'string') {
    values.push(bio)
    fields.push(`bio = $${values.length}`)
  }
  if (fields.length === 0) {
    const result = await query('SELECT * FROM yougu_users WHERE id = $1', [userId])
    return publicUser(result.rows[0])
  }
  values.push(userId)
  const result = await query(
    `UPDATE yougu_users SET ${fields.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values,
  )
  return publicUser(result.rows[0])
}

export async function createSession(userId, remember) {
  await query('DELETE FROM yougu_sessions WHERE expires_at <= now()')
  const token = randomBytes(32).toString('hex')
  const maxAge = remember ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 60 * 24
  const expiresAt = new Date(Date.now() + maxAge)
  await query(
    'INSERT INTO yougu_sessions (token, user_id, expires_at) VALUES ($1, $2, $3)',
    [token, userId, expiresAt],
  )
  return { token, maxAge }
}

export async function findSessionUser(token) {
  if (!token) return null
  const result = await query(
    `SELECT u.* FROM yougu_sessions s
     JOIN yougu_users u ON u.id = s.user_id
     WHERE s.token = $1 AND s.expires_at > now()`,
    [token],
  )
  return publicUser(result.rows[0] ?? null)
}

export async function removeSession(token) {
  if (!token) return
  await query('DELETE FROM yougu_sessions WHERE token = $1', [token])
}

const POST_SELECT = `
  SELECT
    p.*,
    EXISTS (
      SELECT 1 FROM yougu_post_likes l
      WHERE l.post_id = p.id AND l.user_id = $1
    ) AS liked_by_me,
    EXISTS (
      SELECT 1 FROM yougu_bookmarks b
      WHERE b.post_id = p.id AND b.user_id = $1
    ) AS saved_by_me,
    COALESCE((
      SELECT json_agg(
        json_build_object(
          'id', c.id,
          'author', c.author,
          'body', c.body,
          'createdAt', (extract(epoch FROM c.created_at) * 1000)::bigint
        )
        ORDER BY c.created_at
      )
      FROM yougu_comments c
      WHERE c.post_id = p.id
    ), '[]'::json) AS comments
  FROM yougu_posts p
`

function mapPost(row) {
  return {
    id: row.id,
    author: row.author,
    authorId: row.author_id,
    role: row.role,
    topic: row.topic,
    createdAt: new Date(row.created_at).getTime(),
    title: row.title,
    body: row.body,
    art: row.art,
    likes: row.likes,
    likedByMe: Boolean(row.liked_by_me),
    savedByMe: Boolean(row.saved_by_me),
    comments: (row.comments ?? []).map((comment) => ({
      id: comment.id,
      author: comment.author,
      body: comment.body,
      createdAt: Number(comment.createdAt),
    })),
  }
}

export async function listPosts({ userId = null, topic = '', mine = false, sort = 'recommend', limit = 100 }) {
  const conditions = []
  const params = [userId]
  const countConditions = []
  const countParams = []

  if (topic) {
    params.push(topic)
    conditions.push(`p.topic = $${params.length}`)
    countParams.push(topic)
    countConditions.push(`p.topic = $${countParams.length}`)
  }
  if (mine) {
    params.push(userId)
    conditions.push(`p.author_id = $${params.length}`)
    countParams.push(userId)
    countConditions.push(`p.author_id = $${countParams.length}`)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const countWhere = countConditions.length ? `WHERE ${countConditions.join(' AND ')}` : ''
  const orderBy =
    sort === 'latest'
      ? 'p.created_at DESC'
      : 'p.likes + (SELECT count(*) FROM yougu_comments c2 WHERE c2.post_id = p.id) * 3 DESC, p.created_at DESC'

  const countResult = await query(
    `SELECT count(*)::int AS count FROM yougu_posts p ${countWhere}`,
    countParams,
  )

  const queryParams = [...params, limit]
  const result = await query(
    `${POST_SELECT}
     ${where}
     ORDER BY ${orderBy}
     LIMIT $${queryParams.length}`,
    queryParams,
  )

  return {
    posts: result.rows.map(mapPost),
    total: countResult.rows[0]?.count ?? 0,
  }
}

export async function getPostById(id, userId = null) {
  const result = await query(`${POST_SELECT} WHERE p.id = $2`, [userId, id])
  return result.rows[0] ? mapPost(result.rows[0]) : null
}

export async function createPost({ user, title, body, topic, art }) {
  const id = randomUUID()
  await query(
    `INSERT INTO yougu_posts
      (id, author_id, author, role, topic, title, body, art, likes, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, 0, now())`,
    [
      id,
      user.id,
      user.nickname,
      '山谷居民',
      topic,
      title,
      body,
      JSON.stringify(art),
    ],
  )
  return getPostById(id, user.id)
}

export async function toggleLike(postId, user) {
  await withTransaction(async (client) => {
    const existing = await client.query(
      'SELECT 1 FROM yougu_post_likes WHERE post_id = $1 AND user_id = $2',
      [postId, user.id],
    )
    if (existing.rowCount > 0) {
      await client.query('DELETE FROM yougu_post_likes WHERE post_id = $1 AND user_id = $2', [
        postId,
        user.id,
      ])
      await client.query('UPDATE yougu_posts SET likes = GREATEST(0, likes - 1) WHERE id = $1', [postId])
    } else {
      await client.query('INSERT INTO yougu_post_likes (post_id, user_id) VALUES ($1, $2)', [
        postId,
        user.id,
      ])
      await client.query('UPDATE yougu_posts SET likes = likes + 1 WHERE id = $1', [postId])
    }
  })
  return getPostById(postId, user.id)
}

export async function toggleBookmark(postId, user) {
  const existing = await query(
    'SELECT 1 FROM yougu_bookmarks WHERE post_id = $1 AND user_id = $2',
    [postId, user.id],
  )
  let saved
  if (existing.rowCount > 0) {
    await query('DELETE FROM yougu_bookmarks WHERE post_id = $1 AND user_id = $2', [postId, user.id])
    saved = false
  } else {
    await query('INSERT INTO yougu_bookmarks (post_id, user_id) VALUES ($1, $2)', [postId, user.id])
    saved = true
  }
  return { post: await getPostById(postId, user.id), saved }
}

export async function addComment(postId, user, body) {
  await query(
    `INSERT INTO yougu_comments (id, post_id, author_id, author, body, created_at)
     VALUES ($1, $2, $3, $4, $5, now())`,
    [randomUUID(), postId, user.id, user.nickname, body],
  )
  return getPostById(postId, user.id)
}

export async function postExists(id) {
  const result = await query('SELECT 1 FROM yougu_posts WHERE id = $1', [id])
  return result.rowCount > 0
}

export async function createContactMessage(record) {
  const id = randomUUID()
  const result = await query(
    `INSERT INTO yougu_contact_messages (id, name, email, topic, message, consent)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING created_at`,
    [id, record.name, record.email, record.topic, record.message, record.consent],
  )
  return { id, createdAt: result.rows[0].created_at }
}

export async function subscribeNewsletter(email) {
  const result = await query(
    `INSERT INTO yougu_newsletter_subscriptions (id, email)
     VALUES ($1, $2)
     ON CONFLICT (email) DO NOTHING
     RETURNING id`,
    [randomUUID(), email],
  )
  return { alreadySubscribed: result.rowCount === 0 }
}

export async function healthCheck() {
  const result = await query('SELECT now() AS time')
  return result.rows[0].time
}
