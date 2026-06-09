import { useState, useEffect, useCallback } from 'react'
import { supabase, CATEGORIES } from './lib/supabase'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import TransactionsTable from './components/TransactionsTable'
import UploadSlip from './components/UploadSlip'
import Notification from './components/Notification'

function currentMonthRange() {
  const now = new Date()
  const first = new Date(now.getFullYear(), now.getMonth(), 1)
  return {
    dateFrom: first.toISOString().split('T')[0],
    dateTo:   now.toISOString().split('T')[0],
  }
}

export default function App() {
  const [activeTab, setActiveTab]       = useState('dashboard')
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(true)
  const [notification, setNotification] = useState(null)
  const [filters, setFilters]           = useState({
    ...currentMonthRange(),
    category: 'all',
  })

  /* ── Data fetching ─────────────────────────────────────────── */
  const fetchTransactions = useCallback(async () => {
    setLoading(true)

    if (!supabase) {
      setTransactions([])
      setLoading(false)
      notify('error', 'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel.')
      return
    }

    let q = supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })

    if (filters.dateFrom)          q = q.gte('date', filters.dateFrom)
    if (filters.dateTo)            q = q.lte('date', filters.dateTo)
    if (filters.category !== 'all') q = q.eq('category', filters.category)

    const { data, error } = await q
    if (!error) setTransactions(data ?? [])
    setLoading(false)
  }, [filters])

  useEffect(() => { fetchTransactions() }, [fetchTransactions])

  /* ── Notification helper ───────────────────────────────────── */
  const notify = (type, message) => {
    setNotification({ type, message, id: Date.now() })
    setTimeout(() => setNotification(null), 4500)
  }

  /* ── Save transaction + upload slip ────────────────────────── */
  const handleSave = async (formData, file) => {
    if (!supabase) {
      notify('error', 'Supabase is not configured. Add the env vars in Vercel first.')
      return false
    }

    let slip_url = null

    if (file) {
      const ext      = file.name.split('.').pop()
      const fileName = `slip-${Date.now()}.${ext}`

      const { error: uploadErr } = await supabase.storage
        .from('bank-slips')
        .upload(fileName, file, { upsert: false })

      if (uploadErr) {
        notify('error', `Upload failed: ${uploadErr.message}`)
        return false
      }

      const { data: urlData } = supabase.storage
        .from('bank-slips')
        .getPublicUrl(fileName)
      slip_url = urlData.publicUrl
    }

    const { error } = await supabase
      .from('transactions')
      .insert([{ ...formData, slip_url }])

    if (error) {
      notify('error', `Save failed: ${error.message}`)
      return false
    }

    notify('success', 'Transaction saved successfully!')
    fetchTransactions()
    return true
  }

  /* ── Delete transaction + storage file ────────────────────── */
  const handleDelete = async (id, slipUrl) => {
    if (!supabase) {
      notify('error', 'Supabase is not configured. Add the env vars in Vercel first.')
      return
    }

    if (!window.confirm('Delete this transaction? This cannot be undone.')) return

    if (slipUrl) {
      const parts = slipUrl.split('/bank-slips/')
      if (parts[1]) {
        await supabase.storage.from('bank-slips').remove([decodeURIComponent(parts[1])])
      }
    }

    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) notify('error', 'Delete failed.')
    else {
      notify('success', 'Transaction deleted.')
      fetchTransactions()
    }
  }

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <div className="flex h-screen bg-[#eef2f7] font-jakarta overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 overflow-y-auto min-w-0">
        {activeTab === 'dashboard' && (
          <Dashboard
            transactions={transactions}
            loading={loading}
            filters={filters}
            setFilters={setFilters}
            categories={CATEGORIES}
          />
        )}
        {activeTab === 'transactions' && (
          <TransactionsTable
            transactions={transactions}
            loading={loading}
            filters={filters}
            setFilters={setFilters}
            categories={CATEGORIES}
            onDelete={handleDelete}
          />
        )}
        {activeTab === 'upload' && (
          <UploadSlip
            categories={CATEGORIES}
            onSave={handleSave}
          />
        )}
      </main>

      {notification && (
        <Notification
          key={notification.id}
          type={notification.type}
          message={notification.message}
        />
      )}
    </div>
  )
}
