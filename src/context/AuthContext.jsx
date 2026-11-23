import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authStore } from '../auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authStore.currentUser)

  useEffect(() => {
    return authStore.subscribe(() => setUser(authStore.currentUser))
  }, [])

  const login = useCallback((credentials) => {
    const nextUser = authStore.login(credentials)
    setUser(nextUser)
    return nextUser
  }, [])

  const register = useCallback((payload) => {
    const nextUser = authStore.register(payload)
    setUser(nextUser)
    return nextUser
  }, [])

  const logout = useCallback(() => {
    authStore.logout()
    setUser(null)
  }, [])

  const updateProfile = useCallback((patch) => {
    const nextUser = authStore.updateProfile(patch)
    setUser(nextUser)
    return nextUser
  }, [])

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, register, logout, updateProfile }),
    [user, login, register, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
