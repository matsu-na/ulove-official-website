import { Link } from 'react-router-dom'

export function StarMark({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <path
        d="M20 1c1.6 11.9 6.3 17 19 19-12.7 2-17.4 7.1-19 19-1.6-11.9-6.3-17-19-19C13.7 18 18.4 12.9 20 1Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Logo({ inverted = false, compact = false }) {
  return (
    <Link to="/" className={`brand ${inverted ? 'brand--inverted' : ''}`} aria-label="有谷漫展首页">
      <span className="brand__mark">
        <StarMark className="brand__star" />
        <span className="brand__letter">Y</span>
      </span>
      <span className="brand__type">
        <strong>有谷漫展</strong>
        {!compact && <span>YOUGU EXPO</span>}
      </span>
    </Link>
  )
}
