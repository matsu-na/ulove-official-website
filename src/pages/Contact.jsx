import { useState } from 'react'
import {
  ArrowUpRight,
  AtSign,
  Car,
  Check,
  Clock,
  Mail,
  MapPin,
  Minus,
  Phone,
  Plane,
  Plus,
  Send,
  TrainFront,
} from 'lucide-react'
import Reveal from '../components/Reveal.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { faqs } from '../data.js'
import { useToast } from '../context/ToastContext.jsx'

const initialForm = { name: '', email: '', topic: '购票咨询', message: '', consent: false }

const topics = ['购票咨询', '同人市集', '媒体与商务', '志愿者', '无障碍服务', '其他']

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)
  const { toast } = useToast()

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: '' }))
  }

  const validate = () => {
    const next = {}
    if (form.name.trim().length < 2) next.name = '请填写至少 2 个字的称呼'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = '请检查邮箱格式'
    if (form.message.trim().length < 10) next.message = '再多写一点吧，至少 10 个字'
    if (!form.consent) next.consent = '请先同意我们使用这些信息来回复你'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (event) => {
    event.preventDefault()
    if (!validate()) return
    try {
      const stored = JSON.parse(localStorage.getItem('yougu_messages') || '[]')
      localStorage.setItem(
        'yougu_messages',
        JSON.stringify([...stored, { ...form, createdAt: new Date().toISOString() }]),
      )
    } catch {
      // A demo submission should not fail if storage is unavailable.
    }
    setSubmitted(true)
    toast('消息已送达山谷，我们会在 3 个工作日内回复', 'success')
    window.scrollTo({ top: document.querySelector('.contact-form-card')?.offsetTop - 120, behavior: 'smooth' })
  }

  const reset = () => {
    setForm(initialForm)
    setErrors({})
    setSubmitted(false)
  }

  return (
    <div className="contact-page">
      <section className="page-hero contact-hero">
        <div className="container page-hero__inner contact-hero__inner">
          <div>
            <span className="eyebrow"><i /> CONTACT / 联系我们</span>
            <h1>有事找我们？<br />山谷一直<span className="serif-accent">有人</span>。</h1>
            <p>无论是票务问题、合作想法，还是想说一句“今年也辛苦了”。选一个你舒服的方式，我们都在。</p>
            <div className="contact-hero__quick">
              <a href="mailto:hello@yougu-expo.com"><Mail size={16} /> hello@yougu-expo.com</a>
              <a href="tel:02166881219"><Phone size={16} /> 021-6688-1219</a>
            </div>
          </div>
          <div className="contact-response">
            <div className="contact-response__ring">
              <span>3</span>
              <small>个工作日</small>
            </div>
            <div>
              <strong>我们会尽快回复</strong>
              <p>工作日 10:00—18:00 收到的消息，通常会在 3 个工作日内得到人工回复。</p>
            </div>
            <span className="contact-response__note">NO AUTO-REPLY<br />REAL PEOPLE ONLY</span>
          </div>
        </div>
      </section>

      <section className="container contact-main">
        <Reveal className="contact-form-card" id="contact-form">
          {submitted ? (
            <div className="contact-success">
              <span className="contact-success__icon"><Check size={30} /></span>
              <span className="eyebrow"><i /> MESSAGE RECEIVED</span>
              <h2>消息已经出发，<br />谢谢你愿意写下来。</h2>
              <p>我们会在 3 个工作日内，通过 <strong>{form.email}</strong> 回复你。如果很急，也可以直接致电 021-6688-1219。</p>
              <div className="contact-success__meta">
                <span>主题 / {form.topic}</span>
                <span>称呼 / {form.name}</span>
              </div>
              <button type="button" className="btn btn--dark" onClick={reset}>再写一封</button>
            </div>
          ) : (
            <>
              <div className="contact-form-card__head">
                <div>
                  <span className="eyebrow"><i /> SEND A MESSAGE</span>
                  <h2>给山谷写一封信</h2>
                </div>
                <span className="contact-form-card__num">01 / 03</span>
              </div>
              <form onSubmit={submit} noValidate>
                <div className="form-grid">
                  <label className={`field ${errors.name ? 'has-error' : ''}`}>
                    <span>怎么称呼你？<i>*</i></span>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(event) => update('name', event.target.value)}
                      placeholder="你的名字 / 昵称"
                      aria-invalid={Boolean(errors.name)}
                    />
                    {errors.name && <small>{errors.name}</small>}
                  </label>
                  <label className={`field ${errors.email ? 'has-error' : ''}`}>
                    <span>邮箱地址<i>*</i></span>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => update('email', event.target.value)}
                      placeholder="you@example.com"
                      aria-invalid={Boolean(errors.email)}
                    />
                    {errors.email && <small>{errors.email}</small>}
                  </label>
                </div>

                <div className="field">
                  <span>想聊点什么？</span>
                  <div className="topic-options" role="group" aria-label="选择咨询主题">
                    {topics.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        className={`topic-chip ${form.topic === topic ? 'is-active' : ''}`}
                        onClick={() => update('topic', topic)}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                <label className={`field ${errors.message ? 'has-error' : ''}`}>
                  <span>写下你的问题或想法<i>*</i><em>{form.message.length} / 500</em></span>
                  <textarea
                    rows="5"
                    maxLength="500"
                    value={form.message}
                    onChange={(event) => update('message', event.target.value)}
                    placeholder="越具体，我们越能帮上忙。如果是票务问题，可以附上订单号后四位。"
                    aria-invalid={Boolean(errors.message)}
                  />
                  {errors.message && <small>{errors.message}</small>}
                </label>

                <label className={`check-field ${errors.consent ? 'has-error' : ''}`}>
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(event) => update('consent', event.target.checked)}
                  />
                  <span className="check-field__box">{form.consent && <Check size={13} />}</span>
                  <span>我同意有谷使用以上信息与我联系，信息仅用于回复本次咨询。</span>
                </label>
                {errors.consent && <small className="field-error">{errors.consent}</small>}

                <div className="contact-form__foot">
                  <p>演示站点：提交内容仅保存在本地浏览器，不会真实发送。</p>
                  <button type="submit" className="btn btn--dark btn--lg">
                    发送消息 <Send size={17} />
                  </button>
                </div>
              </form>
            </>
          )}
        </Reveal>

        <aside className="contact-aside">
          <Reveal className="contact-info-card">
            <span className="eyebrow eyebrow--light"><i /> DIRECT LINES</span>
            <h2>直接找到<br />对的人。</h2>
            <div className="contact-lines">
              <a href="mailto:hello@yougu-expo.com">
                <span>一般咨询</span>
                <strong>hello@yougu-expo.com</strong>
                <ArrowUpRight size={16} />
              </a>
              <a href="mailto:press@yougu-expo.cn">
                <span>媒体联络</span>
                <strong>press@yougu-expo.cn</strong>
                <ArrowUpRight size={16} />
              </a>
              <a href="mailto:business@yougu-expo.com">
                <span>品牌合作</span>
                <strong>business@yougu-expo.com</strong>
                <ArrowUpRight size={16} />
              </a>
              <a href="tel:02166881219">
                <span>票务与观众服务</span>
                <strong>021-6688-1219</strong>
                <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="contact-hours">
              <Clock size={17} />
              <div>
                <strong>人工在线时间</strong>
                <span>周一至周五 10:00 — 18:00<br />开展期间 08:30 — 21:30</span>
              </div>
            </div>
          </Reveal>

          <Reveal className="contact-social-card" delay={90}>
            <div>
              <span className="eyebrow"><i /> FIND US ONLINE</span>
              <h3>山谷的日常<br />也在这些地方。</h3>
            </div>
            <div className="social-list">
              <a href="https://weibo.com" target="_blank" rel="noreferrer">微博 <span>@有谷漫展</span> <ArrowUpRight size={14} /></a>
              <a href="https://www.xiaohongshu.com" target="_blank" rel="noreferrer">小红书 <span>有谷漫展</span> <ArrowUpRight size={14} /></a>
              <a href="https://www.bilibili.com" target="_blank" rel="noreferrer">Bilibili <span>有谷漫展官方</span> <ArrowUpRight size={14} /></a>
              <a href="https://www.wechat.com" target="_blank" rel="noreferrer">公众号 <span>YOUGUEXPO</span> <AtSign size={14} /></a>
            </div>
          </Reveal>
        </aside>
      </section>

      <section className="section container faq-section">
        <SectionHeading
          kicker="02 / FAQ"
          title={<>你可能想<br />先问问这些</>}
          description="关于门票、交通、拍摄和现场服务的常见问题。没有找到答案，就写信给我们。"
        />
        <div className="faq-layout">
          <div className="faq-list">
            {faqs.map((faq, index) => {
              const open = openFaq === index
              return (
                <div className={`faq-item ${open ? 'is-open' : ''}`} key={faq.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? -1 : index)}
                    aria-expanded={open}
                  >
                    <span className="faq-item__num">0{index + 1}</span>
                    <span className="faq-item__q">{faq.q}</span>
                    <span className="faq-item__toggle">{open ? <Minus size={18} /> : <Plus size={18} />}</span>
                  </button>
                  <div className="faq-item__answer">
                    <div><p>{faq.a}</p></div>
                  </div>
                </div>
              )
            })}
          </div>
          <aside className="faq-aside">
            <div className="faq-aside__card">
              <span className="faq-aside__mark">?</span>
              <h3>还是没找到<br />你的答案？</h3>
              <p>把问题写给我们，人工回复，不用和机器人绕圈。</p>
              <a href="#contact-form" className="btn btn--lime" onClick={() => document.querySelector('.contact-form-card')?.scrollIntoView({ behavior: 'smooth' })}>
                写信给山谷 <ArrowUpRight size={16} />
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="section container arrival-section">
        <SectionHeading
          kicker="03 / GETTING HERE"
          title={<>抵达山谷的<br />三种方式</>}
          description="建议优先选择公共交通。展会期间场馆周边将实行临时交通管制，自驾请预留额外时间。"
        />
        <div className="arrival-grid">
          <div className="arrival-card">
            <span className="arrival-card__icon"><TrainFront size={24} /></span>
            <h3>地铁</h3>
            <p>2 号线徐泾东站 4 号口，步行约 8 分钟。<br />17 号线诸光路站 2 号口，步行约 12 分钟。</p>
            <span className="arrival-card__tag">推荐</span>
          </div>
          <div className="arrival-card">
            <span className="arrival-card__icon"><Car size={24} /></span>
            <h3>自驾 / 网约车</h3>
            <p>导航至国家会展中心 P2 / P3 停车场。展会期间车位紧张，建议在 9:00 前抵达。</p>
            <span className="arrival-card__tag">P2 / P3</span>
          </div>
          <div className="arrival-card">
            <span className="arrival-card__icon"><Plane size={24} /></span>
            <h3>机场 / 火车站</h3>
            <p>虹桥机场与虹桥火车站距场馆约 15 分钟车程，可换乘地铁 2 号线直达徐泾东。</p>
            <span className="arrival-card__tag">约 15 min</span>
          </div>
        </div>

        <div className="contact-map" id="contact-form">
          <div className="contact-map__map">
            <svg viewBox="0 0 820 340" aria-hidden="true">
              <rect width="820" height="340" fill="var(--paper-2)" />
              <g stroke="var(--ink)" strokeWidth="1" opacity=".12">
                {Array.from({ length: 13 }, (_, i) => <path key={`x${i}`} d={`M${i * 68} 0v340`} />)}
                {Array.from({ length: 6 }, (_, i) => <path key={`y${i}`} d={`M0 ${i * 68}h820`} />)}
              </g>
              <path d="M0 275C130 245 214 300 330 250S540 190 820 235" fill="none" stroke="var(--ink)" strokeWidth="2" strokeDasharray="7 7" opacity=".35" />
              <path d="M0 305C140 275 230 330 360 285S600 225 820 270" fill="none" stroke="var(--violet)" strokeWidth="24" opacity=".12" />
              <path d="M115 340V95h205M390 340V45h170M620 340V110h150" fill="none" stroke="var(--ink)" strokeWidth="1.2" opacity=".18" />
              <rect x="298" y="105" width="230" height="148" rx="3" fill="var(--lime)" stroke="var(--ink)" strokeWidth="2" />
              <path d="M328 139h165M328 164h165M328 189h100" stroke="var(--ink)" strokeWidth="1.4" opacity=".35" />
              <circle cx="412" cy="181" r="25" fill="var(--coral)" stroke="var(--ink)" strokeWidth="2.5" />
              <circle cx="412" cy="181" r="7" fill="var(--paper)" />
              <path d="M412 156v-28" stroke="var(--ink)" strokeWidth="2" />
              <text x="438" y="278" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="14" fill="var(--ink)">NECC · 5.2H / 6.2H</text>
              <text x="40" y="55" fontFamily="Archivo Black, sans-serif" fontSize="13" letterSpacing="3" fill="var(--ink)" opacity=".5">SHANGHAI / QINGPU</text>
              <path d="M680 60l6 20 20 6-20 6-6 20-6-20-20-6 20-6 6-20Z" fill="var(--ink)" />
              <g fontFamily="Space Grotesk, sans-serif" fontSize="10" fill="var(--ink)" opacity=".5">
                <text x="36" y="240">XUJING EAST</text>
                <text x="700" y="250">HONGQIAO</text>
              </g>
            </svg>
          </div>
          <div className="contact-map__info">
            <span className="eyebrow"><i /> VENUE</span>
            <h3>国家会展中心<br />5.2H / 6.2H</h3>
            <p><MapPin size={15} /> 上海市青浦区崧泽大道 333 号</p>
            <p><Clock size={15} /> 每日 09:00 — 18:00（夜场至 21:30）</p>
            <a
              href="https://uri.amap.com/marker?position=121.3027,31.1966&name=国家会展中心"
              target="_blank"
              rel="noreferrer"
              className="btn btn--dark"
            >
              在地图中打开 <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
