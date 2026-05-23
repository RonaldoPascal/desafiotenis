import { useState, useEffect } from 'react'
import type { TennisSlot } from '@/types'
import { tennisSlotService } from '@/services/tennisSlotService'
import { StatsCard } from '@/components/StatsCard'
import { formatDateShort } from '@/utils/formatters'

interface LandingPageProps {
  onLoginClick: () => void
}

export function LandingPage({ onLoginClick }: LandingPageProps) {
  const [slots, setSlots] = useState<TennisSlot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    tennisSlotService.getPublic()
      .then(setSlots)
      .catch(() => setSlots([]))
      .finally(() => setLoading(false))
  }, [])

  const available = slots.filter((s) => s.status === 'available').length
  const booked = slots.filter((s) => s.status === 'booked').length

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Hero */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h1 className="font-display font-black text-4xl lg:text-6xl text-white leading-tight mb-6">
              Desafie seus limites no{' '}
              <span className="bg-gradient-to-r from-tennis to-emerald-400 bg-clip-text text-transparent">
                Alçapão
              </span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed mb-8">
              Venha desafiar a temida <span className="text-tennis font-bold">MACHADINHA</span> do Ronaldo Pitch
              no ALÇAPÃO!!! É como jogar no{' '}
              <span className="text-orange-400 font-semibold">'La Bombonera'</span>,
              pressão do começo ao fim! Venha preparado!!! Play!
            </p>

            <div className="grid grid-cols-3 gap-3 mb-8">
              <StatsCard value={loading ? '—' : available} label="Horários Livres" color="tennis" />
              <StatsCard value={loading ? '—' : booked} label="Confirmados" color="clay" />
              <StatsCard value="Saibro" label="Tipo de Piso" />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-xl">✨</span>
              <div>
                <p className="text-white/80 text-sm font-medium">Quadra irrigada recentemente</p>
                <p className="text-white/40 text-xs">Iluminação completa para jogos noturnos</p>
              </div>
            </div>
          </div>

          {/* Imagem da quadra */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-tennis/5 rounded-3xl blur-2xl
                            group-hover:bg-tennis/10 transition-all duration-500" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10
                            backdrop-blur-sm bg-white/5 aspect-[4/3]">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br
                              from-clay-dark/80 to-navy-deep/80">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🎾</div>
                  <p className="text-white/40 text-sm">Alçapão Central — Saibro</p>
                  <p className="text-white/20 text-xs mt-1">Condomínio Reserva do Paratehy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista pública de partidas */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-5 h-5 text-tennis" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h2 className="font-display font-bold text-xl text-white">Próximas Partidas Liberadas</h2>
            <span className="text-white/40 text-sm">Visualização pública</span>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 animate-pulse">
                  <div className="h-4 bg-white/10 rounded mb-3" />
                  <div className="h-8 bg-white/10 rounded mb-2" />
                  <div className="h-4 bg-white/10 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
              <p className="text-4xl mb-3">🎾</p>
              <p className="text-white/40">Nenhum horário disponível no momento.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {slots.map((slot) => (
                <PublicSlotCard key={slot.id} slot={slot} />
              ))}
            </div>
          )}
        </div>

        {/* CTA Login */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <p className="text-white/60 mb-4">Quer garantir sua vaga ou gerenciar os horários?</p>
            <button
              onClick={onLoginClick}
              className="bg-gradient-to-r from-tennis to-emerald-400 text-navy-deep font-bold
                         rounded-xl px-8 py-3 hover:-translate-y-1 transition-all
                         shadow-lg shadow-tennis/20 hover:shadow-tennis/40"
            >
              Entrar no Sistema
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PublicSlotCard({ slot }: { slot: TennisSlot }) {
  const isBooked = slot.status === 'booked'
  return (
    <div className={`relative bg-white/5 border rounded-2xl p-4 backdrop-blur-sm
                     ${isBooked ? 'border-orange-500/20 bg-orange-500/5' : 'border-white/10'}`}>
      <div className="absolute top-3 right-3">
        {isBooked ? (
          <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-2 py-1 rounded-full border border-orange-500/30">
            🛡️ Garantido
          </span>
        ) : (
          <span className="bg-tennis/20 text-tennis text-xs font-bold px-2 py-1 rounded-full border border-tennis/30">
            🎾 Disponível
          </span>
        )}
      </div>
      <p className="text-white/50 text-xs uppercase tracking-wider mb-1">{slot.court}</p>
      <p className="font-display font-bold text-xl text-white mb-1">
        {formatDateShort(slot.date)} — {slot.time}
      </p>
      <p className="text-tennis text-xs font-medium mb-2">{slot.level}</p>
      {slot.notes && (
        <p className="text-white/40 text-xs italic border-t border-white/5 pt-2 mt-2 line-clamp-2">
          {slot.notes}
        </p>
      )}
      {isBooked && slot.challenger_name && (
        <p className="text-orange-400 text-xs font-medium mt-2">
          ⚔️ vs {slot.challenger_name}
        </p>
      )}
    </div>
  )
}
