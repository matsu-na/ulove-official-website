export function getAvatarTone(name = '') {
  const tones = ['lime', 'violet', 'coral', 'sky', 'yellow', 'pink']
  let total = 0
  for (const char of name) total += char.codePointAt(0)
  return tones[total % tones.length]
}

export function getInitials(name = '') {
  const trimmed = name.trim()
  if (!trimmed) return '谷'
  return trimmed.slice(0, 2)
}

export function formatRelativeTime(timestamp) {
  const diff = Math.max(0, Date.now() - timestamp)
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes} 分钟前`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} 小时前`
  return `${Math.floor(hours / 24)} 天前`
}

export function countdownTo(target) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now())
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}
