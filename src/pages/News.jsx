import { useMemo, useState } from 'react'
import { ArrowUpRight, Mail, Search, SlidersHorizontal, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import ArtCover from '../components/ArtCover.jsx'
import NewsCard from '../components/NewsCard.jsx'
import Reveal from '../components/Reveal.jsx'
import { NEWS_CATEGORIES, news } from '../data.js'
import { useToast } from '../context/ToastContext.jsx'

export default function News() {
  const [category, setCategory] = useState('全部')
  const [query, setQuery] = useState('')
  const [email, setEmail] = useState('')
  const { toast } = useToast()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return news.filter((article) => {
      const inCategory = category === '全部' || article.category === category
      const inSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.tags.some((tag) => tag.toLowerCase().includes(q))
      return inCategory && inSearch
    })
  }, [category, query])

  const showFeature = category === '全部' && !query.trim()
  const featured = news.find((article) => article.featured)
  const list = showFeature ? filtered.filter((article) => !article.featured) : filtered

  const resetFilters = () => {
    setCategory('全部')
    setQuery('')
  }

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
    <div className="news-page">
      <section className="page-hero news-hero">
        <div className="container page-hero__inner">
          <div>
            <span className="eyebrow"><i /> NEWSROOM / 山谷情报站</span>
            <h1>所有关于山谷的<br /><span className="serif-accent">消息</span>，都在这里。</h1>
            <p>从一张海报到一份完整攻略。把重要的、琐碎的、还没被发现的，都讲给你听。</p>
          </div>
          <div className="news-hero__card">
            <span className="news-hero__card-label">LIVE UPDATE</span>
            <div className="news-hero__card-number">08</div>
            <span>篇最新情报</span>
            <div className="news-hero__card-line">
              <i />
              <span>更新于 2026.11.20</span>
            </div>
            <StarMarkSmall />
          </div>
        </div>
      </section>

      <section className="container news-controls">
        <div className="filter-row" role="tablist" aria-label="资讯分类">
          {NEWS_CATEGORIES.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={category === item}
              className={`filter-chip ${category === item ? 'is-active' : ''}`}
              onClick={() => {
                setCategory(item)
                setQuery('')
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="search-box">
          <Search size={18} />
          <input
            type="search"
            placeholder="搜索资讯 / 关键词"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              if (event.target.value.trim()) setCategory('全部')
            }}
            aria-label="搜索资讯"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="清空搜索">
              <X size={16} />
            </button>
          )}
        </label>
      </section>

      <div className="container news-results-head">
        <span><SlidersHorizontal size={14} /> 共 {filtered.length} 条结果</span>
        {(category !== '全部' || query) && (
          <button type="button" onClick={resetFilters}>清除筛选 ×</button>
        )}
      </div>

      <section className="container news-content">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__mark">?</span>
            <h2>这条山谷小径还没有消息</h2>
            <p>试试别的关键词或分类，或者回到全部资讯看看。</p>
            <button type="button" className="btn btn--dark" onClick={resetFilters}>查看全部资讯</button>
          </div>
        ) : (
          <>
            {showFeature && featured && (
              <Reveal>
                <Link to={`/news/${featured.id}`} className="news-feature">
                  <div className="news-feature__art">
                    <ArtCover
                      variant={featured.cover.variant}
                      label={featured.cover.label}
                      accent={featured.cover.accent}
                    />
                    <span className="news-feature__badge">FEATURED / 头条</span>
                  </div>
                  <div className="news-feature__body">
                    <div className="news-card__meta">
                      <span>{featured.category}</span>
                      <i />
                      <span>{featured.date}</span>
                      <i />
                      <span>{featured.readTime} read</span>
                    </div>
                    <h2>{featured.title}</h2>
                    <p>{featured.excerpt}</p>
                    <div className="news-feature__foot">
                      <div className="news-feature__author">
                        <span>编</span>
                        <div>
                          <strong>{featured.author}</strong>
                          <small>有谷内容团队</small>
                        </div>
                      </div>
                      <span className="round-arrow"><ArrowUpRight size={20} /></span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            )}

            {list.length > 0 && (
              <div className="news-grid">
                {list.map((article, index) => (
                  <Reveal key={article.id} delay={(index % 3) * 70}>
                    <NewsCard article={article} />
                  </Reveal>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <section className="container newsletter-cta">
        <div className="newsletter-cta__icon"><Mail size={26} /></div>
        <div className="newsletter-cta__copy">
          <span className="eyebrow"><i /> VALLEY LETTER</span>
          <h2>把山谷来信，放进你的收件箱。</h2>
          <p>每月一封，只有真正重要的开票、阵容与现场情报。</p>
        </div>
        <form onSubmit={subscribe} className="newsletter-cta__form">
          <input
            type="email"
            placeholder="输入你的邮箱"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-label="邮箱地址"
          />
          <button type="submit" className="btn btn--dark">订阅来信 <ArrowUpRight size={16} /></button>
        </form>
      </section>

      <section className="container press-strip">
        <div>
          <strong>媒体与商务联络</strong>
          <p>采访申请、品牌合作、场地与票务咨询，欢迎来信。</p>
        </div>
        <a href="mailto:press@yougu-expo.cn" className="text-link">press@yougu-expo.cn <ArrowUpRight size={16} /></a>
      </section>
    </div>
  )
}

function StarMarkSmall() {
  return (
    <svg className="news-hero__star" viewBox="0 0 40 40" aria-hidden="true">
      <path d="M20 1c1.6 11.9 6.3 17 19 19-12.7 2-17.4 7.1-19 19-1.6-11.9-6.3-17-19-19C13.7 18 18.4 12.9 20 1Z" fill="currentColor" />
    </svg>
  )
}
