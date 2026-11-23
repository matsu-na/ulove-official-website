import express from 'express'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getContent, initializeDatabase, pool } from './db.js'
import {
  addComment,
  authenticate,
  createContactMessage,
  createPost,
  createSession,
  createUser,
  findSessionUser,
  findUserByEmail,
  getPostById,
  healthCheck,
  listPosts,
  postExists,
  removeSession,
  subscribeNewsletter,
  toggleBookmark,
  toggleLike,
  updateUser,
} from './store.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST_DIR = path.join(ROOT, 'dist')
const PORT = Number(process.env.PORT || 8787)
const HOST = process.env.HOST || '127.0.0.1'
const SESSION_COOKIE = 'yougu_session'

const TOPIC_ART = {
  同人市集: { variant: 'sticker', accent: 'yellow' },
  找搭子: { variant: 'train', accent: 'sky' },
  痛包研究所: { variant: 'painbag', accent: 'coral' },
  舞台应援: { variant: 'sun', accent: 'violet' },
  社恐友好: { variant: 'guide', accent: 'lime' },
}

const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '256kb' }))
app.use('/api', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store')
  next()
})

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
    try {
      if (key) cookies[key] = decodeURIComponent(value)
    } catch {
      cookies[key] = value
    }
    return cookies
  }, {})
}

app.use(
  route(async (req, _res, next) => {
    const cookies = parseCookies(req.headers.cookie)
    req.sessionToken = cookies[SESSION_COOKIE] || null
    req.user = await findSessionUser(req.sessionToken)
    next()
  }),
)

function setSessionCookie(res, token, remember) {
  const options = {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  }
  if (remember) options.maxAge = 1000 * 60 * 60 * 24 * 30
  res.cookie(SESSION_COOKIE, token, options)
}

function requireUser(req, res) {
  if (!req.user) {
    fail(res, 401, '请先登录后再操作')
    return null
  }
  return req.user
}

function sessionPayload(user) {
  return { user }
}

async function content() {
  return getContent()
}

/* ---------------- content ---------------- */
app.get(
  '/api/content',
  route(async (_req, res) => {
    res.json(await content())
  }),
)

app.get(
  '/api/news',
  route(async (_req, res) => {
    const data = await content()
    res.json({ categories: data.newsCategories, articles: data.news })
  }),
)

app.get(
  '/api/news/:id',
  route(async (req, res) => {
    const data = await content()
    const article = data.news?.find((item) => item.id === req.params.id)
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
  route(async (req, res) => {
    const emailValue = email(req.body?.email)
    const password = typeof req.body?.password === 'string' ? req.body.password : ''
    const remember = req.body?.remember !== false
    if (!isEmail(emailValue) || !password) return fail(res, 400, '请输入邮箱和密码')

    const existing = await findUserByEmail(emailValue)
    if (!existing) return fail(res, 401, '没有找到这个邮箱，试试先创建一个账号')

    const user = await authenticate(emailValue, password)
    if (!user) return fail(res, 401, '密码不正确，再检查一下？')

    const { token } = await createSession(user.id, remember)
    setSessionCookie(res, token, remember)
    res.json(sessionPayload(user))
  }),
)

app.post(
  '/api/auth/register',
  route(async (req, res) => {
    const nickname = text(req.body?.nickname)
    const emailValue = email(req.body?.email)
    const password = typeof req.body?.password === 'string' ? req.body.password : ''
    const remember = req.body?.remember !== false

    if (nickname.length < 2 || nickname.length > 20) return fail(res, 400, '昵称需要 2—20 个字')
    if (!isEmail(emailValue)) return fail(res, 400, '请输入有效的邮箱地址')
    if (password.length < 6 || password.length > 128) return fail(res, 400, '密码需要 6—128 位')
    if (await findUserByEmail(emailValue)) return fail(res, 409, '这个邮箱已经加入山谷了，直接登录吧')

    try {
      const user = await createUser({ nickname, email: emailValue, password })
      const { token } = await createSession(user.id, remember)
      setSessionCookie(res, token, remember)
      res.status(201).json(sessionPayload(user))
    } catch (error) {
      if (error.code === '23505') return fail(res, 409, '这个邮箱已经加入山谷了，直接登录吧')
      throw error
    }
  }),
)

app.post(
  '/api/auth/logout',
  route(async (req, res) => {
    await removeSession(req.sessionToken)
    res.clearCookie(SESSION_COOKIE, { path: '/' })
    res.json({ ok: true })
  }),
)

app.patch(
  '/api/auth/profile',
  route(async (req, res) => {
    const user = requireUser(req, res)
    if (!user) return
    const nickname = text(req.body?.nickname)
    const bio = text(req.body?.bio)
    if (nickname) {
      if (nickname.length < 2 || nickname.length > 20) return fail(res, 400, '昵称需要 2—20 个字')
    }
    if (typeof req.body?.bio === 'string' && bio.length > 120) {
      return fail(res, 400, '个人简介不能超过 120 个字')
    }
    const updated = await updateUser(user.id, {
      nickname: nickname || undefined,
      bio: typeof req.body?.bio === 'string' ? bio : undefined,
    })
    res.json(sessionPayload(updated))
  }),
)

/* ---------------- community ---------------- */
app.get(
  '/api/community/posts',
  route(async (req, res) => {
    const mine = req.query.mine === '1'
    if (mine && !req.user) return fail(res, 401, '请先登录后再查看自己的帖子')
    const data = await listPosts({
      userId: req.user?.id ?? null,
      topic: text(req.query.topic),
      mine,
      sort: req.query.sort === 'latest' ? 'latest' : 'recommend',
      limit: Math.min(100, Math.max(1, Number(req.query.limit) || 100)),
    })
    res.json(data)
  }),
)

app.post(
  '/api/community/posts',
  route(async (req, res) => {
    const user = requireUser(req, res)
    if (!user) return

    const title = text(req.body?.title)
    const body = text(req.body?.body)
    const data = await content()
    const topicNames = (data.communityTopics ?? []).map((item) => item.name)
    const topic = text(req.body?.topic) || topicNames[0]

    if (title.length < 4 || title.length > 60) return fail(res, 400, '标题需要 4—60 个字')
    if (body.length < 10 || body.length > 500) return fail(res, 400, '正文需要 10—500 个字')
    if (!topic || !topicNames.includes(topic)) return fail(res, 400, '请选择一个有效的话题')

    const art = TOPIC_ART[topic] ?? { variant: 'star', accent: 'lime' }
    const post = await createPost({
      user,
      title,
      body,
      topic,
      art: { ...art, label: `${topic.toUpperCase()} / NEW` },
    })
    res.status(201).json({ post })
  }),
)

app.post(
  '/api/community/posts/:id/like',
  route(async (req, res) => {
    const user = requireUser(req, res)
    if (!user) return
    if (!(await postExists(req.params.id))) return fail(res, 404, '这个帖子不存在')
    const post = await toggleLike(req.params.id, user)
    res.json({ post })
  }),
)

app.post(
  '/api/community/posts/:id/bookmark',
  route(async (req, res) => {
    const user = requireUser(req, res)
    if (!user) return
    if (!(await postExists(req.params.id))) return fail(res, 404, '这个帖子不存在')
    const data = await toggleBookmark(req.params.id, user)
    res.json(data)
  }),
)

app.post(
  '/api/community/posts/:id/comments',
  route(async (req, res) => {
    const user = requireUser(req, res)
    if (!user) return
    if (!(await postExists(req.params.id))) return fail(res, 404, '这个帖子不存在')
    const body = text(req.body?.body)
    if (body.length < 1 || body.length > 300) return fail(res, 400, '评论需要 1—300 个字')
    const post = await addComment(req.params.id, user, body)
    res.status(201).json({ post })
  }),
)

/* ---------------- contact + newsletter ---------------- */
app.post(
  '/api/contact/messages',
  route(async (req, res) => {
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

    const record = await createContactMessage({
      name,
      email: emailValue,
      topic,
      message,
      consent,
    })
    res.status(201).json({ ...record, message: '消息已送达山谷' })
  }),
)

app.post(
  '/api/newsletter/subscriptions',
  route(async (req, res) => {
    const emailValue = email(req.body?.email)
    if (!isEmail(emailValue)) return fail(res, 400, '请输入有效的邮箱地址')
    const data = await subscribeNewsletter(emailValue)
    res.status(data.alreadySubscribed ? 200 : 201).json({
      subscribed: true,
      alreadySubscribed: data.alreadySubscribed,
    })
  }),
)

/* ---------------- system ---------------- */
app.get(
  '/api/health',
  route(async (_req, res) => {
    const time = await healthCheck()
    res.json({
      ok: true,
      service: 'yougu-postgres-api',
      database: 'postgresql',
      time,
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
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ error: '请求数据不是有效的 JSON' })
  }
  if (error.code === '23505') {
    return res.status(409).json({ error: '这条记录已经存在' })
  }
  res.status(500).json({ error: '服务器开小差了，请稍后再试' })
})

try {
  await initializeDatabase()
  console.log('[yougu] PostgreSQL connected')
  const server = app.listen(PORT, HOST, () => {
    console.log(`[yougu] API ready at http://${HOST}:${PORT}`)
    if (fs.existsSync(DIST_DIR)) {
      console.log(`[yougu] static build: http://${HOST}:${PORT}/`)
    }
  })

  async function shutdown() {
    server.close(async () => {
      await pool.end().catch(() => {})
      process.exit(0)
    })
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
} catch (error) {
  console.error('[yougu] failed to start:', error)
  await pool.end().catch(() => {})
  process.exit(1)
}
