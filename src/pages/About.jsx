import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  HeartHandshake,
  MapPin,
  PenTool,
  Sparkles,
  Users,
} from 'lucide-react'
import ArtCover from '../components/ArtCover.jsx'
import Reveal from '../components/Reveal.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { StarMark } from '../components/Logo.jsx'
import { stats, timeline } from '../data.js'

const values = [
  {
    icon: PenTool,
    number: 'A',
    title: '创作者优先',
    text: '摊位费不涨、分成透明、给第一次摆摊的人留位置。一个漫展最重要的作品，是让创作者愿意再来一次。',
  },
  {
    icon: HeartHandshake,
    number: 'B',
    title: '同好之间的善意',
    text: '不围观、不打扰、不评价别人的喜欢。我们相信，被温柔对待过的人，也会把温柔传下去。',
  },
  {
    icon: Users,
    number: 'C',
    title: '让抵达变得容易',
    text: '更清楚的指引、更安静的休息区、更可负担的票价。友好不是附加服务，而应该是默认设置。',
  },
]

export default function About() {
  return (
    <div className="about-page">
      <section className="page-hero about-hero">
        <div className="container page-hero__inner about-hero__inner">
          <div className="about-hero__copy">
            <span className="eyebrow"><i /> ABOUT / 关于有谷 · SINCE 2022</span>
            <h1>我们想造一座<br />可以反复回来的<span className="highlight-word">山谷</span>。</h1>
            <p>
              有谷不是一个巨大的展会，也不是一个被流量选中的名字。
              它更像一个每年冬天打开一次的房间：有人带着新画来，有人带着旧朋友来，
              也有人只是来看看，原来世界上还有这么多同频的人。
            </p>
            <div className="about-hero__actions">
              <a href="#manifesto" className="btn btn--dark">读我们的故事 <ArrowRight size={17} /></a>
              <Link to="/contact" className="btn btn--ghost">联系组委会 <ArrowUpRight size={17} /></Link>
            </div>
          </div>

          <div className="about-hero__visual">
            <Reveal className="about-poster">
              <ArtCover variant="wave" label="SAME VALLEY" accent="violet" />
              <div className="about-poster__caption">
                <span>“让同一种喜欢，有地方发生。”</span>
                <StarMark />
              </div>
            </Reveal>
            <Reveal delay={140} className="about-sticker-card">
              <span>EST.</span>
              <strong>2022</strong>
              <small>四届 · 一座山谷</small>
            </Reveal>
            <Reveal delay={220} className="about-side-note">
              <span>01</span>
              <p>从 4,200 人到 30,000 人，<br />我们还在学着把这件事做好。</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="stats-band">
        <div className="container stats-band__inner">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="stats-band__value">
                <strong>{stat.value}</strong>
                <span>{stat.unit}</span>
              </div>
              <p>{stat.label}</p>
            </div>
          ))}
          <div className="stats-band__note">
            <span className="status-dot" />
            2026 预计数据
          </div>
        </div>
      </section>

      <section className="manifesto section" id="manifesto">
        <div className="container manifesto__inner">
          <div className="manifesto__label">
            <span className="eyebrow"><i /> 01 / WHY WE GATHER</span>
            <div className="manifesto__mark">“</div>
          </div>
          <div className="manifesto__body">
            <Reveal>
              <h2>
                漫展不只是买票进场、<br />
                排队、然后回家。<br />
                <span>它是一次“原来你也在这里”的确认。</span>
              </h2>
            </Reveal>
            <div className="manifesto__text">
              <Reveal delay={80}>
                <p>
                  2022 年，我们在一个只有 3,000 平方米的展馆里办了第一届有谷。
                  那天下午下暴雨，很多人拎着湿透的纸袋在门口排队。闭馆的时候，
                  一个女孩跑过来对我们说：“谢谢你们，我今天没有觉得自己奇怪。”
                </p>
              </Reveal>
              <Reveal delay={120}>
                <p>
                  这句话后来变成了我们做每一届漫展的起点。我们不追求最大的场馆、
                  最多的摊位，或者最响亮的名字。我们更在意的是，一个第一次来的人，
                  能不能在人群里稍微放松一点；一个画了很久的人，能不能被认真地看见。
                </p>
              </Reveal>
              <Reveal delay={160}>
                <p>
                  所以有了「山谷」这个比喻。山不会要求你成为谁，它只是在那里，
                  接住每一个愿意走进来的人。而我们想做的，是把这座山谷，
                  一年一年地再打开一次。
                </p>
              </Reveal>
            </div>
            <div className="manifesto__sign">
              <span>有谷漫展组委会</span>
              <span>2026.11</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section container story-section">
        <SectionHeading
          kicker="02 / THE STORY"
          title={<>从 4,200 人到<br />30,000 人的山谷</>}
          description="我们不是一开始就知道该怎么做的。五年、四届，每一步都留下了一些笨拙但真实的脚印。"
        />
        <div className="timeline">
          {timeline.map((item, index) => (
            <Reveal key={item.year} as="article" className={`timeline-row ${index === timeline.length - 1 ? 'is-current' : ''}`} delay={index * 60}>
              <div className="timeline-row__year">{item.year}</div>
              <div className="timeline-row__dot"><i /></div>
              <div className="timeline-row__content">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
              {index === timeline.length - 1 && <span className="timeline-row__now">NOW</span>}
            </Reveal>
          ))}
        </div>
      </section>

      <section className="values-section">
        <div className="container">
          <SectionHeading
            kicker="03 / WHAT WE CARE"
            title={<>我们认真对待的<br />三件小事</>}
            description="它们听起来不够宏大，但每一届，我们都会拿出来重新检查一遍。"
            light
          />
          <div className="values-grid">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <Reveal key={value.number} className="value-card" delay={index * 80}>
                  <div className="value-card__head">
                    <span>{value.number}</span>
                    <Icon size={24} strokeWidth={1.7} />
                  </div>
                  <h3>{value.title}</h3>
                  <p>{value.text}</p>
                  <span className="value-card__line" />
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section container team-section">
        <div className="team-card">
          <div className="team-card__copy">
            <span className="eyebrow eyebrow--light"><i /> 04 / THE CREW</span>
            <h2>一座山谷，<br />由很多双手一起托住。</h2>
            <p>
              组委会、志愿者、摊主、演出者、场地方，还有每一个愿意排队、愿意说谢谢的你。
              有谷没有“工作人员”和“观众”的严格分界，我们都只是山谷里的住客。
            </p>
            <div className="team-card__roles">
              <span>内容组</span>
              <span>志愿者团队</span>
              <span>摊主</span>
              <span>演出者</span>
              <span>每一个你</span>
            </div>
            <Link to="/news/volunteer-recruit" className="btn btn--lime">
              加入志愿者团队 <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="team-card__visual">
            <div className="team-collage">
              <div className="team-collage__tile team-collage__tile--1">
                <span>01</span>
                <strong>一起把灯<br />打开的人</strong>
                <Sparkles size={20} />
              </div>
              <div className="team-collage__tile team-collage__tile--2">
                <span className="status-dot" />
                <p>“累，但明年还来。”</p>
                <small>— 志愿者 小岛</small>
              </div>
              <div className="team-collage__tile team-collage__tile--3">
                <StarMark />
                <strong>YOUGU<br />CREW</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-venue container">
        <div className="about-venue__info">
          <span className="eyebrow"><i /> 05 / THE PLACE</span>
          <h2>在上海的冬天，<br />找到我们的山谷。</h2>
          <div className="about-venue__rows">
            <div><CalendarDays size={19} /><span><small>日期</small>2026.12.19 — 12.21</span></div>
            <div><MapPin size={19} /><span><small>地址</small>上海 · 国家会展中心 5.2H / 6.2H</span></div>
          </div>
          <Link to="/contact" className="text-link">查看交通与场馆指引 <ArrowUpRight size={16} /></Link>
        </div>
        <div className="about-venue__map" aria-hidden="true">
          <svg viewBox="0 0 560 280">
            <path d="M-10 210C80 145 175 250 265 190S430 90 580 150" fill="none" stroke="var(--ink)" strokeWidth="2" strokeDasharray="8 8" opacity=".35" />
            <path d="M-10 246C105 205 174 280 275 232S446 160 580 210" fill="none" stroke="var(--ink)" strokeWidth="16" opacity=".06" />
            <path d="M70 260V40h160M280 260V80h150M430 260V30h90" fill="none" stroke="var(--ink)" strokeWidth="1" opacity=".14" />
            <rect x="184" y="92" width="180" height="110" rx="2" fill="var(--lime)" stroke="var(--ink)" strokeWidth="2" />
            <path d="M214 122h120M214 144h120M214 166h70" stroke="var(--ink)" strokeWidth="1.5" opacity=".4" />
            <circle cx="274" cy="147" r="19" fill="var(--coral)" stroke="var(--ink)" strokeWidth="2" />
            <path d="M274 128v-18" stroke="var(--ink)" strokeWidth="2" />
            <circle cx="274" cy="147" r="5" fill="var(--paper)" />
            <text x="316" y="230" fontFamily="Space Grotesk, sans-serif" fontSize="12" fontWeight="600" fill="var(--ink)">NECC · SHANGHAI</text>
            <text x="30" y="40" fontFamily="Archivo Black, sans-serif" fontSize="13" letterSpacing="2" fill="var(--ink)" opacity=".5">31.19° N / 121.30° E</text>
            <path d="M450 75l4 13 13 4-13 4-4 13-4-13-13-4 13-4 4-13Z" fill="var(--ink)" />
          </svg>
        </div>
      </section>
    </div>
  )
}
