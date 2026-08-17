import { useState } from 'react'
import { QUIZ_IMPORT_PREVIEW } from '../../data/mockData'
import type { QuizImportRow } from '../../types'

type Step = 1 | 2 | 3 | 4 | 5

const COLUMN_MAP = [
  { excel: 'Student Email', platform: 'Student (matched by email)' },
  { excel: 'Quiz Name', platform: 'Quiz Title' },
  { excel: 'Topic', platform: 'Topic' },
  { excel: 'Score', platform: 'Score' },
  { excel: 'Date', platform: 'Completed At' },
]

const STATUS_CFG: Record<QuizImportRow['status'], { bg: string; color: string; label: string }> = {
  valid:           { bg: '#DCFCE7', color: '#15803D', label: '✓ Valid' },
  invalid:         { bg: '#FEE2E2', color: '#B91C1C', label: '✕ Invalid' },
  duplicate:       { bg: '#FEF3C7', color: '#B45309', label: '⚑ Duplicate' },
  missing_student: { bg: '#FEE2E2', color: '#B91C1C', label: '✕ Unknown student' },
}

interface Props {
  onDone: () => void
}

export default function TeacherQuizImport({ onDone }: Props) {
  const [step, setStep] = useState<Step>(1)
  const [fileName, setFileName] = useState('')
  const [importing, setImporting] = useState(false)
  const [done, setDone] = useState(false)

  const rows = QUIZ_IMPORT_PREVIEW
  const valid = rows.filter((r) => r.status === 'valid').length
  const invalid = rows.filter((r) => r.status !== 'valid').length

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) { setFileName(file.name); setStep(2) }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) { setFileName(file.name); setStep(2) }
  }

  const handleImport = () => {
    setImporting(true)
    setTimeout(() => { setImporting(false); setDone(true) }, 1800)
  }

  const STEPS = ['Upload File', 'Map Columns', 'Validate', 'Preview', 'Confirm']

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Quiz Results Import</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Import quiz results from an external platform (Excel / CSV)</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center mb-8">
        {STEPS.map((label, i) => {
          const n = (i + 1) as Step
          const active = step === n
          const done_ = step > n
          return (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{
                    background: done_ ? '#16A34A' : active ? 'var(--primary)' : 'var(--secondary)',
                    color: done_ || active ? 'white' : 'var(--muted-foreground)',
                  }}
                >
                  {done_ ? '✓' : n}
                </div>
                <span className="text-sm font-medium whitespace-nowrap hidden sm:block" style={{ color: active ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px mx-3" style={{ background: step > n ? '#16A34A' : 'var(--border)' }} />
              )}
            </div>
          )
        })}
      </div>

      <div className="rounded-xl p-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>

        {/* Step 1: Upload */}
        {step === 1 && (
          <div>
            <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Upload Excel File</h2>
            <div
              className="border-2 border-dashed rounded-xl p-12 text-center"
              style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
            >
              <p className="text-3xl mb-3">📊</p>
              <p className="text-sm font-medium mb-1">Drop your Excel file here</p>
              <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>Supports .xlsx, .xls, .csv files</p>
              <label className="inline-block px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer" style={{ background: 'var(--primary)', color: 'white' }}>
                Browse File
                <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileSelect} />
              </label>
            </div>
            <div className="mt-4 p-3 rounded-lg text-xs" style={{ background: '#EFF6FF', color: '#1E40AF' }}>
              <strong>Expected columns:</strong> Student Email, Quiz Name, Topic, Score, Date
            </div>
            {/* Demo shortcut */}
            <button onClick={() => { setFileName('quiz-results-may2026.xlsx'); setStep(2) }} className="mt-3 w-full py-2 rounded-lg text-sm" style={{ border: '1px dashed var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--muted-foreground)' }}>
              Use demo file (quiz-results-may2026.xlsx)
            </button>
          </div>
        )}

        {/* Step 2: Map columns */}
        {step === 2 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Map Columns</h2>
              <span className="text-xs mono" style={{ color: 'var(--muted-foreground)' }}>{fileName}</span>
            </div>
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Excel Column</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>→</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Platform Field</th>
                  </tr>
                </thead>
                <tbody>
                  {COLUMN_MAP.map((row, i) => (
                    <tr key={row.excel} style={{ borderBottom: i < COLUMN_MAP.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td className="px-4 py-3.5 text-sm mono font-medium" style={{ color: 'var(--primary)' }}>{row.excel}</td>
                      <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--muted-foreground)' }}>→</td>
                      <td className="px-4 py-3.5">
                        <select className="px-3 py-1.5 rounded-lg text-sm" style={{ border: '1px solid var(--border)', background: 'var(--muted)', outline: 'none' }} defaultValue={row.platform}>
                          <option>{row.platform}</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="px-4 py-2.5 rounded-lg text-sm" style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}>Back</button>
              <button onClick={() => setStep(3)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}>Validate →</button>
            </div>
          </div>
        )}

        {/* Step 3: Validate */}
        {step === 3 && (
          <div>
            <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Validation Results</h2>
            <div className="grid grid-cols-4 gap-3 mb-5">
              {[
                { label: 'Total Rows', value: rows.length, color: 'var(--foreground)' },
                { label: 'Valid', value: valid, color: '#15803D' },
                { label: 'Invalid / Error', value: rows.filter((r) => r.status === 'invalid' || r.status === 'missing_student').length, color: '#B91C1C' },
                { label: 'Duplicates', value: rows.filter((r) => r.status === 'duplicate').length, color: '#B45309' },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-lg p-3 text-center" style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}>
                  <p className="text-xl font-semibold mono" style={{ color }}>{value}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {rows.filter((r) => r.status !== 'valid').map((row, i) => {
                const cfg = STATUS_CFG[row.status]
                return (
                  <div key={i} className="flex items-start gap-3 rounded-lg px-4 py-3 text-sm" style={{ background: cfg.bg }}>
                    <span className="font-medium flex-shrink-0" style={{ color: cfg.color }}>{cfg.label}</span>
                    <div style={{ color: cfg.color }}>
                      <span className="mono">{row.email}</span>
                      {row.error && <span className="ml-2 opacity-80">— {row.error}</span>}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(2)} className="px-4 py-2.5 rounded-lg text-sm" style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}>Back</button>
              <button onClick={() => setStep(4)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}>Preview {valid} valid rows →</button>
            </div>
          </div>
        )}

        {/* Step 4: Preview */}
        {step === 4 && (
          <div>
            <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Preview — {valid} rows to import</h2>
            <div className="rounded-xl overflow-hidden mb-5" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
                    {['Email', 'Quiz', 'Topic', 'Score', 'Date', 'Status'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => {
                    const cfg = STATUS_CFG[row.status]
                    return (
                      <tr key={i} style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none', opacity: row.status !== 'valid' ? 0.5 : 1 }}>
                        <td className="px-4 py-3 text-xs mono">{row.email}</td>
                        <td className="px-4 py-3 text-sm">{row.quizName}</td>
                        <td className="px-4 py-3 text-sm" style={{ color: 'var(--muted-foreground)' }}>{row.topic}</td>
                        <td className="px-4 py-3 text-sm mono">{row.score}</td>
                        <td className="px-4 py-3 text-xs mono" style={{ color: 'var(--muted-foreground)' }}>{row.date}</td>
                        <td className="px-4 py-3"><span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="px-4 py-2.5 rounded-lg text-sm" style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}>Back</button>
              <button onClick={() => setStep(5)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}>Confirm Import →</button>
            </div>
          </div>
        )}

        {/* Step 5: Confirm */}
        {step === 5 && !done && (
          <div className="text-center py-4">
            <p className="text-3xl mb-4">📊</p>
            <h2 className="text-base font-semibold mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>Ready to import</h2>
            <p className="text-sm mb-1" style={{ color: 'var(--muted-foreground)' }}>
              <span className="font-semibold" style={{ color: '#15803D' }}>{valid} valid results</span> will be imported.
            </p>
            <p className="text-sm mb-8" style={{ color: 'var(--muted-foreground)' }}>
              {invalid} row{invalid !== 1 ? 's' : ''} with errors will be skipped.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setStep(4)} className="px-6 py-2.5 rounded-lg text-sm" style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}>Back</button>
              <button
                onClick={handleImport}
                disabled={importing}
                className="px-8 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: '#16A34A', color: 'white', border: 'none', cursor: importing ? 'not-allowed' : 'pointer', opacity: importing ? 0.7 : 1 }}
              >
                {importing ? 'Importing…' : `Confirm Import (${valid} rows)`}
              </button>
            </div>
          </div>
        )}

        {done && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✓</div>
            <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Outfit, sans-serif', color: '#15803D' }}>Import complete</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>{valid} quiz results successfully imported into Lexicon.</p>
            <button onClick={onDone} className="px-6 py-2.5 rounded-lg text-sm font-semibold" style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}>
              View Quiz Results →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
