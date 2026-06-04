import { useMemo } from 'react'
import { TrendingDown, Receipt, Tag, Loader2 } from 'lucide-react'
import KPICard from './KPICard'
import FilterBar from './FilterBar'
import CategoryBarChart from './charts/CategoryBarChart'
import DailyLineChart from './charts/DailyLineChart'

function fmt(n) {
  return `฿${Number(n).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export default function Dashboard({ transactions, loading, filters, setFilters, categories }) {
  const kpis = useMemo(() => {
    const totalSpent = transactions.reduce((s, t) => s + Number(t.amount), 0)
    const totalSlips = transactions.filter(t => t.slip_url).length

    const cats = {}
    transactions.forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + Number(t.amount)
    })
    const topCategory =
      Object.entries(cats).sort(([, a], [, b]) => b - a)[0]?.[0] ?? '—'

    return { totalSpent, totalSlips, topCategory }
  }, [transactions])

  return (
    <div className="p-8 animate-fade-up">
      {/* Page header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[1.6rem] font-bold text-slate-800 tracking-tight">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">Your spending overview</p>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs pt-1">
            <Loader2 size={14} className="animate-spin" />
            Refreshing…
          </div>
        )}
      </div>

      {/* Filter bar */}
      <div className="card px-5 py-3.5 mb-6">
        <FilterBar filters={filters} setFilters={setFilters} categories={categories} />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        <KPICard
          label="Total Spent"
          value={fmt(kpis.totalSpent)}
          sub={`${transactions.length} transaction${transactions.length !== 1 ? 's' : ''} in period`}
          icon={TrendingDown}
          color="blue"
        />
        <KPICard
          label="Slips Uploaded"
          value={String(kpis.totalSlips)}
          sub="transactions with bank slip"
          icon={Receipt}
          color="purple"
        />
        <KPICard
          label="Top Category"
          value={kpis.topCategory}
          sub="highest spending category"
          icon={Tag}
          color="emerald"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-5">
        <div className="card p-6">
          <h2 className="text-sm font-bold text-slate-700">Spending by Category</h2>
          <p className="text-xs text-slate-400 mb-5 mt-0.5">Total amount per category</p>
          <div className="h-56">
            <CategoryBarChart transactions={transactions} />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-sm font-bold text-slate-700">Daily Expense Trend</h2>
          <p className="text-xs text-slate-400 mb-5 mt-0.5">Spending pattern over the period</p>
          <div className="h-56">
            <DailyLineChart transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  )
}
