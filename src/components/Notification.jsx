import { useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'

export default function Notification({ type, message }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Defer to next frame so the transition animates from hidden → visible
    const id = requestAnimationFrame(() => setShow(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const success = type === 'success'

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ease-out ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}
    >
      <div
        className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-xl min-w-[260px] max-w-sm border bg-white ${
          success ? 'border-emerald-100' : 'border-red-100'
        }`}
      >
        <div className={`shrink-0 ${success ? 'text-emerald-500' : 'text-red-400'}`}>
          {success
            ? <CheckCircle2 size={18} />
            : <AlertCircle size={18} />
          }
        </div>
        <p className="text-sm font-semibold text-slate-700 flex-1">{message}</p>

        {/* Auto-drain progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl overflow-hidden">
          <div
            className={`h-full ${success ? 'bg-emerald-400' : 'bg-red-400'} animate-[drain_4.5s_linear_forwards]`}
            style={{ animationName: 'drain' }}
          />
        </div>
      </div>

      <style>{`
        @keyframes drain {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  )
}
