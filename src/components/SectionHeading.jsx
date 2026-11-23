export default function SectionHeading({ kicker, title, description, action, light = false, className = '' }) {
  return (
    <div className={`section-heading ${light ? 'section-heading--light' : ''} ${className}`}>
      <div className="section-heading__top">
        <span className="eyebrow">
          <i />
          {kicker}
        </span>
        {action && <div className="section-heading__action">{action}</div>}
      </div>
      <div className="section-heading__body">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  )
}
