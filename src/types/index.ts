export type SlotStatus = 'available' | 'booked'

export type SlotLevel = 'Qualquer Nível' | 'Iniciante' | 'Intermediário' | 'Avançado'

export type UserRole = 'admin' | 'challenger'

export interface TennisSlot {
  id: number
  date: string
  time: string
  court: string
  level: SlotLevel
  notes: string | null
  status: SlotStatus
  challenger_name: string | null
  created_at: string
}

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

export interface StatsData {
  available: number
  booked: number
  total: number
  occupancy: number
}
