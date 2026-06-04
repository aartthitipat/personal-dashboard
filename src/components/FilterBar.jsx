import { Filter, X } from 'lucide-react'

export default function FilterBar({ filters, setFilters, categories }) {
  const set = (key, val) => setFilters(f => ({ ...f, [key]: val }))

  const hasActiveFilters =
    filters.dateFrom || filters.dateTo || filters.category !== 'all'

  const clear = () =>
    setFilters({ dateFrom: '', dateTo: '', category: 'all' })

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
        <Filter size={14} />
        <span className="text-xs font-semibold uppercase tracking-wider">Filters</span>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-slate-500 shrink-0">From</label>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={e => set('dateFrom', e.target.value)}
          className="input !py-2 !text-xs w-36"
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-slate-500 shrink-0">To</label>
        <input
          type="date"
          value={filters.dateTo}
          onChange={e => set('dateTo', e.target.value)}
          className="input !py-2 !text-xs w-36"
        />
      </div>

      <select
        value={filters.category}
        onChange={e => set('category', e.target.value)}
        className="input !py-2 !text-xs w-40"
      >
        <option value="all">All Categories</option>
        {categories.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          onClick={clear}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors"
        >
          <X size={13} />
          Clear
        </button>
      )}
    </div>
  )
}
