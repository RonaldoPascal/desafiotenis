import { useState, useEffect, useCallback } from 'react'
import type { TennisSlot, User } from '@/types'
import { tennisSlotService, type CreateSlotPayload } from '@/services/tennisSlotService'
import { StatsCard } from '@/components/StatsCard'
import { formatDateShort } from '@/utils/formatters'

interface AdminDashboardProps {
  user: User
  onToast: (message: string, type: 'success' | 'error') => void
}

const COURTS = ['Alçapão Central (Saibro)', 'Quadra Anexa 02 (Rápida)']
const LEVELS = ['Qualquer Nível', 'Iniciante', 'Intermediário', 'Avançado']
const MAX_AVAILABLE = 4

const today = new Date().toISOString().split('T')[0]

export function AdminDashboard({ user, onToast }: AdminDashboardProps) {
  const [slots, setSlots] = useState<TennisSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formMsg, setFormMsg] = useState<{ text: string; type: 'error' | 'warning' | 'success' } | null>(null)

  const [form, setForm] = useState<CreateSlotPayload>({
    date: today,
    time: '09:00',
    court: COURTS[0],
    level: LEVELS[0],
    notes: '',
  })

  const loadSlots = useCallback(async () => {
    try {
      const data = await tennisSlotService.getAll()
      setSlots(data)
    } catch {
      onToast('Erro ao carregar horários.', 'error')
    } finally {
      setLoading(false)
    }
  }, [onToast])

  useEffect(() => { loadSlots() }, [loadSlots])

  const available = slots.filter((s) => s.status === 'available').length
  const booked = slots.filter((s) => s.status === 'booked').length
  const occupancy = slots.length > 0 ? Math.round((booked / slots.length) * 100) : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (available >= MAX_AVAILABLE) {
      setFormMsg({ text: `Limite de ${MAX_AVAILABLE} horários disponíveis atingido. Aguarde confirmações.`, type: 'warning' })
      return
    }
    setSubmitting(true)
    setFormMsg(null)
    try {
      await tennisSlotService.create(form)
      setFormMsg({ text: 'Horário cadastrado com sucesso!', type: 'success' })
      setForm({ date: today, time: '09:00', court: COURTS[0], level: LEVELS[0], notes: '' })
      loadSlots()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setFormMsg({ text: msg ?? 'Erro ao cadastrar horário.', type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleRelease = async (slot: TennisSlot) => {
    try {
      await tennisSlotService.release(slot.id)
      onToast('Vaga liberada com sucesso.', 'success')
      loadSlots()
    } catch {
      onToast('Erro ao liberar vaga.', 'error')
    }
  }

  const handleDelete = async (slot: TennisSlot) => {
    try {
      await tennisSlotService.delete(slot.id)
      onToast('Horário removido.', 'success')
      loadSlots()
    } catch {
      onToast('Erro ao remover horário.', 'error')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-6 backdrop-blur-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display font-black text-2xl text-white flex items-center gap-3">
              <svg className="w-6 h-6 text-tennis" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Painel do Administrador
            </h1>
            <p className="text-white/40 text-sm mt-1">Olá, <span className="text-white/70">{user.name}</span></p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20
                          rounded-xl px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-sm font-medium">Modo Coordenação Geral</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <StatsCard value={slots.length} label="Total de Rodadas" />
          <StatsCard value={`${booked} / ${slots.length}`} label="Jogos Confirmados" color="clay" />
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="font-display font-black text-3xl text-tennis">{occupancy}%</p>
            <p className="text-white/50 text-xs mt-1 uppercase tracking-wider">Taxa de Ocupação</p>
            <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-tennis to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${occupancy}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Formulário */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl h-fit">
          <h2 className="font-display font-bold text-lg text-white mb-4">Cadastrar Horário</h2>

          <div className={`flex items-center gap-2 rounded-xl px-4 py-3 mb-4 text-sm
                           ${available >= MAX_AVAILABLE
                             ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400'
                             : 'bg-white/5 border border-white/10 text-white/50'}`}>
            <span className="font-bold">{available} / {MAX_AVAILABLE}</span>
            <span>vagas abertas recomendadas</span>
          </div>

          {formMsg && (
            <div className={`flex items-center gap-2 rounded-xl px-4 py-3 mb-4 text-sm border
                             ${formMsg.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                               formMsg.type === 'warning' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                               'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
              {formMsg.type === 'success' && <span className="animate-bounce">✓</span>}
              {formMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-white/40 text-xs uppercase tracking-wider block mb-1.5">Data</label>
                <input
                  type="date"
                  min={today}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm
                             focus:outline-none focus:border-tennis/50 transition-all"
                />
              </div>
              <div>
                <label className="text-white/40 text-xs uppercase tracking-wider block mb-1.5">Horário</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm
                             focus:outline-none focus:border-tennis/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider block mb-1.5">Nível</label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm
                           focus:outline-none focus:border-tennis/50 transition-all"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l} className="bg-navy-deep">{l}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider block mb-1.5">Quadra</label>
              <select
                value={form.court}
                onChange={(e) => setForm({ ...form, court: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm
                           focus:outline-none focus:border-tennis/50 transition-all"
              >
                {COURTS.map((c) => (
                  <option key={c} value={c} className="bg-navy-deep">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-white/40 text-xs uppercase tracking-wider block mb-1.5">Observações</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                placeholder="Ex: Jogo de simples, traga tubinho de bolas novo..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm
                           placeholder-white/20 resize-none
                           focus:outline-none focus:border-tennis/50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || available >= MAX_AVAILABLE}
              className="w-full bg-tennis text-navy-deep font-bold rounded-xl py-3 flex items-center
                         justify-center gap-2 hover:-translate-y-0.5 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {submitting ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Inserir Horário
                </>
              )}
            </button>
          </form>
        </div>

        {/* Tabela */}
        <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-white">Agenda Completa</h2>
            <span className="bg-white/10 text-white/60 text-xs px-3 py-1 rounded-full">
              {slots.length} horários
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🎾</p>
              <p className="text-white/40 text-sm">Nenhum horário cadastrado no Alçapão.</p>
              <p className="text-white/20 text-xs mt-1">Use o formulário ao lado para adicionar.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-white/50 text-xs uppercase tracking-wider pb-3">Data & Hora</th>
                    <th className="text-left text-white/50 text-xs uppercase tracking-wider pb-3">Nível / Quadra</th>
                    <th className="text-left text-white/50 text-xs uppercase tracking-wider pb-3">Desafiante</th>
                    <th className="text-right text-white/50 text-xs uppercase tracking-wider pb-3">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {slots.map((slot) => (
                    <SlotRow
                      key={slot.id}
                      slot={slot}
                      onRelease={handleRelease}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SlotRow({
  slot,
  onRelease,
  onDelete,
}: {
  slot: TennisSlot
  onRelease: (s: TennisSlot) => void
  onDelete: (s: TennisSlot) => void
}) {
  return (
    <tr className="hover:bg-white/5 transition-colors">
      <td className="py-3 pr-4">
        <p className="text-white font-medium text-sm">
          🕐 {formatDateShort(slot.date)} — {slot.time}
        </p>
      </td>
      <td className="py-3 pr-4">
        <p className="text-tennis text-sm font-medium">{slot.level}</p>
        <p className="text-white/40 text-xs">{slot.court}</p>
      </td>
      <td className="py-3 pr-4">
        {slot.status === 'booked' && slot.challenger_name ? (
          <div>
            <p className="text-orange-400 text-sm font-medium">⚔️ {slot.challenger_name}</p>
            <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
              Confirmado
            </span>
          </div>
        ) : (
          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
            Aberto
          </span>
        )}
      </td>
      <td className="py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          {slot.status === 'booked' && (
            <button
              onClick={() => onRelease(slot)}
              title="Liberar vaga"
              className="p-1.5 bg-tennis/10 hover:bg-tennis/20 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 text-tennis" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" />
              </svg>
            </button>
          )}
          <button
            onClick={() => onDelete(slot)}
            title="Excluir horário"
            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  )
}
