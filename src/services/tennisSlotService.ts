import api from './api'
import type { TennisSlot } from '@/types'

interface SlotsResponse {
  data: TennisSlot[]
}

interface SlotResponse {
  data: TennisSlot
  message: string
}

export interface CreateSlotPayload {
  date: string
  time: string
  court: string
  level: string
  notes?: string
}

export const tennisSlotService = {
  async getPublic(): Promise<TennisSlot[]> {
    const { data } = await api.get<SlotsResponse>('/slots/public')
    return data.data
  },

  async getAll(filters?: { level?: string; status?: string }): Promise<TennisSlot[]> {
    const { data } = await api.get<SlotsResponse>('/slots', { params: filters })
    return data.data
  },

  async create(payload: CreateSlotPayload): Promise<TennisSlot> {
    const { data } = await api.post<SlotResponse>('/slots', payload)
    return data.data
  },

  async book(slotId: number, challengerName: string): Promise<TennisSlot> {
    const { data } = await api.post<SlotResponse>(`/slots/${slotId}/book`, {
      challenger_name: challengerName,
    })
    return data.data
  },

  async release(slotId: number): Promise<TennisSlot> {
    const { data } = await api.patch<SlotResponse>(`/slots/${slotId}/release`)
    return data.data
  },

  async delete(slotId: number): Promise<void> {
    await api.delete(`/slots/${slotId}`)
  },
}
