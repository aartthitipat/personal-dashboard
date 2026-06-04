import { useState } from 'react'
import { Trash2, Image, Loader2 } from 'lucide-react'
import FilterBar from './FilterBar'
import SlipModal from './SlipModal'
import { CATEGORY_COLORS } from '../lib/supabase'

function fmtAmount(n) {
  return Number(n).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export default function TransactionsTable({
  transactions, loading, filters, setFilters, categories, onDelete,
}) {
  const [slipUrl, setSlipUrl] = useState(null)

  return (
    <div className="p-8 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-[1.6rem] font-bold text-slate-800 tracking-tight">Transactions</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {transactions.length} record{transactions.length !== 1 ? 's' : ''} found
          </p>
        </div>
        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs pt-1">
            <Loader2 size={14} className="animate-spin" />
            Loading…
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="card px-5 py-3.5 mb-5">
        <FilterBar filters={filters} setFilters={setFilters} categories={categories} />
      </div>

      {/* Table card */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                {['Date', 'Amount', 'Category', 'Note', 'Slip', ''].map(h => (
                  <th
                    key={h}
                    className={`px-5 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 ${
                      h === 'Amount' ? 'text-right' : h === 'Slip' || h === '' ? 'text-center' : 'text-left'
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {!loading && !transactions.length && (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-slate-400 text-sm">
                    No transactions match the current filters
                  </td>
                </tr>
              )}

              {transactions.map(tx => (
                <tr
                  key={tx.id}
                  className="group hover:bg-blue-50/30 transition-colors duration-100"
                >
                  {/* Date */}
                  <td className="px-5 py-3.5 text-slate-500 font-mono text-xs tabular-nums">
                    {tx.date}
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-3.5 text-right">
                    <span className="font-mono font-bold text-slate-800 tabular-nums">
                      ฿{fmtAmount(tx.amount)}
                    </span>
                  </td>

                  {/* Category badge */}
                  <td className="px-5 py-3.5">
                    <span
                      className="badge"
                      style={{ backgroundColor: CATEGORY_COLORS[tx.category] ?? '#6B7280' }}
                    >
                      {tx.category}
                    </span>
                  </td>

                  {/* Note */}
                  <td className="px-5 py-3.5 text-slate-400 max-w-[160px] truncate text-xs">
                    {tx.note || <span className="text-slate-200">—</span>}
                  </td>

                  {/* Slip button */}
                  <td className="px-5 py-3.5 text-center">
                    {tx.slip_url ? (
                      <button
                        onClick={() => setSlipUrl(tx.slip_url)}
                        className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-blue-500 hover:bg-blue-100 transition-all"
                        title="View bank slip"
                      >
                        <Image size={14} />
                      </button>
                    ) : (
                      <span className="text-slate-200 text-xs">—</span>
                    )}
                  </td>

                  {/* Delete */}
                  <td className="px-4 py-3.5 text-center">
                    <button
                      onClick={() => onDelete(tx.id, tx.slip_url)}
                      className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                      title="Delete transaction"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Footer total */}
            {transactions.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-slate-100 bg-slate-50/50">
                  <td className="px-5 py-3 text-xs font-semibold text-slate-500">
                    Total ({transactions.length})
                  </td>
                  <td className="px-5 py-3 text-right font-mono font-bold text-slate-800 tabular-nums">
                    ฿{fmtAmount(transactions.reduce((s, t) => s + Number(t.amount), 0))}
                  </td>
                  <td colSpan={4} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {slipUrl && <SlipModal url={slipUrl} onClose={() => setSlipUrl(null)} />}
    </div>
  )
}
