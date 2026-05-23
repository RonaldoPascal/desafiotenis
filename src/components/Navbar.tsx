import type { User } from '@/types'

interface NavbarProps {
  user: User | null
  onLoginClick: () => void
  onLogout: () => void
  onGoToDashboard: () => void
  currentPage: string
}

export function Navbar({ user, onLoginClick, onLogout, onGoToDashboard, currentPage }: NavbarProps) {
  return (
    <nav className="sticky top-4 z-50 mx-4">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between
                      backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl">
        <button
          onClick={onGoToDashboard}
          className="flex items-center gap-3 hover:scale-105 transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-tennis to-yellow-300
                          flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
              <circle cx="12" cy="12" r="10" fill="#0b1329" />
              <path d="M2 12 Q7 7 12 12 Q17 17 22 12" stroke="#D4FC34" strokeWidth="1.5" fill="none" />
              <path d="M12 2 Q7 7 12 12 Q17 7 12 2" stroke="#D4FC34" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          <div className="text-left">
            <p className="font-display font-extrabold text-sm leading-none tracking-wider text-white">
              TÊNIS NO <span className="text-tennis">ALÇAPÃO</span>
            </p>
            <p className="text-white/50 text-xs uppercase tracking-widest mt-0.5">
              Condomínio Reserva do Paratehy
            </p>
          </div>
        </button>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10
                              rounded-xl px-3 py-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/80 text-sm font-medium">
                  {user.role === 'admin' ? 'Coordenador ADM' : 'Desafiante'}
                </span>
              </div>
              {currentPage !== 'admin' && currentPage !== 'challenger' && (
                <button
                  onClick={onGoToDashboard}
                  className="bg-tennis/20 hover:bg-tennis/30 text-tennis border border-tennis/30
                             rounded-xl px-4 py-2 text-sm font-semibold transition-all"
                >
                  Meu Painel
                </button>
              )}
              <button
                onClick={onLogout}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20
                           rounded-xl px-4 py-2 text-sm font-semibold transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
              </button>
            </>
          ) : (
            <button
              onClick={onLoginClick}
              className="bg-gradient-to-r from-tennis to-emerald-400 text-navy-deep font-bold
                         rounded-xl px-5 py-2.5 text-sm hover:-translate-y-0.5 transition-all
                         shadow-lg shadow-tennis/20 hover:shadow-tennis/40"
            >
              Acessar Painel / Login
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
