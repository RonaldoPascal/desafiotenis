import { useState, useCallback } from 'react'
import { authService } from '@/services/authService'
import type { User } from '@/types'

function loadFromStorage(): { user: User | null; token: string | null } {
  try {
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')
    const user = userStr ? (JSON.parse(userStr) as User) : null
    return { token, user }
  } catch {
    return { token: null, user: null }
  }
}

export function useAuth() {
  const stored = loadFromStorage()
  const [user, setUser] = useState<User | null>(stored.user)
  const [token, setToken] = useState<string | null>(stored.token)

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login(email, password)
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.data))
    setToken(response.token)
    setUser(response.data)
    return response.data
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
    }
  }, [])

  const isAdmin = user?.role === 'admin'
  const isAuthenticated = !!token && !!user

  return { user, token, isAuthenticated, isAdmin, login, logout }
}
