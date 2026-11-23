import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock,
  Copy,
  Share2,
  Tag,
} from 'lucide-react'
import ArtCover from '../components/ArtCover.jsx'
import Reveal from '../components/Reveal.jsx'
import NewsCard from '../components/NewsCard.jsx'
import { useContent } from '../context/ContentContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function NewsDetail() {
  const { news } = useContent()
  const { id } = useParams()
  const article = news.find((item) => item.id === id)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  if (!article) {
    return (
      <section className="container empty-state empty-state--page">
        <span className="empty-state__mark">404</span>
        <h2>这封信好像寄丢了</h2>
        <p>没有找到这篇资讯，它可能已经搬到山谷的另一边。</p>
        <Link to="/news" className="btn btn--dark">返回资讯中心</Link>
      </section>
    )
  }

  const index = news.findIndex((item) => item.id === id)
  const next = news[(index + 1) % news.length]
  const related = news.filter((item) => item.id !== id && item.category === article.category).slice(0, 2)
  const fallbackRelated = news.filter((item) => item.id !== id).slice(0, 2)
  const relatedArticles = related.length ? related : fallbackRelated
  const sections = article.content.filter((block) => block.type === 'h2')

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast('链接已复制，去分享给同好吧', 'success')
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      toast('复制失败，请从地址栏手动复制', 'error')
    }
  }

  return (
    <article className="article-page">
      <div className="container article-breadcrumb">
        <Link to="/news"><ArrowLeft size={15} /> 返回资讯中心</Link>
        <span>/</span>
        <span>{article.category}</span>
      </div>

      <header className="container article-header">
        <div className="article-header__meta">
          <span className="article-category">{article.category}</span>
          <span><CalendarDays size={14} /> {article.date}</span>
          <span><Clock size={14} /> {article.readTime} 阅读</span>
        </div>
        <h1>{article.title}</h1>
        <p className="article-header__excerpt">{article.excerpt}</p>
        <div className="article-header__foot">
          <div className="article-author">
            <span className="article-author__avatar">谷</span>
            <div>
              <strong>{article.author}</strong>
              <small>有谷内容团队 · 2026</small>
            </div>
          </div>
          <div className="article-share">
            <span><Share2 size={15} /> 分享这篇</span>
            <button type="button" onClick={copyLink}>
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? '已复制' : '复制链接'}
            </button>
          </div>
        </div>
      </header>

      <Reveal className="container article-cover">
        <ArtCover
          variant={article.cover.variant}
          label={article.cover.label}
          accent={article.cover.accent}
        />
        <div className="article-cover__caption">
          <span>FIG. {String(index + 1).padStart(2, '0')}</span>
          <span>有谷漫展 2026 · 主视觉企划</span>
          <span>© YOUGU EXPO</span>
        </div>
      </Reveal>

      <div className="container article-layout">
        <aside className="article-aside">
          <div className="article-aside__sticky">
            <span className="article-aside__label">本文目录</span>
            {sections.map((section, sectionIndex) => (
              <a key={section.text} href={`#section-${sectionIndex}`}>
                0{sectionIndex + 1} / {section.text}
              </a>
            ))}
            <div className="article-aside__tags">
              <span>标签</span>
              {article.tags.map((tag) => (
                <em key={tag}><Tag size={11} /> {tag}</em>
              ))}
            </div>
            <button type="button" className="article-aside__share" onClick={copyLink}>
              <Share2 size={16} /> 分享这篇文章
            </button>
          </div>
        </aside>

        <div className="article-body">
          {article.content.map((block, blockIndex) => {
            if (block.type === 'h2') {
              const sectionIndex = sections.findIndex((item) => item.text === block.text)
              return (
                <h2 key={block.text} id={`section-${sectionIndex}`}>
                  <span>0{sectionIndex + 1}</span>
                  {block.text}
                </h2>
              )
            }
            if (block.type === 'quote') {
              return (
                <blockquote key={blockIndex}>
                  <span>“</span>
                  {block.text}
                </blockquote>
              )
            }
            if (block.type === 'list') {
              return (
                <ul key={blockIndex}>
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )
            }
            return <p key={blockIndex}>{block.text}</p>
          })}

          <div className="article-signoff">
            <span>— 有谷漫展内容团队</span>
            <div className="article-signoff__stamp">
              <span>YOUGU</span>
              <strong>见</strong>
              <span>2026</span>
            </div>
          </div>

          <Link to={`/news/${next.id}`} className="article-next">
            <span>下一篇 / NEXT STORY</span>
            <h3>{next.title}</h3>
            <span className="round-arrow"><ArrowUpRight size={20} /></span>
          </Link>
        </div>
      </div>

      <section className="container article-related">
        <div className="article-related__head">
          <h2>继续读一点</h2>
          <Link to="/news" className="text-link">全部资讯 <ArrowUpRight size={15} /></Link>
        </div>
        <div className="news-grid news-grid--two">
          {relatedArticles.map((item) => (
            <NewsCard key={item.id} article={item} />
          ))}
        </div>
      </section>
    </article>
  )
}
