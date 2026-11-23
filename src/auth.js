const USER_KEY = 'yougu_users_v1'
const SESSION_KEY = 'yougu_session_v1'

const DEMO_USER = {
  nickname: '谷粒Demo',
  email: 'demo@yougu.com',
  password: 'yougu2026',
  bio: '在山谷里收集每一次心动。',
  joinedAt: '2026-09-18',
}

function readUsers() {
  try {
    const stored = JSON.parse(localStorage.getItem(USER_KEY))
    if (Array.isArray(stored)) {
      const users = stored.filter((user) => user && user.email && user.password)
      if (!users.some((user) => user.email === DEMO_USER.email)) users.unshift(DEMO_USER)
      return users
    }
  } catch {
    // Fall through to the seeded demo account.
  }
  return [DEMO_USER]
}

function readSession(users) {
  try {
    const email = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY)
    return users.find((user) => user.email === email) ?? null
  } catch {
    return null
  }
}

export function createAuthStore() {
  let users = readUsers()
  let currentUser = readSession(users)
  const listeners = new Set()

  const emit = () => {
    listeners.forEach((listener) => listener())
  }

  const persistUsers = () => {
    localStorage.setItem(USER_KEY, JSON.stringify(users))
  }

  const persistSession = (email, remember = true) => {
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    if (!email) return
    if (remember) localStorage.setItem(SESSION_KEY, email)
    else sessionStorage.setItem(SESSION_KEY, email)
  }

  return {
    get users() {
      return users
    },
    get currentUser() {
      return currentUser
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    login({ email, password, remember = true }) {
      const normalizedEmail = email.trim().toLowerCase()
      const found = users.find((user) => user.email.toLowerCase() === normalizedEmail)
      if (!found) throw new Error('没有找到这个邮箱，试试先创建一个账号')
      if (found.password !== password) throw new Error('密码不正确，再检查一下？')
      currentUser = found
      persistSession(found.email, remember)
      emit()
      return found
    },
    register({ nickname, email, password }) {
      const normalizedEmail = email.trim().toLowerCase()
      if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
        throw new Error('这个邮箱已经加入山谷了，直接登录吧')
      }
      if (password.length < 6) throw new Error('密码至少需要 6 位')
      const user = {
        nickname: nickname.trim(),
        email: normalizedEmail,
        password,
        bio: '刚刚抵达山谷，正在寻找同频的人。',
        joinedAt: new Date().toISOString().slice(0, 10),
      }
      users = [...users, user]
      currentUser = user
      persistUsers()
      persistSession(user.email, true)
      emit()
      return user
    },
    updateProfile(patch) {
      if (!currentUser) return
      const updated = { ...currentUser, ...patch }
      users = users.map((user) => (user.email === currentUser.email ? updated : user))
      currentUser = updated
      persistUsers()
      emit()
      return updated
    },
    logout() {
      currentUser = null
      persistSession(null)
      emit()
    },
  }
}

export const authStore = createAuthStore()
