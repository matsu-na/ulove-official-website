import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { api } from '../api.js'
import { StarMark } from '../components/Logo.jsx'

const ContentContext = createContext(null)

function BootScreen({ error, onRetry }) {
  return (
    <div className="boot-screen">
      <div className="boot-screen__grid" aria-hidden="true" />
      <div className="boot-screen__mark"><StarMark /></div>
      <span className="eyebrow"><i /> YOUGU EXPO / VALLEY SERVER</span>
      {error ? (
        <>
          <h1>山谷暂时没有回应。</h1>
          <p>{error}</p>
          <div className="boot-screen__actions">
            <button type="button" className="btn btn--dark" onClick={onRetry}>
              <RefreshCw size={16} /> 重新连接
            </button>
            <a href="/" className="btn btn--ghost">刷新首页</a>
          </div>
        </>
      ) : (
        <>
          <h1>正在打开山谷…</h1>
          <p>从模拟后端加载展会内容与社区数据。</p>
          <span className="boot-screen__loader" aria-hidden="true" />
        </>
      )}
    </div>
  )
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setError('')
    try {
      const data = await api.get('/content')
      setContent(data)
    } catch (requestError) {
      setError(requestError.message || '内容加载失败')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (error) return <BootScreen error={error} onRetry={load} />
  if (!content) return <BootScreen onRetry={load} />

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}

export function useContent() {
  const context = useContext(ContentContext)
  if (!context) throw new Error('useContent must be used inside ContentProvider')
  return context
}
