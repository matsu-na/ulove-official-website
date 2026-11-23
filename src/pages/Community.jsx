import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowUpRight,
  Bookmark,
  Flame,
  Heart,
  LockKeyhole,
  MessageCircle,
  PenLine,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'
import ArtCover from '../components/ArtCover.jsx'
import Reveal from '../components/Reveal.jsx'
import { StarMark } from '../components/Logo.jsx'
import { communityTopics, EVENT, seedPosts } from '../data.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { countdownTo, formatRelativeTime, getAvatarTone, getInitials } from '../utils.js'

const POSTS_KEY = 'yougu_posts_v1'

const topicArt = {
  同人市集: { variant: 'sticker', accent: 'yellow' },
  找搭子: { variant: 'train', accent: 'sky' },
  痛包研究所: { variant: 'painbag', accent: 'coral' },
  舞台应援: { variant: 'sun', accent: 'violet' },
  社恐友好: { variant: 'guide', accent: 'lime' },
}

function loadPosts() {
  try {
    const stored = JSON.parse(localStorage.getItem(POSTS_KEY))
    if (Array.isArray(stored) && stored.length > 0) return stored
  } catch {
    // Use fresh seed data when local data is unavailable.
  }
  return seedPosts
}

function memberId(email = '') {
  let total = 0
  for (const char of email) total = (total * 31 + char.codePointAt(0)) % 99999
  return String(total).padStart(5, '0')
}

const onlinePeople = [
  { name: '阿柚 Ayu', tone: 'lime' },
  { name: '纸灯Yoru', tone: 'coral' },
  { name: '抹茶拿铁', tone: 'violet' },
  { name: '北岸电波', tone: 'sky' },
  { name: '小岛', tone: 'yellow' },
]

export default function Community() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [posts, setPosts] = useState(loadPosts)
  const [activeTab, setActiveTab] = useState('recommend')
  const [activeTopic, setActiveTopic] = useState('')
  const [composerOpen, setComposerOpen] = useState(false)
  const [draft, setDraft] = useState({ title: '', body: '', topic: '同人市集' })
  const [draftError, setDraftError] = useState('')
  const [commentDrafts, setCommentDrafts] = useState({})
  const [openComments, setOpenComments] = useState({})
  const [saved, setSaved] = useState(() => {
    if (!user) return []
    try {
      return JSON.parse(localStorage.getItem(`yougu_saved_${user.email}`) || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
    } catch {
      // Ignore storage failures in private browsing.
    }
  }, [posts])

  useEffect(() => {
    if (!user) return
    try {
      localStorage.setItem(`yougu_saved_${user.email}`, JSON.stringify(saved))
    } catch {
      // Ignore storage failures.
    }
  }, [saved, user])

  useEffect(() => {
    if (!user) {
      setSaved([])
      return
    }
    try {
      const stored = JSON.parse(localStorage.getItem(`yougu_saved_${user.email}`) || '[]')
      setSaved(Array.isArray(stored) ? stored : [])
    } catch {
      setSaved([])
    }
  }, [user])

  const myPosts = useMemo(
    () => posts.filter((post) => post.email === user?.email),
    [posts, user],
  )

  const filteredPosts = useMemo(() => {
    let result = [...posts]
    if (activeTopic) result = result.filter((post) => post.topic === activeTopic)
    if (activeTab === 'mine') result = result.filter((post) => post.email === user?.email)
    if (activeTab === 'latest') result.sort((a, b) => b.time - a.time)
    else result.sort((a, b) => b.likes + b.comments.length * 3 - (a.likes + a.comments.length * 3))
    return result
  }, [posts, activeTopic, activeTab, user])

  const requireAuth = (intent = '参与讨论') => {
    toast(`登录后就可以${intent}了`, 'default')
    navigate('/login', { state: { from: '/community', intent } })
  }

  const toggleLike = (postId) => {
    if (!user) {
      requireAuth('点赞')
      return
    }
    setPosts((current) =>
      current.map((post) => {
        if (post.id !== postId) return post
        const liked = post.likedBy.includes(user.email)
        return {
          ...post,
          likes: post.likes + (liked ? -1 : 1),
          likedBy: liked ? post.likedBy.filter((email) => email !== user.email) : [...post.likedBy, user.email],
        }
      }),
    )
  }

  const toggleSaved = (postId) => {
    if (!user) {
      requireAuth('收藏帖子')
      return
    }
    const isSaved = saved.includes(postId)
    setSaved((current) => (isSaved ? current.filter((id) => id !== postId) : [...current, postId]))
    toast(isSaved ? '已取消收藏' : '已收藏，稍后在山谷里继续看', isSaved ? 'default' : 'success')
  }

  const submitPost = (event) => {
    event.preventDefault()
    if (!user) {
      requireAuth('发帖')
      return
    }
    if (draft.title.trim().length < 4) {
      setDraftError('标题再具体一点吧，至少 4 个字')
      return
    }
    if (draft.body.trim().length < 10) {
      setDraftError('正文至少写 10 个字，让大家知道你在想什么')
      return
    }
    const art = topicArt[draft.topic] ?? { variant: 'star', accent: 'lime' }
    const newPost = {
      id: `post-${Date.now()}`,
      author: user.nickname,
      email: user.email,
      role: '山谷居民',
      topic: draft.topic,
      time: Date.now(),
      title: draft.title.trim(),
      body: draft.body.trim(),
      art: { ...art, label: `${draft.topic.toUpperCase()} / NEW` },
      likes: 0,
      likedBy: [],
      comments: [],
    }
    setPosts((current) => [newPost, ...current])
    setDraft({ title: '', body: '', topic: draft.topic })
    setDraftError('')
    setComposerOpen(false)
    setActiveTab('latest')
    setActiveTopic('')
    toast('发布成功，山谷已经听到你的回声', 'success')
  }

  const addComment = (postId) => {
    if (!user) {
      requireAuth('评论')
      return
    }
    const text = (commentDrafts[postId] || '').trim()
    if (!text) return
    setPosts((current) =>
      current.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: `comment-${Date.now()}`,
                  author: user.nickname,
                  body: text,
                  time: Date.now(),
                },
              ],
            }
          : post,
      ),
    )
    setCommentDrafts((current) => ({ ...current, [postId]: '' }))
    setOpenComments((current) => ({ ...current, [postId]: true }))
    toast('评论已发布', 'success')
  }

  const userSince = user?.joinedAt
    ? Math.max(1, Math.ceil((Date.now() - new Date(user.joinedAt).getTime()) / 86400000))
    : 0
  const daysToEvent = countdownTo(EVENT.target).days

  return (
    <div className="community-page">
      <section className="community-hero">
        <div className="community-hero__grid" aria-hidden="true" />
        <div className="container community-hero__inner">
          <div className="community-hero__copy">
            <span className="eyebrow eyebrow--light"><i /> THE VALLEY COMMUNITY / 山谷社区</span>
            <h1>同好在这里，<br /><span>慢慢认识也可以。</span></h1>
            <p>
              不用急着自我介绍。可以先看看大家在做什么，收藏一篇攻略，
              或者只是给喜欢的帖子留一颗心。山谷的门一直开着。
            </p>
            <div className="community-hero__stats">
              <div><strong>12,000+</strong><span>山谷居民</span></div>
              <div><strong>3,600</strong><span>同好帖子</span></div>
              <div><strong><i /> 2,048</strong><span>此刻在线</span></div>
            </div>
          </div>

          <div className="member-card">
            <div className="member-card__head">
              <span>YOUGU COMMUNITY / MEMBER PASS</span>
              <StarMark />
            </div>
            <div className="member-card__body">
              <span className="member-card__label">VALLEY RESIDENT</span>
              <strong>{user ? user.nickname : '未来的你'}</strong>
              <p>{user ? user.bio : '登录后领取属于你的山谷通行证。'}</p>
              <div className="member-card__bottom">
                <span>NO. {user ? memberId(user.email) : '?????'}</span>
                <span>{user ? `DAY ${userSince}` : 'GUEST PASS'}</span>
                <span>2026</span>
              </div>
            </div>
            <div className="member-card__barcode" aria-hidden="true">
              {[2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 3].map((width, index) => (
                <i key={index} style={{ width }} />
              ))}
            </div>
            {!user && (
              <Link to="/login" className="member-card__cta">
                领取通行证 <ArrowUpRight size={16} />
              </Link>
            )}
            <span className="member-card__sticker">VOL.04<br />VALLEY</span>
          </div>
        </div>
      </section>

      <div className="container community-layout">
        <div className="community-main">
          <div className="community-toolbar">
            <div className="feed-tabs" role="tablist" aria-label="社区动态筛选">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'recommend'}
                className={activeTab === 'recommend' ? 'is-active' : ''}
                onClick={() => setActiveTab('recommend')}
              >
                推荐
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'latest'}
                className={activeTab === 'latest' ? 'is-active' : ''}
                onClick={() => setActiveTab('latest')}
              >
                最新
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'mine'}
                className={activeTab === 'mine' ? 'is-active' : ''}
                onClick={() => (user ? setActiveTab('mine') : requireAuth('查看自己的帖子'))}
              >
                我的
                {!user && <LockKeyhole size={12} />}
              </button>
            </div>
            <button
              type="button"
              className={`btn btn--dark btn--sm ${composerOpen ? 'is-ghost' : ''}`}
              onClick={() => (user ? setComposerOpen((value) => !value) : requireAuth('发帖'))}
            >
              {composerOpen ? <X size={16} /> : <PenLine size={16} />}
              {composerOpen ? '收起' : '发布帖子'}
            </button>
          </div>

          {activeTopic && (
            <div className="active-topic-bar">
              <span><span className="hash">#</span> 正在浏览「{activeTopic}」</span>
              <button type="button" onClick={() => setActiveTopic('')}>查看全部 <X size={14} /></button>
            </div>
          )}

          {!user && composerOpen && (
            <div className="composer-gate">
              <span><LockKeyhole size={20} /></span>
              <div>
                <strong>登录后就可以发帖了</strong>
                <p>和同好分享你的攻略、无料、找搭子，或者今天的心情。</p>
              </div>
              <Link to="/login" state={{ from: '/community', intent: '发帖' }} className="btn btn--dark btn--sm">
                登录 / 注册 <ArrowUpRight size={15} />
              </Link>
            </div>
          )}

          {user && composerOpen && (
            <form className="composer" onSubmit={submitPost}>
              <div className="composer__head">
                <span className={`avatar avatar--md avatar--${getAvatarTone(user.nickname)}`}>
                  {getInitials(user.nickname)}
                </span>
                <div>
                  <strong>{user.nickname}</strong>
                  <span>分享给山谷里的同好</span>
                </div>
                <span className="composer__badge">POST</span>
              </div>
              <input
                className="composer__title"
                type="text"
                maxLength="60"
                placeholder="给这条帖子起个标题…"
                value={draft.title}
                onChange={(event) => {
                  setDraft((current) => ({ ...current, title: event.target.value }))
                  setDraftError('')
                }}
              />
              <textarea
                className="composer__body"
                rows="4"
                maxLength="500"
                placeholder="想聊点什么？可以是一张无料草稿、一份逛展攻略，或一句“有人一起吗”。"
                value={draft.body}
                onChange={(event) => {
                  setDraft((current) => ({ ...current, body: event.target.value }))
                  setDraftError('')
                }}
              />
              <div className="composer__topics">
                <span>选择话题</span>
                {communityTopics.map((topic) => (
                  <button
                    key={topic.name}
                    type="button"
                    className={draft.topic === topic.name ? 'is-active' : ''}
                    onClick={() => setDraft((current) => ({ ...current, topic: topic.name }))}
                  >
                    # {topic.name}
                  </button>
                ))}
                <em>{draft.body.length} / 500</em>
              </div>
              {draftError && <p className="composer__error">{draftError}</p>}
              <div className="composer__foot">
                <span>发帖即表示同意《山谷社区公约》</span>
                <button type="submit" className="btn btn--dark">
                  发布到山谷 <Send size={16} />
                </button>
              </div>
            </form>
          )}

          <div className="feed">
            {filteredPosts.length === 0 ? (
              <div className="community-empty">
                <span>✳</span>
                <h3>这里还没有回声</h3>
                <p>{activeTab === 'mine' ? '你还没有发过帖子，要不要说第一句？' : '换一个话题看看，或者成为第一个发帖的人。'}</p>
                <button
                  type="button"
                  className="btn btn--dark btn--sm"
                  onClick={() => (activeTab === 'mine' || !activeTopic ? setComposerOpen(true) : setActiveTopic(''))}
                >
                  {user ? '写点什么' : '登录参与'}
                </button>
              </div>
            ) : (
              filteredPosts.map((post, index) => {
                const liked = user ? post.likedBy.includes(user.email) : false
                const isSaved = saved.includes(post.id)
                const commentsOpen = openComments[post.id]
                const visibleComments = commentsOpen ? post.comments : post.comments.slice(0, 2)
                return (
                  <Reveal as="article" className="post-card" delay={Math.min(index * 50, 200)} key={post.id}>
                    <div className="post-card__head">
                      <span className={`avatar avatar--md avatar--${getAvatarTone(post.author)}`}>
                        {getInitials(post.author)}
                      </span>
                      <div className="post-card__author">
                        <strong>{post.author}</strong>
                        <span>{post.role}</span>
                      </div>
                      <div className="post-card__meta">
                        <span className="post-card__topic"># {post.topic}</span>
                        <span>{formatRelativeTime(post.time)}</span>
                      </div>
                    </div>

                    <div className="post-card__content">
                      <h3>{post.title}</h3>
                      <p>{post.body}</p>
                    </div>

                    {post.art && (
                      <div className="post-card__art">
                        <ArtCover
                          variant={post.art.variant}
                          label={post.art.label}
                          accent={post.art.accent}
                        />
                      </div>
                    )}

                    <div className="post-card__actions">
                      <button
                        type="button"
                        className={`post-action ${liked ? 'is-active' : ''}`}
                        onClick={() => toggleLike(post.id)}
                        aria-pressed={liked}
                      >
                        <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                        {post.likes}
                      </button>
                      <button
                        type="button"
                        className={`post-action ${commentsOpen ? 'is-active' : ''}`}
                        onClick={() => setOpenComments((current) => ({ ...current, [post.id]: !current[post.id] }))}
                      >
                        <MessageCircle size={18} />
                        {post.comments.length}
                      </button>
                      <button
                        type="button"
                        className={`post-action post-action--save ${isSaved ? 'is-active' : ''}`}
                        onClick={() => toggleSaved(post.id)}
                        aria-label={isSaved ? '取消收藏' : '收藏帖子'}
                        aria-pressed={isSaved}
                      >
                        <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                      <span className="post-card__hint">
                        {user ? '在真实的山谷里，每条回声都会被看见' : '登录后即可点赞、收藏和评论'}
                      </span>
                    </div>

                    {(commentsOpen || post.comments.length > 0) && (
                      <div className="comments">
                        {post.comments.length > 2 && !commentsOpen && (
                          <button
                            type="button"
                            className="comments__more"
                            onClick={() => setOpenComments((current) => ({ ...current, [post.id]: true }))}
                          >
                            查看全部 {post.comments.length} 条评论
                          </button>
                        )}
                        {visibleComments.map((comment) => (
                          <div className="comment" key={comment.id}>
                            <span className={`avatar avatar--xs avatar--${getAvatarTone(comment.author)}`}>
                              {getInitials(comment.author)}
                            </span>
                            <div>
                              <div className="comment__head">
                                <strong>{comment.author}</strong>
                                <span>{formatRelativeTime(comment.time)}</span>
                              </div>
                              <p>{comment.body}</p>
                            </div>
                          </div>
                        ))}
                        {commentsOpen && (
                          <div className="comment-form">
                            {user ? (
                              <>
                                <span className={`avatar avatar--xs avatar--${getAvatarTone(user.nickname)}`}>
                                  {getInitials(user.nickname)}
                                </span>
                                <input
                                  type="text"
                                  value={commentDrafts[post.id] || ''}
                                  placeholder="留下一句温柔的回声…"
                                  onChange={(event) =>
                                    setCommentDrafts((current) => ({ ...current, [post.id]: event.target.value }))
                                  }
                                  onKeyDown={(event) => {
                                    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
                                      event.preventDefault()
                                      addComment(post.id)
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => addComment(post.id)}
                                  aria-label="发布评论"
                                >
                                  <Send size={16} />
                                </button>
                              </>
                            ) : (
                              <button type="button" className="comment-form__login" onClick={() => requireAuth('评论')}>
                                登录后参与讨论 <ArrowUpRight size={14} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </Reveal>
                )
              })
            )}
          </div>
        </div>

        <aside className="community-aside">
          {user ? (
            <Reveal className="profile-card">
              <div className="profile-card__top">
                <span className={`avatar avatar--xl avatar--${getAvatarTone(user.nickname)}`}>
                  {getInitials(user.nickname)}
                </span>
                <button type="button" className="profile-card__logout" onClick={() => { logout(); toast('已退出登录，山谷会记得你', 'default') }}>
                  退出
                </button>
              </div>
              <h3>{user.nickname}</h3>
              <p>{user.bio}</p>
              <div className="profile-card__stats">
                <div><strong>{myPosts.length}</strong><span>帖子</span></div>
                <div><strong>{myPosts.reduce((sum, post) => sum + post.likes, 0)}</strong><span>获赞</span></div>
                <div><strong>{saved.length}</strong><span>收藏</span></div>
              </div>
              <div className="profile-card__foot">
                <span>DAY {userSince}</span>
                <span>{user.email}</span>
              </div>
            </Reveal>
          ) : (
            <Reveal className="join-card">
              <StarMark className="join-card__star" />
              <span className="eyebrow"><i /> JOIN THE VALLEY</span>
              <h3>把“一个人喜欢”<br />变成“我们一起”。</h3>
              <p>登录后可以发帖、找搭子、收藏攻略，也会在开展前收到山谷提醒。</p>
              <Link to="/login" className="btn btn--dark btn--block">加入山谷 <ArrowUpRight size={16} /></Link>
              <small>已有账号？<Link to="/login">直接登录 →</Link></small>
            </Reveal>
          )}

          <Reveal className="aside-block" delay={80}>
            <div className="aside-block__head">
              <h3><TrendingUp size={16} /> 今日话题</h3>
              <span>TRENDING</span>
            </div>
            <div className="topic-list">
              {communityTopics.map((topic, index) => (
                <button
                  key={topic.name}
                  type="button"
                  className={`topic-row ${activeTopic === topic.name ? 'is-active' : ''}`}
                  onClick={() => {
                    setActiveTopic(activeTopic === topic.name ? '' : topic.name)
                    setActiveTab('recommend')
                    document.querySelector('.community-toolbar')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                >
                  <span className="topic-row__num">0{index + 1}</span>
                  <span className="topic-row__name"># {topic.name}</span>
                  <span className="topic-row__count">{topic.count}</span>
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal className="aside-block" delay={120}>
            <div className="aside-block__head">
              <h3><Users size={16} /> 此刻在山谷</h3>
              <span className="status-dot status-dot--lime" />
            </div>
            <div className="online-list">
              {onlinePeople.map((person) => (
                <div key={person.name}>
                  <span className={`avatar avatar--xs avatar--${person.tone}`}>{person.name.slice(0, 1)}</span>
                  <span>{person.name}</span>
                  <i />
                </div>
              ))}
            </div>
            <p className="aside-block__note">还有 2,043 位谷粒在线</p>
          </Reveal>

          <Reveal className="rules-card" delay={160}>
            <h3><ShieldCheck size={17} /> 山谷公约</h3>
            <ul>
              <li>尊重每一种喜欢，不评判别人的热爱。</li>
              <li>发图前先征得当事人同意，友善转载。</li>
              <li>不发布他人隐私、不进行私下交易。</li>
            </ul>
            <Link to="/about">了解更多社区准则 <ArrowUpRight size={14} /></Link>
          </Reveal>

          <div className="aside-countdown">
            <span><Flame size={15} /> 距离开展</span>
            <strong>{daysToEvent} <small>天</small></strong>
            <span>山谷正在变亮</span>
          </div>
        </aside>
      </div>

      <section className="container community-bottom">
        <div>
          <Sparkles size={22} />
          <h2>山谷的灯，为每一个想进来的人亮着。</h2>
          <p>无论你是第一次逛展，还是已经来了四年，这里都有一把椅子留给你。</p>
        </div>
        <Link to={user ? '/news' : '/login'} className="btn btn--lime btn--lg">
          {user ? '去看看最新情报' : '加入山谷社区'} <ArrowUpRight size={18} />
        </Link>
      </section>
    </div>
  )
}
