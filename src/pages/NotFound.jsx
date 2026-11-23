import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { StarMark } from '../components/Logo.jsx'

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="not-found__grid" aria-hidden="true" />
      <div className="container not-found__inner">
        <span className="eyebrow"><i /> 404 / LOST IN THE VALLEY</span>
        <h1>你走到了<br />山谷的<span>背面</span>。</h1>
        <p>这里还没有路。也许是一场偶遇，也许只是迷路了。要不要回到有灯的地方？</p>
        <div className="not-found__actions">
          <Link to="/" className="btn btn--dark btn--lg"><ArrowLeft size={17} /> 回到首页</Link>
          <Link to="/news" className="btn btn--ghost btn--lg">看看最新情报 <ArrowUpRight size={17} /></Link>
        </div>
        <StarMark className="not-found__star" />
        <span className="not-found__code">404</span>
      </div>
    </section>
  )
}
