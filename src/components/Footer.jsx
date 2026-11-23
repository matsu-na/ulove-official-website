import { useState } from 'react'
import { ArrowUpRight, Mail, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo, { StarMark } from './Logo.jsx'
import { useToast } from '../context/ToastContext.jsx'

const footerLinks = [
  {
    title: '探索',
    links: [
      { label: '首页', to: '/' },
      { label: '最新资讯', to: '/news' },
      { label: '关于有谷', to: '/about' },
      { label: '联系我们', to: '/contact' },
    ],
  },
  {
    title: '参与',
    links: [
      { label: '早鸟票', to: '/news/early-bird-ticket' },
      { label: '同人市集', to: '/news/doujin-market-list' },
      { label: '志愿者招募', to: '/news/volunteer-recruit' },
      { label: '山谷社区', to: '/community' },
    ],
  },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const { toast } = useToast()

  const subscribe = (event) => {
    event.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast('请输入一个有效的邮箱地址', 'error')
      return
    }
    toast('订阅成功，山谷的新消息会先找到你', 'success')
    setEmail('')
  }

  return (
    <footer className="site-footer">
      <div className="site-footer__top container">
        <div className="footer-brand">
          <Logo inverted />
          <p>把热爱聚成山谷。<br />下一次见面，在 2026 年的冬天。</p>
          <div className="footer-socials">
            <a href="https://weibo.com" target="_blank" rel="noreferrer">微博 <ArrowUpRight size={13} /></a>
            <a href="https://www.xiaohongshu.com" target="_blank" rel="noreferrer">小红书 <ArrowUpRight size={13} /></a>
            <a href="https://www.bilibili.com" target="_blank" rel="noreferrer">Bilibili <ArrowUpRight size={13} /></a>
          </div>
        </div>

        <div className="footer-links">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3>{group.title}</h3>
              {group.links.map((link) => (
                <Link key={link.to} to={link.to}>{link.label}</Link>
              ))}
            </div>
          ))}
          <div>
            <h3>找到我们</h3>
            <a href="mailto:hello@yougu-expo.com">hello@yougu-expo.com</a>
            <a href="tel:02166881219">021-6688-1219</a>
            <p>上海市青浦区崧泽大道 333 号<br />国家会展中心 5.2H / 6.2H</p>
          </div>
        </div>

        <div className="footer-subscribe">
          <div className="footer-subscribe__title">
            <Mail size={18} />
            <span>订阅山谷来信</span>
          </div>
          <p>每月一封，不错过开票、阵容与现场情报。</p>
          <form onSubmit={subscribe} className="subscribe-form">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your@email.com"
              aria-label="订阅邮箱"
            />
            <button type="submit" aria-label="订阅">
              <Send size={17} />
            </button>
          </form>
          <small>我们讨厌垃圾邮件。随时可以退订。</small>
        </div>
      </div>

      <div className="footer-marquee" aria-hidden="true">
        <div className="footer-marquee__track">
          <span>YOUGU EXPO</span>
          <StarMark />
          <span>SEE YOU IN THE VALLEY</span>
          <StarMark />
          <span>YOUGU EXPO</span>
          <StarMark />
          <span>SEE YOU IN THE VALLEY</span>
          <StarMark />
        </div>
      </div>

      <div className="site-footer__bottom container">
        <p>© 2026 有谷漫展 YOUGU EXPO. 保留所有权利。</p>
        <div>
          <a href="#top">隐私政策</a>
          <a href="#top">用户协议</a>
          <span>沪 ICP 备 2026001219 号</span>
        </div>
      </div>
    </footer>
  )
}
