import { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    if (type === 'success') {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [type, onClose])

  const isSuccess = type === 'success'

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl
                     border shadow-2xl backdrop-blur-xl transition-all animate-in slide-in-from-bottom-4
                     ${isSuccess
                       ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                       : 'bg-red-500/20 border-red-500/30 text-red-300'}`}>
      {isSuccess ? (
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      ) : (
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      )}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
