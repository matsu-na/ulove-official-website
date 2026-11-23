import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import News from './pages/News.jsx'
import NewsDetail from './pages/NewsDetail.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Community from './pages/Community.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function RouteMeta() {
  const { pathname } = useLocation()
  useEffect(() => {
    const titles = {
      '/': '有谷漫展 YOUGU EXPO · 把热爱聚成山谷',
      '/news': '山谷情报站 · 有谷漫展',
      '/about': '关于我们 · 有谷漫展',
      '/contact': '联系我们 · 有谷漫展',
      '/community': '山谷社区 · 有谷漫展',
      '/login': '登录 / 注册 · 有谷漫展',
    }
    if (titles[pathname]) document.title = titles[pathname]
    else if (pathname.startsWith('/news/')) document.title = '山谷情报站 · 有谷漫展'
    else document.title = '页面走丢了 · 有谷漫展'
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <RouteMeta />
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <Navbar />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/community" element={<Community />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
