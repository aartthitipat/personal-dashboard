const COLOR_MAP = {
  blue:    { bg: 'bg-blue-50',    text: 'text-blue-600',    ring: 'ring-blue-100' },
  purple:  { bg: 'bg-purple-50',  text: 'text-purple-600',  ring: 'ring-purple-100' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   ring: 'ring-amber-100' },
}

export default function KPICard({ label, value, sub, icon: Icon, color = 'blue' }) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.blue

  return (
    <div className="card p-5 flex items-start gap-4 hover:shadow-card-hover transition-shadow duration-200">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ring-1 ${c.bg} ${c.text} ${c.ring}`}>
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
          {label}
        </p>
        <p className="text-[1.6rem] font-bold text-slate-800 font-mono tabular-nums leading-none truncate">
          {value}
        </p>
        {sub && (
          <p className="text-slate-400 text-xs mt-1.5">{sub}</p>
        )}
      </div>
    </div>
  )
}
