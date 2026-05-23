import { useState, useCallback } from 'react'
import { Navbar } from '@/components/Navbar'
import { Toast } from '@/components/Toast'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { AdminDashboard } from '@/pages/AdminDashboard'
import { ChallengerDashboard } from '@/pages/ChallengerDashboard'
import { useAuth } from '@/hooks/useAuth'

type Page = 'landing' | 'admin' | 'challenger'

interface ToastState {
  message: string
  type: 'success' | 'error'
}

export default function App() {
  const { user, isAuthenticated, isAdmin, login, logout } = useAuth()

  const [page, setPage] = useState<Page>(() => {
    if (!localStorage.getItem('token')) return 'landing'
    const stored = localStorage.getItem('user')
    if (!stored) return 'landing'
    try {
      const u = JSON.parse(stored)
      return u.role === 'admin' ? 'admin' : 'challenger'
    } catch {
      return 'landing'
    }
  })

  const [showLogin, setShowLogin] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [loginLoading, setLoginLoading] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type })
  }, [])

  const handleLogin = async (email: string, password: string) => {
    setLoginLoading(true)
    setLoginError(null)
    try {
      const loggedUser = await login(email, password)
      setShowLogin(false)
      setPage(loggedUser.role === 'admin' ? 'admin' : 'challenger')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setLoginError(msg ?? 'Credenciais inválidas. Verifique e-mail e senha.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    setPage('landing')
  }

  const handleGoToDashboard = () => {
    if (!isAuthenticated) {
      setPage('landing')
      return
    }
    setPage(isAdmin ? 'admin' : 'challenger')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-deep via-clay-dark to-navy-deep">
      <div className="fixed top-0 left-0 w-96 h-96 bg-tennis/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-clay/5 rounded-full blur-3xl pointer-events-none" />

      <Navbar
        user={user}
        currentPage={page}
        onLoginClick={() => { setShowLogin(true); setLoginError(null) }}
        onLogout={handleLogout}
        onGoToDashboard={handleGoToDashboard}
      />

      <main className="pt-4">
        {page === 'landing' && (
          <LandingPage onLoginClick={() => { setShowLogin(true); setLoginError(null) }} />
        )}
        {page === 'admin' && user && (
          <AdminDashboard user={user} onToast={showToast} />
        )}
        {page === 'challenger' && user && (
          <ChallengerDashboard user={user} onToast={showToast} />
        )}
      </main>

      {showLogin && (
        <LoginPage
          onLogin={handleLogin}
          onClose={() => { setShowLogin(false); setLoginError(null) }}
          error={loginError}
          loading={loginLoading}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
