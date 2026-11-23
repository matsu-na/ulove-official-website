import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { countdownTo } from '../utils.js'
import { useContent } from '../context/ContentContext.jsx'

export default function Countdown() {
  const { event } = useContent()
  const [time, setTime] = useState(() => countdownTo(event.target))

  useEffect(() => {
    setTime(countdownTo(event.target))
    const timer = window.setInterval(() => setTime(countdownTo(event.target)), 1000)
    return () => window.clearInterval(timer)
  }, [event.target])

  const parts = [
    { value: time.days, label: 'DAYS', cn: '天' },
    { value: time.hours, label: 'HOURS', cn: '时' },
    { value: time.minutes, label: 'MINS', cn: '分' },
    { value: time.seconds, label: 'SECS', cn: '秒' },
  ]

  return (
    <div className="countdown">
      <div className="countdown__intro">
        <span className="eyebrow">
          <i />
          COUNTDOWN TO THE VALLEY
        </span>
        <p>距离山谷亮灯还有</p>
      </div>
      <div className="countdown__clock" aria-live="off">
        {parts.map((part, index) => (
          <div className="countdown__unit" key={part.label}>
            <div className="countdown__value">
              <strong>{String(part.value).padStart(2, '0')}</strong>
              <span>{part.cn}</span>
            </div>
            <small>{part.label}</small>
            {index < parts.length - 1 && <span className="countdown__colon">:</span>}
          </div>
        ))}
      </div>
      <Link to="/news/early-bird-ticket" className="countdown__cta">
        提醒我开票
        <ArrowRight size={18} />
      </Link>
    </div>
  )
}
