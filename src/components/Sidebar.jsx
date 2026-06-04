import { LayoutDashboard, Table2, Upload, Wallet, TrendingUp } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: Table2 },
  { id: 'upload',       label: 'Upload Slip',  icon: Upload },
]

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-60 h-full flex flex-col shrink-0 bg-navy-900 select-none">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Wallet size={17} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm tracking-widest">LEDGER</p>
            <p className="text-slate-500 text-[10px] tracking-wide uppercase">Personal Finance</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-4 space-y-0.5">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          Menu
        </p>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-white/6'
              }`}
            >
              <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
              <span>{label}</span>
              {active && (
                <TrendingUp size={12} className="ml-auto opacity-60" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-5 border-t border-white/5">
        <p className="text-slate-600 text-[11px]">v1.0 · Personal Dashboard</p>
      </div>
    </aside>
  )
}
