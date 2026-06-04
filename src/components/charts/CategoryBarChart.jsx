import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { CATEGORY_COLORS } from '../../lib/supabase'

function thaiCurrency(n) {
  return `฿${Number(n).toLocaleString('th-TH', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`
}

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
      <p className="font-mono text-white">{thaiCurrency(payload[0].value)}</p>
    </div>
  )
}

export default function CategoryBarChart({ transactions }) {
  const data = useMemo(() => {
    const totals = {}
    transactions.forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + Number(t.amount)
    })
    return Object.entries(totals)
      .map(([name, total]) => ({ name, total: Math.round(total * 100) / 100 }))
      .sort((a, b) => b.total - a.total)
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
      <BarChart data={data} margin={{ top: 4, right: 4, left: -8, bottom: 0 }} barSize={28}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'Plus Jakarta Sans' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'DM Mono' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={tickFmt}
          width={52}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 4 }} />
        <Bar dataKey="total" radius={[6, 6, 2, 2]}>
          {data.map(entry => (
            <Cell
              key={entry.name}
              fill={CATEGORY_COLORS[entry.name] ?? '#6B7280'}
              opacity={0.9}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
