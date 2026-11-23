import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import ArtCover from './ArtCover.jsx'

export default function NewsCard({ article, featured = false, className = '' }) {
  return (
    <Link
      to={`/news/${article.id}`}
      className={`news-card ${featured ? 'news-card--featured' : ''} ${className}`}
    >
      <div className="news-card__art">
        <ArtCover
          variant={article.cover.variant}
          label={article.cover.label}
          accent={article.cover.accent}
        />
        <span className="news-card__category">{article.category}</span>
      </div>
      <div className="news-card__body">
        <div className="news-card__meta">
          <span>{article.date}</span>
          <i />
          <span>{article.readTime} read</span>
        </div>
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
        <span className="news-card__more">
          阅读全文 <ArrowUpRight size={15} />
        </span>
      </div>
    </Link>
  )
}
