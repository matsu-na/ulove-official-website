import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import {
  EVENT,
  NEWS_CATEGORIES,
  news,
  guests,
  schedule,
  faqs,
  communityTopics,
  stats,
  timeline,
} from './seed.js'
import {
  createSession,
  findSessionUser,
  getDbPath,
  hashPassword,
  loadDb,
  publicUser,
  removeSession,
  saveDb,
  verifyPassword,
} from './store.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST_DIR = path.join(ROOT, 'dist')
const PORT = Number(process.env.PORT || 8787)
const HOST = process.env.HOST || '127.0.0.1'
const SESSION_COOKIE = 'yougu_session'

const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '256kb' }))
app.use('/api', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store')
  next()
})

const db = loadDb()

const CONTENT = {
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

const TOPIC_ART = {
  同人市集: { variant: 'sticker', accent: 'yellow' },
  找搭子: { variant: 'train', accent: 'sky' },
  痛包研究所: { variant: 'painbag', accent: 'coral' },
  舞台应援: { variant: 'sun', accent: 'violet' },
  社恐友好: { variant: 'guide', accent: 'lime' },
}

function text(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function email(value) {
  return text(value).toLowerCase()
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function fail(res, status, message) {
  return res.status(status).json({ error: message })
}

function route(handler) {
  return (req, res, next) => {
    try {
      const result = handler(req, res, next)
      if (result && typeof result.catch === 'function') result.catch(next)
    } catch (error) {
      next(error)
    }
  }
}

function parseCookies(header = '') {
  return header.split(';').reduce((cookies, pair) => {
    const index = pair.indexOf('=')
    if (index < 0) return cookies
    const key = pair.slice(0, index).trim()
    const value = pair.slice(index + 1).trim()
    if (key) cookies[key] = decodeURIComponent(value)
    return cookies
  }, {})
}

app.use((req, _res, next) => {
  const cookies = parseCookies(req.headers.cookie)
  req.sessionToken = cookies[SESSION_COOKIE] || null
  req.user = findSessionUser(db, req.sessionToken)
  next()
})

function setSessionCookie(res, token, remember) {
  const options = {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  }
  if (remember) options.maxAge = 1000 * 60 * 60 * 24 * 30
  res.cookie(SESSION_COOKIE, token, options)
}

function serializeComment(comment) {
  return {
    id: comment.id,
    author: comment.author,
    body: comment.body,
    createdAt: comment.createdAt,
  }
}

function serializePost(post, user) {
  return {
    id: post.id,
    author: post.author,
    authorId: post.authorId,
    role: post.role,
    topic: post.topic,
    createdAt: post.createdAt,
    title: post.title,
    body: post.body,
    art: post.art,
    likes: post.likes,
    likedByMe: user ? post.likedBy.includes(user.id) : false,
    savedByMe: user ? (user.savedPostIds || []).includes(post.id) : false,
    comments: (post.comments || []).map(serializeComment),
  }
}

function requireUser(req, res) {
  if (!req.user) {
    fail(res, 401, '请先登录后再操作')
    return null
  }
  return req.user
}

function findPost(id) {
  return db.posts.find((post) => post.id === id)
}

function sessionPayload(user) {
  return { user: publicUser(user) }
}

/* ---------------- content ---------------- */
app.get(
  '/api/content',
  route((_req, res) => {
    res.json(CONTENT)
  }),
)

app.get(
  '/api/news',
  route((_req, res) => {
    res.json({ categories: NEWS_CATEGORIES, articles: news })
  }),
)

app.get(
  '/api/news/:id',
  route((req, res) => {
    const article = news.find((item) => item.id === req.params.id)
    if (!article) return fail(res, 404, '没有找到这篇资讯')
    res.json({ article })
  }),
)

/* ---------------- auth ---------------- */
app.get(
  '/api/auth/me',
  route((req, res) => {
    res.json(sessionPayload(req.user))
  }),
)

app.post(
  '/api/auth/login',
  route((req, res) => {
    const emailValue = email(req.body?.email)
    const password = text(req.body?.password)
    const remember = req.body?.remember !== false
    if (!isEmail(emailValue) || !password) return fail(res, 400, '请输入邮箱和密码')

    const user = db.users.find((item) => item.email === emailValue)
    if (!user) return fail(res, 401, '没有找到这个邮箱，试试先创建一个账号')
    if (!verifyPassword(password, user.passwordHash)) return fail(res, 401, '密码不正确，再检查一下？')

    const { token } = createSession(db, user.id, remember)
    setSessionCookie(res, token, remember)
    res.json(sessionPayload(user))
  }),
)

app.post(
  '/api/auth/register',
  route((req, res) => {
    const nickname = text(req.body?.nickname)
    const emailValue = email(req.body?.email)
    const password = typeof req.body?.password === 'string' ? req.body.password : ''
    const remember = req.body?.remember !== false

    if (nickname.length < 2 || nickname.length > 20) return fail(res, 400, '昵称需要 2—20 个字')
    if (!isEmail(emailValue)) return fail(res, 400, '请输入有效的邮箱地址')
    if (password.length < 6) return fail(res, 400, '密码至少需要 6 位')
    if (db.users.some((user) => user.email === emailValue)) {
      return fail(res, 409, '这个邮箱已经加入山谷了，直接登录吧')
    }

    const user = {
      id: randomUUID(),
      nickname,
      email: emailValue,
      passwordHash: hashPassword(password),
      bio: '刚刚抵达山谷，正在寻找同频的人。',
      joinedAt: new Date().toISOString().slice(0, 10),
      savedPostIds: [],
    }
    db.users.push(user)
    saveDb()

    const { token } = createSession(db, user.id, remember)
    setSessionCookie(res, token, remember)
    res.status(201).json(sessionPayload(user))
  }),
)

app.post(
  '/api/auth/logout',
  route((req, res) => {
    removeSession(db, req.sessionToken)
    res.clearCookie(SESSION_COOKIE, { path: '/' })
    res.json({ ok: true })
  }),
)

app.patch(
  '/api/auth/profile',
  route((req, res) => {
    const user = requireUser(req, res)
    if (!user) return
    const nickname = text(req.body?.nickname)
    const bio = text(req.body?.bio)
    if (nickname) {
      if (nickname.length < 2 || nickname.length > 20) return fail(res, 400, '昵称需要 2—20 个字')
      user.nickname = nickname
    }
    if (typeof req.body?.bio === 'string') {
      if (bio.length > 120) return fail(res, 400, '个人简介不能超过 120 个字')
      user.bio = bio
    }
    saveDb()
    res.json(sessionPayload(user))
  }),
)

/* ---------------- community ---------------- */
app.get(
  '/api/community/posts',
  route((req, res) => {
    const user = req.user
    const topic = text(req.query.topic)
    const mine = req.query.mine === '1'
    const sort = req.query.sort === 'latest' ? 'latest' : 'recommend'
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 100))

    if (mine && !user) return fail(res, 401, '请先登录后再查看自己的帖子')

    let posts = [...db.posts]
    if (topic) posts = posts.filter((post) => post.topic === topic)
    if (mine) posts = posts.filter((post) => post.authorId === user.id)

    posts.sort((a, b) =>
      sort === 'latest'
        ? b.createdAt - a.createdAt
        : b.likes + b.comments.length * 3 - (a.likes + a.comments.length * 3),
    )

    res.json({
      posts: posts.slice(0, limit).map((post) => serializePost(post, user)),
      total: posts.length,
    })
  }),
)

app.post(
  '/api/community/posts',
  route((req, res) => {
    const user = requireUser(req, res)
    if (!user) return

    const title = text(req.body?.title)
    const body = text(req.body?.body)
    const topic = text(req.body?.topic) || communityTopics[0]?.name
    const topicNames = communityTopics.map((item) => item.name)

    if (title.length < 4 || title.length > 60) return fail(res, 400, '标题需要 4—60 个字')
    if (body.length < 10 || body.length > 500) return fail(res, 400, '正文需要 10—500 个字')
    if (!topicNames.includes(topic)) return fail(res, 400, '请选择一个有效的话题')

    const art = TOPIC_ART[topic] ?? { variant: 'star', accent: 'lime' }
    const post = {
      id: randomUUID(),
      authorId: user.id,
      author: user.nickname,
      role: '山谷居民',
      topic,
      createdAt: Date.now(),
      title,
      body,
      art: { ...art, label: `${topic.toUpperCase()} / NEW` },
      likes: 0,
      likedBy: [],
      comments: [],
    }
    db.posts.unshift(post)
    saveDb()
    res.status(201).json({ post: serializePost(post, user) })
  }),
)

app.post(
  '/api/community/posts/:id/like',
  route((req, res) => {
    const user = requireUser(req, res)
    if (!user) return
    const post = findPost(req.params.id)
    if (!post) return fail(res, 404, '这个帖子不存在')

    const index = post.likedBy.indexOf(user.id)
    if (index >= 0) {
      post.likedBy.splice(index, 1)
      post.likes = Math.max(0, post.likes - 1)
    } else {
      post.likedBy.push(user.id)
      post.likes += 1
    }
    saveDb()
    res.json({ post: serializePost(post, user) })
  }),
)

app.post(
  '/api/community/posts/:id/bookmark',
  route((req, res) => {
    const user = requireUser(req, res)
    if (!user) return
    const post = findPost(req.params.id)
    if (!post) return fail(res, 404, '这个帖子不存在')

    user.savedPostIds = user.savedPostIds || []
    const index = user.savedPostIds.indexOf(post.id)
    if (index >= 0) user.savedPostIds.splice(index, 1)
    else user.savedPostIds.push(post.id)
    saveDb()
    res.json({ post: serializePost(post, user), saved: user.savedPostIds.includes(post.id) })
  }),
)

app.post(
  '/api/community/posts/:id/comments',
  route((req, res) => {
    const user = requireUser(req, res)
    if (!user) return
    const post = findPost(req.params.id)
    if (!post) return fail(res, 404, '这个帖子不存在')

    const body = text(req.body?.body)
    if (body.length < 1 || body.length > 300) return fail(res, 400, '评论需要 1—300 个字')

    post.comments.push({
      id: randomUUID(),
      authorId: user.id,
      author: user.nickname,
      body,
      createdAt: Date.now(),
    })
    saveDb()
    res.status(201).json({ post: serializePost(post, user) })
  }),
)

/* ---------------- contact + newsletter ---------------- */
app.post(
  '/api/contact/messages',
  route((req, res) => {
    const name = text(req.body?.name)
    const emailValue = email(req.body?.email)
    const topic = text(req.body?.topic)
    const message = text(req.body?.message)
    const consent = req.body?.consent === true

    if (name.length < 2) return fail(res, 400, '请填写至少 2 个字的称呼')
    if (!isEmail(emailValue)) return fail(res, 400, '请检查邮箱格式')
    if (!topic) return fail(res, 400, '请选择咨询主题')
    if (message.length < 10 || message.length > 500) return fail(res, 400, '消息需要 10—500 个字')
    if (!consent) return fail(res, 400, '请先同意我们使用这些信息来回复你')

    const record = {
      id: randomUUID(),
      name,
      email: emailValue,
      topic,
      message,
      consent,
      createdAt: new Date().toISOString(),
    }
    db.messages.unshift(record)
    saveDb()
    res.status(201).json({ id: record.id, createdAt: record.createdAt, message: '消息已送达山谷' })
  }),
)

app.post(
  '/api/newsletter/subscriptions',
  route((req, res) => {
    const emailValue = email(req.body?.email)
    if (!isEmail(emailValue)) return fail(res, 400, '请输入有效的邮箱地址')
    const existing = db.subscriptions.find((item) => item.email === emailValue)
    if (existing) {
      return res.json({ subscribed: true, alreadySubscribed: true })
    }
    db.subscriptions.unshift({
      id: randomUUID(),
      email: emailValue,
      createdAt: new Date().toISOString(),
    })
    saveDb()
    res.status(201).json({ subscribed: true, alreadySubscribed: false })
  }),
)

/* ---------------- system ---------------- */
app.get(
  '/api/health',
  route((_req, res) => {
    res.json({
      ok: true,
      service: 'yougu-mock-api',
      storage: getDbPath(),
      time: new Date().toISOString(),
    })
  }),
)

app.use('/api', (_req, res) => {
  fail(res, 404, '接口不存在')
})

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(path.join(DIST_DIR, 'index.html'))
  })
}

app.use((error, _req, res, _next) => {
  console.error('[api]', error)
  if (res.headersSent) return
  res.status(500).json({ error: '服务器开小差了，请稍后再试' })
})

const server = app.listen(PORT, HOST, () => {
  console.log(`[yougu] mock API ready at http://${HOST}:${PORT}`)
  console.log(`[yougu] data file: ${getDbPath()}`)
  if (fs.existsSync(DIST_DIR)) {
    console.log(`[yougu] static build: http://${HOST}:${PORT}/`)
  }
})

function shutdown() {
  server.close(() => process.exit(0))
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
