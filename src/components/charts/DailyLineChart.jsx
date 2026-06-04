import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

function tickFmt(v) {
  if (v >= 1_000_000) return `฿${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1_000)     return `฿${(v / 1_000).toFixed(0)}k`
  return `฿${v}`
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-900 text-white text-xs px-3.5 py-2.5 rounded-xl shadow-xl border border-white/10">
      <p className="font-semibold mb-1 text-slate-300">{label}</p>
      <p className="font-mono text-white">
        ฿{Number(payload[0].value).toLocaleString('th-TH', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
    </div>
  )
}

export default function DailyLineChart({ transactions }) {
  const data = useMemo(() => {
    const daily = {}
    transactions.forEach(t => {
      daily[t.date] = (daily[t.date] || 0) + Number(t.amount)
    })
    return Object.entries(daily)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, total]) => ({
        date: date.slice(5),
        total: Math.round(total * 100) / 100,
      }))
  }, [transactions])

  if (!data.length) {
    return (
      <div className="h-full flex items-center justify-center text-slate-300 text-sm">
        No data for this period
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'Plus Jakarta Sans' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'DM Mono' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={tickFmt}
          width={52}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="total"
          stroke="#3B82F6"
          strokeWidth={2.5}
          fill="url(#blueGrad)"
          dot={{ r: 3, fill: '#3B82F6', strokeWidth: 0 }}
          activeDot={{ r: 5, fill: '#2563EB', strokeWidth: 0, className: 'drop-shadow' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
