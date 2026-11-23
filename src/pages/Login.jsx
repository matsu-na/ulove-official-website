import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  User,
} from 'lucide-react'
import ArtCover from '../components/ArtCover.jsx'
import { StarMark } from '../components/Logo.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { getAvatarTone, getInitials } from '../utils.js'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [form, setForm] = useState({ nickname: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { user, login, register, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/community'
  const intent = location.state?.intent

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: '' }))
    setFormError('')
  }

  const switchMode = (next) => {
    setMode(next)
    setErrors({})
    setFormError('')
  }

  const validate = () => {
    const next = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = '请输入有效的邮箱地址'
    if (!form.password) next.password = '请输入密码'
    if (mode === 'register') {
      if (form.nickname.trim().length < 2) next.nickname = '昵称至少需要 2 个字'
      if (form.password.length < 6) next.password = '密码至少需要 6 位'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async (event) => {
    event.preventDefault()
    setFormError('')
    if (submitting || !validate()) return
    setSubmitting(true)
    try {
      if (mode === 'login') {
        const loggedIn = await login({ email: form.email, password: form.password, remember })
        toast(`欢迎回到山谷，${loggedIn.nickname}`, 'success')
      } else {
        const created = await register({ ...form, remember })
        toast(`欢迎抵达山谷，${created.nickname}`, 'success')
      }
      navigate(from, { replace: true })
    } catch (error) {
      setFormError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const fillDemo = () => {
    setForm({ nickname: '', email: 'demo@yougu.com', password: 'yougu2026' })
    setErrors({})
    setFormError('')
    toast('演示账号已填入，点击登录即可进入', 'default')
  }

  if (user) {
    return (
      <div className="auth-page auth-page--member">
        <div className="auth-visual">
          <div className="auth-visual__grid" aria-hidden="true" />
          <div className="auth-visual__content">
            <span className="eyebrow eyebrow--light"><i /> VALLEY ACCESS / 2026</span>
            <h1>你已经在<br />山谷里了。</h1>
            <p>不用再登录一次。回到社区，继续看看大家在聊什么。</p>
            <div className="auth-member">
              <span className={`avatar avatar--xl avatar--${getAvatarTone(user.nickname)}`}>
                {getInitials(user.nickname)}
              </span>
              <div>
                <span>WELCOME BACK</span>
                <strong>{user.nickname}</strong>
                <p>{user.email}</p>
              </div>
            </div>
            <div className="auth-visual__actions">
              <Link to="/community" className="btn btn--lime btn--lg">进入社区 <ArrowUpRight size={18} /></Link>
              <button type="button" className="btn btn--ghost-light btn--lg" onClick={async () => { await logout(); toast('已退出登录', 'default') }}>
                切换账号
              </button>
            </div>
          </div>
        </div>
        <div className="auth-panel">
          <div className="auth-panel__inner auth-panel__inner--welcome">
            <span className="auth-welcome__star"><StarMark /></span>
            <span className="eyebrow"><i /> YOUR PASS IS ACTIVE</span>
            <h2>山谷通行证<br />正在生效。</h2>
            <p>你的帖子、收藏和点赞都好好保存在这台设备上。换一台设备登录，会是一段新的旅程。</p>
            <Link to="/community" className="btn btn--dark btn--block">去社区看看 <ArrowUpRight size={16} /></Link>
            <Link to="/" className="auth-back"><ArrowLeft size={15} /> 回到首页</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual__grid" aria-hidden="true" />
        <Link to="/" className="auth-visual__logo">
          <span className="auth-visual__logo-mark"><StarMark /></span>
          <span>有谷漫展 <small>YOUGU EXPO</small></span>
        </Link>

        <div className="auth-visual__content">
          <span className="eyebrow eyebrow--light"><i /> VALLEY ACCESS / 2026</span>
          <h1>欢迎回到<br /><span>山谷。</span></h1>
          <p>这里不要求你外向、合群，或者立刻交到朋友。先找到一个舒服的位置，慢慢来。</p>

          <div className="auth-poster">
            <ArtCover variant="eye" label="MEMBER ONLY" accent="lime" />
            <div className="auth-poster__strip">
              <span>12.19 — 12.21</span>
              <span>SHANGHAI</span>
              <span>VOL.04</span>
            </div>
            <span className="auth-poster__sticker">山谷<br />居民</span>
          </div>

          <div className="auth-visual__foot">
            <div><strong>12,000+</strong><span>同好在等你</span></div>
            <div><strong>24/7</strong><span>山谷不打烊</span></div>
            <div className="auth-visual__online"><i /> 2,048 人在线</div>
          </div>
        </div>
        <span className="auth-visual__vertical">SAME VALLEY · SAME FREQUENCY ·</span>
      </div>

      <div className="auth-panel">
        <div className="auth-panel__inner">
          <div className="auth-panel__top">
            <Link to="/" className="auth-back"><ArrowLeft size={15} /> 回到首页</Link>
            <span>安全连接 / SSL</span>
          </div>

          <div className="auth-heading">
            <span className="eyebrow"><i /> {mode === 'login' ? 'WELCOME BACK' : 'NEW ARRIVAL'}</span>
            <h2>{mode === 'login' ? '登录山谷' : '加入山谷'}</h2>
            <p>{mode === 'login' ? '用你的邮箱和密码，回到同好之间。' : '创建一个账号，领取属于你的山谷通行证。'}</p>
          </div>

          {intent && (
            <div className="auth-intent">
              <Lock size={15} />
              登录后即可{intent}
            </div>
          )}

          <div className="auth-tabs" role="tablist" aria-label="登录或注册">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              className={mode === 'login' ? 'is-active' : ''}
              onClick={() => switchMode('login')}
            >
              登录
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              className={mode === 'register' ? 'is-active' : ''}
              onClick={() => switchMode('register')}
            >
              注册
            </button>
          </div>

          {formError && <div className="auth-error" role="alert">{formError}</div>}

          <form onSubmit={submit} className="auth-form" noValidate>
            {mode === 'register' && (
              <label className={`field ${errors.nickname ? 'has-error' : ''}`}>
                <span>你的昵称<i>*</i></span>
                <div className="input-with-icon">
                  <User size={17} />
                  <input
                    type="text"
                    value={form.nickname}
                    onChange={(event) => update('nickname', event.target.value)}
                    placeholder="大家会这样称呼你"
                    autoComplete="nickname"
                    aria-invalid={Boolean(errors.nickname)}
                  />
                </div>
                {errors.nickname && <small>{errors.nickname}</small>}
              </label>
            )}

            <label className={`field ${errors.email ? 'has-error' : ''}`}>
              <span>邮箱地址<i>*</i></span>
              <div className="input-with-icon">
                <Mail size={17} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => update('email', event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                />
              </div>
              {errors.email && <small>{errors.email}</small>}
            </label>

            <label className={`field ${errors.password ? 'has-error' : ''}`}>
              <span>密码<i>*</i></span>
              <div className="input-with-icon">
                <Lock size={17} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) => update('password', event.target.value)}
                  placeholder={mode === 'register' ? '至少 6 位' : '输入你的密码'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  aria-invalid={Boolean(errors.password)}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? '隐藏密码' : '显示密码'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <small>{errors.password}</small>}
            </label>

            {mode === 'login' && (
              <div className="auth-form__between">
                <label className="remember-check">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                  />
                  <span><span className="remember-check__box" /></span>
                  记住我
                </label>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => toast('演示站点暂不提供找回密码服务，可使用演示账号登录', 'default')}
                >
                  忘记密码？
                </button>
              </div>
            )}

            <button type="submit" className="btn btn--dark btn--block btn--lg auth-submit" disabled={submitting}>
              {submitting ? '连接山谷中…' : mode === 'login' ? '登录' : '创建账号'}
              {!submitting && <ArrowUpRight size={18} />}
            </button>

            {mode === 'register' && (
              <p className="auth-terms">
                注册即表示你同意《用户协议》与《隐私政策》，并愿意遵守《山谷社区公约》。
              </p>
            )}
          </form>

          {mode === 'login' && (
            <div className="demo-card">
              <div className="demo-card__head">
                <Sparkles size={15} />
                <strong>只是想看看？</strong>
              </div>
              <p>使用演示账号快速进入。登录状态保存在安全 Cookie 中，社区数据存储在演示数据库。</p>
              <div className="demo-card__row">
                <code>demo@yougu.com</code>
                <code>yougu2026</code>
                <button type="button" onClick={fillDemo}>填入账号</button>
              </div>
            </div>
          )}

          <div className="auth-switch">
            {mode === 'login' ? (
              <p>还没有通行证？<button type="button" onClick={() => switchMode('register')}>创建一个账号 <ArrowUpRight size={13} /></button></p>
            ) : (
              <p>已经来过山谷？<button type="button" onClick={() => switchMode('login')}>直接登录 <ArrowUpRight size={13} /></button></p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
