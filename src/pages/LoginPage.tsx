import { useState, useEffect, useRef } from 'react'

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>
  onClose: () => void
  error: string | null
  loading: boolean
}

export function LoginPage({ onLogin, onClose, error, loading }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onLogin(email, password)
  }

  const fillAdmin = () => {
    setEmail('admin@admin.com')
    setPassword('123456')
  }

  const fillChallenger = () => {
    setEmail('amigo@teste.com')
    setPassword('123456')
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20
                      rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display font-black text-2xl text-white">Entrar no Sistema</h2>
            <p className="text-white/40 text-sm mt-1">Alçapão — Reserva do Paratehy</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors p-2"
            aria-label="Fechar"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20
                          rounded-xl px-4 py-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/50 text-xs uppercase tracking-wider block mb-2">
              E-mail
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3
                           text-white placeholder-white/20 text-sm
                           focus:outline-none focus:border-tennis/50 focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-white/50 text-xs uppercase tracking-wider block mb-2">
              Senha
            </label>
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3
                           text-white placeholder-white/20 text-sm
                           focus:outline-none focus:border-tennis/50 focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-tennis to-emerald-400 text-navy-deep font-bold
                       rounded-xl py-3 flex items-center justify-center gap-2
                       hover:-translate-y-0.5 transition-all shadow-lg shadow-tennis/20
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <>
                Entrar no Sistema
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-white/30 text-xs text-center mb-3">Preenchimento rápido para testes</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={fillAdmin}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10
                         rounded-xl px-3 py-2.5 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0" />
              <span className="text-white/60 text-xs font-medium">Perfil ADMIN</span>
            </button>
            <button
              onClick={fillChallenger}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10
                         rounded-xl px-3 py-2.5 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-tennis shrink-0" />
              <span className="text-white/60 text-xs font-medium">Perfil Amigo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
