import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CarFront,
  Gamepad2,
  Heart,
  MapPin,
  MessageCircle,
  Mic2,
  MoonStar,
  MoveDown,
  Palette,
  Sparkles,
  Ticket,
  Users,
} from 'lucide-react'
import PosterVisual from '../components/PosterVisual.jsx'
import Countdown from '../components/Countdown.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import Reveal from '../components/Reveal.jsx'
import NewsCard from '../components/NewsCard.jsx'
import { StarMark } from '../components/Logo.jsx'
import { api } from '../api.js'
import { useContent } from '../context/ContentContext.jsx'
import { formatRelativeTime } from '../utils.js'

const tickerItems = ['同人市集', '声优舞台', '原画特展', '夜场 LIVE', '痛车巡游', '独立游戏', '谷子交换', '创作者大会']

const highlights = [
  {
    key: 'art',
    className: 'bento--art',
    kind: 'dark',
    index: '01',
    icon: Palette,
    en: 'ORIGINAL ART',
    title: '原画 & 特别展',
    text: '50+ 幅主视觉与原画手稿，第一次完整展出创作过程。走进分镜背后的房间。',
    tag: '5.2H · A 区',
  },
  {
    key: 'market',
    className: 'bento--market',
    kind: 'lime',
    index: '02',
    icon: BookOpen,
    en: 'DOUJIN MARKET',
    title: '同人市集',
    text: '320 个摊位，从第一本同人志到最后一枚手作徽章。',
    tag: '320 摊主',
  },
  {
    key: 'stage',
    className: 'bento--stage',
    kind: 'violet',
    index: '03',
    icon: Mic2,
    en: 'MAIN STAGE',
    title: '声优 & 创作者舞台',
    text: '48 场对谈、分享与签售，把喜欢的人请到你面前。',
    tag: '3 天不断电',
  },
  {
    key: 'cars',
    className: 'bento--cars',
    kind: 'yellow',
    index: '04',
    icon: CarFront,
    en: 'ITASHA ZONE',
    title: '痛车 & 谷子交换',
    text: '北广场的移动画布，和一张桌子上的以物换心。',
    tag: '北广场',
  },
  {
    key: 'live',
    className: 'bento--live',
    kind: 'coral',
    index: '05',
    icon: MoonStar,
    en: 'NIGHT LIVE',
    title: '夜场 Live「星屑回响」',
    text: '当展馆暗下来，音乐把陌生人变成同一片星海。12.20 晚上，只此一场。',
    tag: '限量 1,500 席',
  },
  {
    key: 'game',
    className: 'bento--game',
    kind: 'sky',
    index: '06',
    icon: Gamepad2,
    en: 'INDIE GAME',
    title: '独立游戏 & 互动区',
    text: '30 款未上线新作试玩，和开发者聊一句“这里为什么这样设计”。',
    tag: '试玩 30 款',
  },
]

export default function Home() {
  const { event, news, guests, schedule, stats } = useContent()
  const [activeDay, setActiveDay] = useState(0)
  const [communityPreview, setCommunityPreview] = useState([])
  const day = schedule[activeDay]
  const expected = stats.find((item) => item.label === '预计同好') ?? stats[stats.length - 1]

  useEffect(() => {
    let active = true
    api
      .get('/community/posts?sort=recommend&limit=2')
      .then((data) => {
        if (active) setCommunityPreview(data.posts)
      })
      .catch(() => {
        if (active) setCommunityPreview([])
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <>
      <section className="hero" id="top">
        <div className="hero__grid" aria-hidden="true" />
        <div className="hero__outline-word" aria-hidden="true">YOUGU</div>
        <div className="hero__sun" aria-hidden="true" />
        <div className="container hero__inner">
          <div className="hero__copy">
            <Reveal className="hero__kicker">
              <span className="hero__edition">2026 · 第四届</span>
              <span>YOUGU COMIC CON / SHANGHAI</span>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="hero__title">
                把热爱
                <br />
                <span className="hero__title-line">
                  聚成<em>山谷</em>
                  <StarMark className="hero__title-star" />
                </span>
              </h1>
            </Reveal>

            <Reveal delay={160} className="hero__lead-wrap">
              <p className="hero__lead">
                一个关于漫画、声音、游戏与同好的冬日聚会。
                <br />
                12 月的第三个周末，把喜欢的人和事，都放进同一座山谷。
              </p>
            </Reveal>

            <Reveal delay={230} className="hero__actions">
              <Link to="/news/early-bird-ticket" className="btn btn--dark btn--lg">
                <Ticket size={18} />
                预约入场
                <ArrowUpRight size={18} />
              </Link>
              <a href="#highlights" className="btn btn--ghost btn--lg">
                探索本届漫展
                <ArrowRight size={18} />
              </a>
            </Reveal>

            <Reveal delay={300} className="hero__meta">
              <div>
                <CalendarDays size={18} />
                <span><small>DATE</small>{event.dateShort}</span>
              </div>
              <div>
                <MapPin size={18} />
                <span><small>VENUE</small>{event.venue}</span>
              </div>
              <div>
                <Users size={18} />
                <span><small>EXPECTED</small>{expected?.value}{expected?.unit} 同好</span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={180} className="hero__visual">
            <PosterVisual />
          </Reveal>
        </div>

        <div className="hero__scroll" aria-hidden="true">
          <MoveDown size={16} />
          <span>SCROLL TO EXPLORE</span>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <span key={index}>
              {item}
              <StarMark />
            </span>
          ))}
        </div>
      </div>

      <section className="countdown-wrap container">
        <Countdown />
      </section>

      <section className="section container" id="highlights">
        <SectionHeading
          kicker="01 / WHAT'S INSIDE"
          title={<>六种方式，<br />掉进同一座山谷</>}
          description="从一张原画到一场 Live，从第一次摆摊到第 100 次见面。无论你从哪里进场，都能找到属于自己的那条路径。"
          action={<Link to="/about" className="text-link">了解山谷计划 <ArrowUpRight size={16} /></Link>}
        />

        <div className="bento-grid">
          {highlights.map((item, index) => {
            const Icon = item.icon
            return (
              <Reveal
                key={item.key}
                delay={index * 60}
                as="article"
                className={`bento-card ${item.className} bento-card--${item.kind}`}
              >
                <div className="bento-card__head">
                  <span>{item.index}</span>
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                <div className="bento-card__content">
                  <span className="bento-card__en">{item.en}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
                <div className="bento-card__foot">
                  <span className="bento-card__tag">{item.tag}</span>
                  <span className="bento-card__arrow"><ArrowUpRight size={18} /></span>
                </div>
                {item.key === 'art' && (
                  <svg className="bento-eye" viewBox="0 0 260 140" aria-hidden="true">
                    <path d="M9 70C52 15 208 4 251 70C207 127 53 130 9 70Z" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="130" cy="70" r="38" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="130" cy="70" r="17" fill="currentColor" />
                    <circle cx="120" cy="60" r="5" fill="var(--lime)" />
                  </svg>
                )}
                {item.key === 'live' && (
                  <div className="bento-live-marks" aria-hidden="true">
                    <span>12.20</span>
                    <span>19:00</span>
                    <span>HALL 6.2</span>
                  </div>
                )}
              </Reveal>
            )
          })}
        </div>
      </section>

      <section className="guests-section">
        <div className="container">
          <SectionHeading
            kicker="02 / GUEST LINEUP"
            title={<>先认识，<br />即将见面的人</>}
            description="他们用画笔、声音和分镜，造出了我们曾经躲进去的世界。这一次，换我们朝他们走过去。"
            light
            action={<Link to="/news/stage-schedule" className="text-link text-link--light">查看舞台日程 <ArrowUpRight size={16} /></Link>}
          />
          <div className="guest-grid">
            {guests.map((guest, index) => (
              <Reveal
                key={guest.name}
                as="article"
                delay={index * 80}
                className={`guest-card guest-card--${guest.tone}`}
              >
                <div className="guest-card__visual">
                  <span className="guest-card__index">G / 0{index + 1}</span>
                  <span className="guest-card__tag">{guest.tag}</span>
                  <span className="guest-card__mark">{guest.mark}</span>
                  <span className="guest-card__halo" aria-hidden="true" />
                  <svg className="guest-card__spark" viewBox="0 0 40 40" aria-hidden="true">
                    <path d="M20 1c1.6 11.9 6.3 17 19 19-12.7 2-17.4 7.1-19 19-1.6-11.9-6.3-17-19-19C13.7 18 18.4 12.9 20 1Z" fill="currentColor" />
                  </svg>
                </div>
                <div className="guest-card__info">
                  <div className="guest-card__name">
                    <h3>{guest.name}</h3>
                    <span>{guest.role}</span>
                  </div>
                  <p>“{guest.line}”</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="guests-section__note">
            <span className="status-dot" />
            更多嘉宾与舞台阵容将在 11 月底陆续解锁
          </div>
        </div>
      </section>

      <section className="section container schedule-section">
        <SectionHeading
          kicker="03 / THREE DAYS"
          title={<>三天，把时间<br />花在喜欢的事上</>}
          description="不必赶场。挑一个最想见的瞬间，剩下的交给偶遇。完整日程可能微调，请以现场手册为准。"
          action={<Link to="/news/stage-schedule" className="text-link">查看完整日程 <ArrowUpRight size={16} /></Link>}
        />
        <div className="schedule">
          <div className="schedule__tabs" role="tablist" aria-label="选择日期">
            {schedule.map((item, index) => (
              <button
                key={item.day}
                type="button"
                role="tab"
                aria-selected={activeDay === index}
                className={`schedule-tab ${activeDay === index ? 'is-active' : ''}`}
                onClick={() => setActiveDay(index)}
              >
                <span>{item.day}</span>
                <strong>{item.date}</strong>
                <small>{item.weekday}</small>
              </button>
            ))}
          </div>
          <div className="schedule__panel">
            <div className="schedule__panel-head">
              <span>DAY 0{activeDay + 1} · 12.{19 + activeDay}</span>
              <span className="schedule__legend"><i /> 主舞台 <i /> 市集 <i /> 特别活动</span>
            </div>
            <div className="schedule__list" key={activeDay}>
              {day.items.map((item) => (
                <div className="schedule-row" key={item.time + item.title}>
                  <div className="schedule-row__time">
                    <strong>{item.time}</strong>
                    <span className="schedule-row__dot" />
                  </div>
                  <div className="schedule-row__main">
                    <div>
                      <h3>{item.title}</h3>
                      <p><MapPin size={13} /> {item.place}</p>
                    </div>
                    <div className="schedule-row__tags">
                      {item.guest && <span className="schedule-row__guest">{item.guest}</span>}
                      <span className="schedule-row__type">{item.type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section section--news">
        <div className="container">
          <SectionHeading
            kicker="04 / NEWSROOM"
            title={<>山谷情报站</>}
            description="阵容、票务、现场攻略和那些还没说出口的小惊喜，都会先从这里发出。"
            action={<Link to="/news" className="text-link">进入资讯中心 <ArrowUpRight size={16} /></Link>}
          />
          <div className="news-preview">
            <Reveal className="news-preview__lead">
              <NewsCard article={news[0]} featured />
            </Reveal>
            <div className="news-preview__side">
              {news.slice(1, 3).map((article, index) => (
                <Reveal key={article.id} delay={index * 90}>
                  <NewsCard article={article} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="community-teaser">
        <div className="community-teaser__grid" aria-hidden="true" />
        <div className="container community-teaser__inner">
          <div className="community-teaser__copy">
            <span className="eyebrow eyebrow--light"><i /> 05 / THE VALLEY COMMUNITY</span>
            <h2>展馆会熄灯，<br /><span>山谷不会散场。</span></h2>
            <p>在这里找搭子、晒痛包、交换无料、交换一句“原来你也喜欢”。漫展只有三天，同好之间的回声可以很长。</p>
            <div className="community-teaser__stats">
              <div><strong>12,000+</strong><span>山谷居民</span></div>
              <div><strong>3,600</strong><span>同好帖子</span></div>
              <div><strong>24/7</strong><span>持续营业</span></div>
            </div>
            <Link to="/community" className="btn btn--lime btn--lg">
              进入山谷社区
              <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="community-mock">
            <div className="community-mock__head">
              <div className="community-mock__dots"><i /><i /><i /></div>
              <span>YOUGU COMMUNITY / FEED</span>
              <span className="status-dot status-dot--lime" />
            </div>
            <div className="community-mock__body">
              {communityPreview.length === 0 ? (
                <div className="mock-post mock-post--loading">
                  <div className="mock-post__head">
                    <span className="mock-avatar mock-avatar--coral">谷</span>
                    <div>
                      <strong>山谷正在加载</strong>
                      <small>YOUGU COMMUNITY</small>
                    </div>
                  </div>
                  <h3>正在接收同好们的回声…</h3>
                  <p>连接模拟后端后，这里会显示社区里的最新帖子。</p>
                </div>
              ) : (
                communityPreview.map((post, index) => (
                  <div className={`mock-post mock-post--${index + 1}`} key={post.id}>
                    <div className="mock-post__head">
                      <span className={`mock-avatar mock-avatar--${index === 0 ? 'coral' : 'violet'}`}>{post.author.slice(0, 1)}</span>
                      <div>
                        <strong>{post.author}</strong>
                        <small>{post.topic}</small>
                      </div>
                      <span className="mock-post__time">{formatRelativeTime(post.createdAt)}</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.body.slice(0, 48)}…</p>
                    <div className="mock-post__foot">
                      <span><Heart size={14} /> {post.likes}</span>
                      <span><MessageCircle size={14} /> {post.comments.length}</span>
                      <span className="mock-post__tag">#{post.topic}</span>
                    </div>
                  </div>
                ))
              )}
              <div className="mock-float">
                <Sparkles size={18} />
                <span>今日 128 条新回声</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="final-cta__inner container">
          <div className="final-cta__meta">
            <span>{event.nameEn} · {event.edition}</span>
            <span>{event.dates}</span>
          </div>
          <h2>
            <span>山谷见</span>
            <StarMark />
          </h2>
          <div className="final-cta__bottom">
            <p>上海 · 国家会展中心 5.2H / 6.2H<br />带上你想见的人，或者只带上你自己。</p>
            <div>
              <Link to="/news/early-bird-ticket" className="btn btn--dark btn--lg">
                <Ticket size={18} /> 预约早鸟票
              </Link>
              <Link to="/contact" className="btn btn--ghost btn--lg">
                联系我们 <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
