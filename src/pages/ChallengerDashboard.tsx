import { useState, useEffect, useCallback } from 'react'
import type { TennisSlot, User } from '@/types'
import { tennisSlotService } from '@/services/tennisSlotService'
import { formatDateShort } from '@/utils/formatters'

interface ChallengerDashboardProps {
  user: User
  onToast: (message: string, type: 'success' | 'error') => void
}

const LEVELS = ['Todos os Níveis', 'Iniciante', 'Intermediário', 'Avançado']

export function ChallengerDashboard({ user, onToast }: ChallengerDashboardProps) {
  const [slots, setSlots] = useState<TennisSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [levelFilter, setLevelFilter] = useState('Todos os Níveis')
  const [statusFilter, setStatusFilter] = useState('all')
  const [bookingSlotId, setBookingSlotId] = useState<number | null>(null)
  const [challengerName, setChallengerName] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

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

  const filtered = slots.filter((s) => {
    const matchLevel = levelFilter === 'Todos os Níveis' || s.level === levelFilter
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'available' && s.status === 'available') ||
      (statusFilter === 'booked' && s.status === 'booked')
    return matchLevel && matchStatus
  })

  const handleBook = async (slot: TennisSlot) => {
    if (!challengerName.trim()) {
      onToast('Informe seu nome ou apelido.', 'error')
      return
    }
    setBookingLoading(true)
    try {
      await tennisSlotService.book(slot.id, challengerName.trim())
      onToast('Vaga garantida! Boa partida! 🎾', 'success')
      setBookingSlotId(null)
      setChallengerName('')
      loadSlots()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      onToast(msg ?? 'Erro ao garantir vaga.', 'error')
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-6 backdrop-blur-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display font-black text-2xl text-white flex items-center gap-3">
              🏆 Garanta seu Desafio no Saibro
            </h1>
            <p className="text-white/40 text-sm mt-1">
              Olá, <span className="text-white/70">{user.name}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20
                          rounded-xl px-4 py-2">
            <span className="text-lg">🔥</span>
            <span className="text-orange-400 text-sm font-medium">Quem garantir primeiro joga</span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm
                     focus:outline-none focus:border-tennis/50 transition-all"
        >
          {LEVELS.map((l) => (
            <option key={l} value={l} className="bg-navy-deep">{l}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm
                     focus:outline-none focus:border-tennis/50 transition-all"
        >
          <option value="all" className="bg-navy-deep">Todas as Vagas</option>
          <option value="available" className="bg-navy-deep">Disponíveis (Abertas)</option>
          <option value="booked" className="bg-navy-deep">Garantidos (Ocupadas)</option>
        </select>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-white/10 rounded mb-4 w-1/2" />
              <div className="h-10 bg-white/10 rounded mb-3" />
              <div className="h-4 bg-white/10 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
          <svg className="w-10 h-10 text-white/20 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-white/40">Nenhum horário correspondente encontrado.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((slot) => (
            <SlotCard
              key={slot.id}
              slot={slot}
              isBookingOpen={bookingSlotId === slot.id}
              challengerName={challengerName}
              bookingLoading={bookingLoading}
              onOpenBooking={() => { setBookingSlotId(slot.id); setChallengerName('') }}
              onCloseBooking={() => setBookingSlotId(null)}
              onChangeName={setChallengerName}
              onBook={handleBook}
            />
          ))}
        </div>
      )}

      {/* Footer educativo */}
      <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
        <span className="text-xl">✨</span>
        <p className="text-white/40 text-sm">
          Precisou cancelar? Avise o coordenador diretamente para liberar a vaga para outros desafiantes.
        </p>
      </div>
    </div>
  )
}

interface SlotCardProps {
  slot: TennisSlot
  isBookingOpen: boolean
  challengerName: string
  bookingLoading: boolean
  onOpenBooking: () => void
  onCloseBooking: () => void
  onChangeName: (name: string) => void
  onBook: (slot: TennisSlot) => void
}

function SlotCard({
  slot,
  isBookingOpen,
  challengerName,
  bookingLoading,
  onOpenBooking,
  onCloseBooking,
  onChangeName,
  onBook,
}: SlotCardProps) {
  const isBooked = slot.status === 'booked'

  return (
    <div className={`relative rounded-3xl p-5 border backdrop-blur-sm transition-all
                     ${isBooked
                       ? 'bg-orange-500/5 border-orange-500/20'
                       : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]'}`}>
      {/* Status badge */}
      <div className="absolute top-4 right-4">
        {isBooked ? (
          <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-2.5 py-1 rounded-full border border-orange-500/30">
            🛡️ Garantido
          </span>
        ) : (
          <span className="flex items-center gap-1 bg-tennis/20 text-tennis text-xs font-bold px-2.5 py-1
                           rounded-full border border-tennis/30">
            <span className="w-1.5 h-1.5 rounded-full bg-tennis animate-pulse" />
            Aberto
          </span>
        )}
      </div>

      <p className="text-white/40 text-xs uppercase tracking-wider mb-1 pr-24">{slot.court}</p>
      <p className="font-display font-bold text-2xl text-white mb-1">
        {formatDateShort(slot.date)} — {slot.time}
      </p>
      <p className="text-tennis text-sm font-medium mb-3">{slot.level}</p>

      {slot.notes && (
        <div className="bg-white/5 border border-white/5 rounded-xl p-3 mb-4">
          <p className="text-white/50 text-xs italic leading-relaxed">{slot.notes}</p>
        </div>
      )}

      {isBooked ? (
        <div className="flex items-center gap-2 mt-2">
          <svg className="w-4 h-4 text-orange-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <div>
            <p className="text-orange-400 text-sm font-semibold">{slot.challenger_name}</p>
            <span className="text-xs text-orange-400/60">Confirmado</span>
          </div>
        </div>
      ) : isBookingOpen ? (
        <div className="mt-2 space-y-2">
          <input
            type="text"
            value={challengerName}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder="Seu nome no desafio..."
            autoFocus
            className="w-full bg-white/5 border border-tennis/30 rounded-xl px-3 py-2.5 text-white text-sm
                       placeholder-white/20 focus:outline-none focus:border-tennis transition-all"
          />
          <div className="flex gap-2">
            <button
              onClick={() => onBook(slot)}
              disabled={bookingLoading}
              className="flex-1 bg-tennis text-navy-deep font-bold rounded-xl py-2.5 text-sm
                         hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-1"
            >
              {bookingLoading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : 'Confirmar'}
            </button>
            <button
              onClick={onCloseBooking}
              className="px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60
                         rounded-xl text-sm transition-all"
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={onOpenBooking}
          className="w-full mt-2 bg-tennis/10 hover:bg-tennis/20 text-tennis border border-tennis/20
                     rounded-xl py-2.5 font-semibold text-sm transition-all hover:-translate-y-0.5
                     flex items-center justify-center gap-2"
        >
          <span className="animate-pulse">🔥</span>
          Aceitar Desafio
        </button>
      )}
    </div>
  )
}
