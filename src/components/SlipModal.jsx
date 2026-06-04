import { useEffect } from 'react'
import { X, ExternalLink, ImageOff } from 'lucide-react'

export default function SlipModal({ url, onClose }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <p className="font-semibold text-slate-800 text-sm">Bank Slip</p>
          <div className="flex items-center gap-1">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
              title="Open full size"
            >
              <ExternalLink size={15} />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="p-4 bg-slate-50 max-h-[72vh] overflow-auto">
          <img
            src={url}
            alt="Bank slip"
            className="w-full rounded-xl object-contain"
            onError={e => {
              e.target.replaceWith(
                Object.assign(document.createElement('div'), {
                  className: 'h-48 flex flex-col items-center justify-center gap-2 text-slate-400 text-sm',
                  innerHTML: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg><p>Image unavailable</p>',
                })
              )
            }}
          />
        </div>
      </div>
    </div>
  )
}
