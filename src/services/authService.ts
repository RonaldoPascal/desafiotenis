import api from './api'
import type { User } from '@/types'

interface LoginResponse {
  data: User
  token: string
  message: string
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/login', { email, password })
    return data
  },

  async logout(): Promise<void> {
    await api.post('/logout')
  },

  async me(): Promise<User> {
    const { data } = await api.get<{ data: User }>('/me')
    return data.data
  },
}
