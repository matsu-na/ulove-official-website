import { useEffect, useRef, useState } from 'react'
import { Menu, Ticket, X, LogOut, ChevronDown } from 'lucide-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getAvatarTone, getInitials } from '../utils.js'

const links = [
  { to: '/', label: '首页', end: true },
  { to: '/news', label: '资讯' },
  { to: '/about', label: '关于我们' },
  { to: '/contact', label: '联系我们' },
  { to: '/community', label: '社区' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const { user, loading, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const menuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setUserMenu(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setUserMenu(false)
    }
    document.addEventListener('pointerdown', onClick)
    return () => document.removeEventListener('pointerdown', onClick)
  }, [])

  const handleLogout = async () => {
    setUserMenu(false)
    await logout()
    navigate('/')
  }

  return (
    <>
      <div className="announce">
        <div className="announce__inner">
          <span className="announce__live">
            <i />
            NEWS
          </span>
          <p>早鸟票 11.28 20:00 开售 · 限量 2026 套</p>
          <Link to="/news/early-bird-ticket" className="announce__link">
            查看详情 <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__inner">
          <Logo />

          <nav className="navbar__links" aria-label="主导航">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar__actions">
            <Link to="/news/early-bird-ticket" className="nav-ticket">
              <Ticket size={15} strokeWidth={2.4} />
              购票
            </Link>

            {loading ? (
              <span className="nav-auth-loading" aria-label="正在加载登录状态">
                <span />
              </span>
            ) : user ? (
              <div className="user-menu" ref={menuRef}>
                <button
                  type="button"
                  className="user-chip"
                  onClick={() => setUserMenu((value) => !value)}
                  aria-expanded={userMenu}
                >
                  <span className={`avatar avatar--sm avatar--${getAvatarTone(user.nickname)}`}>
                    {getInitials(user.nickname)}
                  </span>
                  <span className="user-chip__name">{user.nickname}</span>
                  <ChevronDown size={14} className={userMenu ? 'rotate' : ''} />
                </button>
                {userMenu && (
                  <div className="user-dropdown">
                    <div className="user-dropdown__head">
                      <strong>{user.nickname}</strong>
                      <span>{user.email}</span>
                    </div>
                    <Link to="/community">进入社区</Link>
                    <Link to="/community#profile">我的主页</Link>
                    <button type="button" onClick={handleLogout}>
                      <LogOut size={14} /> 退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn--dark btn--sm nav-login">
                登录社区
                <span className="btn__dot" />
              </Link>
            )}

            <button
              type="button"
              className="menu-toggle"
              aria-label={open ? '关闭菜单' : '打开菜单'}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="mobile-menu__inner">
          <span className="mobile-menu__eyebrow">YOUGU EXPO / VOL.04</span>
          <nav aria-label="移动导航">
            {links.map((link, index) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `mobile-link ${isActive ? 'is-active' : ''}`}
                style={{ transitionDelay: `${index * 40}ms` }}
              >
                <span>0{index + 1}</span>
                {link.label}
                <span className="mobile-link__arrow">↗</span>
              </NavLink>
            ))}
          </nav>
          <div className="mobile-menu__footer">
            <p>2026.12.19 — 12.21<br />上海 · 国家会展中心</p>
            {user ? (
              <button type="button" className="btn btn--lime btn--block" onClick={handleLogout}>
                退出 {user.nickname}
              </button>
            ) : (
              <Link to="/login" className="btn btn--lime btn--block">
                登录 / 加入社区
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
