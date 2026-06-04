import { useState, useRef } from 'react'
import { Upload, ImagePlus, Loader2, Sparkles, X, AlertCircle } from 'lucide-react'
import { createWorker } from 'tesseract.js'

/* ── OCR text parsers ─────────────────────────────────────── */

function extractAmount(text) {
  const patterns = [
    /จำนวนเงิน[\s:฿]*([\d,]+(?:\.\d{1,2})?)/,
    /ยอดโอน[\s:฿]*([\d,]+(?:\.\d{1,2})?)/,
    /ยอดชำระ[\s:฿]*([\d,]+(?:\.\d{1,2})?)/,
    /Amount[\s:฿]*([\d,]+(?:\.\d{1,2})?)/i,
    /([\d,]+\.\d{2})\s*(?:บาท|THB)/,
    /(?:฿|THB)\s*([\d,]+(?:\.\d{1,2})?)/i,
  ]

  for (const p of patterns) {
    const m = text.match(p)
    if (m) {
      const v = parseFloat(m[1].replace(/,/g, ''))
      if (!isNaN(v) && v > 0 && v < 10_000_000) return v
    }
  }

  // Fallback: largest decimal number in text (likely the transaction amount)
  const nums = [...text.matchAll(/([\d,]+\.\d{2})/g)]
    .map(m => parseFloat(m[1].replace(/,/g, '')))
    .filter(n => n > 0 && n < 10_000_000)
  return nums.length ? Math.max(...nums) : null
}

function extractDate(text) {
  // Matches DD/MM/YYYY, DD-MM-YYYY, DD MM YYYY
  const hits = [...text.matchAll(/(\d{1,2})[\/\-\s](\d{1,2})[\/\-\s](\d{2,4})/g)]
  for (const m of hits) {
    let day   = parseInt(m[1], 10)
    let month = parseInt(m[2], 10)
    let year  = parseInt(m[3], 10)

    if (year < 100)  year += 2000       // 2-digit year
    if (year > 2500) year -= 543         // Thai Buddhist Era → CE

    if (year >= 2020 && year <= 2035 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    }
  }
  return null
}

/* ── Component ────────────────────────────────────────────── */

const STATE = { idle: 'idle', processing: 'processing', done: 'done', error: 'error' }

export default function UploadSlip({ categories, onSave }) {
  const [file, setFile]         = useState(null)
  const [preview, setPreview]   = useState(null)
  const [ocrState, setOcrState] = useState(STATE.idle)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [ocrRaw, setOcrRaw]     = useState('')
  const [form, setForm]         = useState({
    amount: '', date: '', category: categories[0], note: '',
  })
  const [saving, setSaving]     = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef                = useRef(null)

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))

  /* ── Process image through Tesseract ─────────────────────── */
  const processFile = async (f) => {
    if (!f || !f.type.startsWith('image/')) return

    if (preview) URL.revokeObjectURL(preview)

    setFile(f)
    setPreview(URL.createObjectURL(f))
    setOcrState(STATE.processing)
    setOcrProgress(0)
    setOcrRaw('')

    try {
      const worker = await createWorker('tha+eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round((m.progress ?? 0) * 100))
          }
        },
      })
      const { data: { text } } = await worker.recognize(f)
      await worker.terminate()

      setOcrRaw(text)
      const amount = extractAmount(text)
      const date   = extractDate(text)

      setForm(prev => ({
        ...prev,
        amount: amount != null ? String(amount) : '',
        date:   date ?? new Date().toISOString().split('T')[0],
      }))
      setOcrState(STATE.done)
    } catch {
      setOcrState(STATE.error)
    }
  }

  const handleDrop = e => {
    e.preventDefault()
    setDragOver(false)
    processFile(e.dataTransfer.files[0])
  }

  const handleInput = e => processFile(e.target.files[0])

  /* ── Save ─────────────────────────────────────────────────── */
  const handleSave = async () => {
    if (!form.amount || !form.date || !form.category) return
    setSaving(true)
    const ok = await onSave(
      { amount: parseFloat(form.amount), date: form.date, category: form.category, note: form.note },
      file,
    )
    setSaving(false)
    if (ok) reset()
  }

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview(null)
    setOcrState(STATE.idle)
    setOcrProgress(0)
    setOcrRaw('')
    setForm({ amount: '', date: '', category: categories[0], note: '' })
    if (inputRef.current) inputRef.current.value = ''
  }

  const canSave = form.amount && form.date && form.category && ocrState !== STATE.processing

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <div className="p-8 max-w-2xl animate-fade-up">
      <div className="mb-7">
        <h1 className="text-[1.6rem] font-bold text-slate-800 tracking-tight">Upload Bank Slip</h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Drop an image — OCR will auto-extract amount &amp; date
        </p>
      </div>

      {/* Drop zone (shown when no file selected) */}
      {!file && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`card border-2 border-dashed p-16 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200 ${
            dragOver
              ? 'border-blue-400 bg-blue-50 scale-[1.01] shadow-card-hover'
              : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-50 ring-1 ring-blue-100 flex items-center justify-center">
            <ImagePlus size={26} className="text-blue-500" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-700">Drop your bank slip here</p>
            <p className="text-slate-400 text-sm mt-1">or click to browse · JPG, PNG, WEBP</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInput}
          />
        </div>
      )}

      {/* Review card (shown after file selected) */}
      {file && (
        <div className="card overflow-hidden">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              {ocrState === STATE.processing && (
                <Loader2 size={15} className="text-blue-500 animate-spin" />
              )}
              {ocrState === STATE.done && (
                <Sparkles size={15} className="text-emerald-500" />
              )}
              {ocrState === STATE.error && (
                <AlertCircle size={15} className="text-amber-500" />
              )}
              <span className="text-sm font-semibold text-slate-700">
                {ocrState === STATE.processing && `Scanning… ${ocrProgress}%`}
                {ocrState === STATE.done       && 'OCR complete — verify the fields below'}
                {ocrState === STATE.error      && 'OCR unavailable — enter details manually'}
              </span>
            </div>
            <button
              onClick={reset}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            >
              <X size={15} />
            </button>
          </div>

          {/* Progress bar */}
          {ocrState === STATE.processing && (
            <div className="h-1 bg-slate-100">
              <div
                className="h-full bg-blue-500 transition-all duration-300 rounded-r-full"
                style={{ width: `${ocrProgress}%` }}
              />
            </div>
          )}

          {/* Content: preview + form */}
          <div className="grid grid-cols-2 gap-6 p-6">
            {/* Image preview */}
            <div className="space-y-2">
              <img
                src={preview}
                alt="Bank slip preview"
                className="w-full rounded-xl object-contain max-h-72 bg-slate-50 border border-slate-100"
              />
              <p className="text-[10px] text-slate-400 text-center truncate font-mono">
                {file.name}
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="label">Amount (฿) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.amount}
                  onChange={e => setField('amount', e.target.value)}
                  className="input font-mono"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="label">Date *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setField('date', e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="label">Category *</label>
                <select
                  value={form.category}
                  onChange={e => setField('category', e.target.value)}
                  className="input"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Note</label>
                <input
                  type="text"
                  value={form.note}
                  onChange={e => setField('note', e.target.value)}
                  className="input"
                  placeholder="Optional description…"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={!canSave || saving}
                className="btn-primary w-full"
              >
                {saving
                  ? <><Loader2 size={15} className="animate-spin" /> Saving…</>
                  : <><Upload size={15} /> Save Transaction</>
                }
              </button>
            </div>
          </div>

          {/* Raw OCR debug (collapsible) */}
          {ocrRaw && (
            <details className="border-t border-slate-100">
              <summary className="px-5 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider cursor-pointer select-none hover:text-slate-600">
                Raw OCR text
              </summary>
              <pre className="px-5 pb-4 text-[10px] text-slate-400 whitespace-pre-wrap font-mono leading-relaxed max-h-32 overflow-y-auto">
                {ocrRaw}
              </pre>
            </details>
          )}
        </div>
      )}
    </div>
  )
}
