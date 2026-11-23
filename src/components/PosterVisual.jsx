import { useId } from 'react'
import { Sparkles } from 'lucide-react'

export default function PosterVisual() {
  const rawId = useId()
  const pathId = `orbit-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`

  return (
    <div className="poster-stage">
      <div className="poster-glow" aria-hidden="true" />
      <div className="poster-orbit" aria-hidden="true">
        <svg viewBox="0 0 180 180">
          <defs>
            <path id={pathId} d="M90,90 m-66,0 a66,66 0 1,1 132,0 a66,66 0 1,1 -132,0" />
          </defs>
          <text>
            <textPath href={`#${pathId}`} startOffset="0%">
              YOUGU COMIC CON · SEE YOU IN THE VALLEY · VOL.04 ·
            </textPath>
          </text>
        </svg>
        <span>✦</span>
      </div>

      <div className="poster">
        <div className="poster__top">
          <span>YOUGU EXPO</span>
          <span>VOL.04 / 2026</span>
        </div>

        <div className="poster__art">
          <svg viewBox="0 0 420 330" role="img" aria-label="有谷漫展主视觉眼睛插画" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="poster-dots" width="11" height="11" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#161616" />
              </pattern>
            </defs>
            <rect width="420" height="330" fill="#d8ff4f" />
            <rect width="420" height="330" fill="url(#poster-dots)" opacity="0.24" />
            <g transform="rotate(-6 210 162)">
              <path d="M28 164C95 63 333 45 394 164C329 270 94 278 28 164Z" fill="#f7f1e4" stroke="#161616" strokeWidth="7" />
              <circle cx="210" cy="164" r="71" fill="#161616" />
              <circle cx="210" cy="164" r="52" fill="#7a5cff" />
              <circle cx="210" cy="164" r="27" fill="#161616" />
              <circle cx="188" cy="141" r="16" fill="#f7f1e4" />
              <circle cx="232" cy="184" r="7" fill="#d8ff4f" />
              <path d="M132 88l9-26M177 76l4-29M238 75l-2-29M283 91l-9-27" stroke="#161616" strokeWidth="6" strokeLinecap="round" />
            </g>
            <g fill="#161616" fontFamily="Archivo Black, sans-serif">
              <text x="23" y="41" fontSize="13" letterSpacing="3">ORIGINAL KEY VISUAL</text>
              <text x="23" y="301" fontSize="23" letterSpacing="-0.5">THE VALLEY IS CALLING</text>
              <text x="23" y="318" fontSize="10" letterSpacing="3">ILLUSTRATION / AYU 2026</text>
            </g>
            <path d="M357 42l5 16 16 5-16 5-5 16-5-16-16-5 16-5 5-16Z" fill="#ff5b4d" stroke="#161616" strokeWidth="1.5" />
          </svg>
          <span className="poster__cn">把热爱，聚成山谷</span>
        </div>

        <div className="poster__bottom">
          <div>
            <span>2026.12.19—12.21</span>
            <span>上海 · 国家会展中心 5.2H / 6.2H</span>
          </div>
          <div className="poster__barcode" aria-hidden="true">
            {[3, 1, 5, 2, 4, 1, 3, 2, 5, 1, 4, 2, 3].map((width, index) => (
              <i key={index} style={{ width }} />
            ))}
          </div>
        </div>
      </div>

      <div className="poster-badge">
        <span>DEC</span>
        <strong>19</strong>
        <small>— 21</small>
      </div>

      <div className="poster-sticker">
        <Sparkles size={17} />
        <span>3 DAYS<br />OF LOVE</span>
      </div>

      <div className="poster-ticket">
        <span>ENTRY / 入口</span>
        <strong>山谷见</strong>
        <span>NO. 2026 · 04</span>
        <div className="poster-ticket__holes" aria-hidden="true">
          <i /><i /><i /><i /><i /><i />
        </div>
      </div>

      <div className="poster-note">
        <span className="poster-note__line" />
        <p>“在热爱的山谷里，<br />遇见同频的你。”</p>
        <span className="poster-note__star">✳</span>
      </div>
    </div>
  )
}
