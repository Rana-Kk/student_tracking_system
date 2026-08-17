import { useState } from 'react'
import { STUDENTS } from '../../data/mockData'

const SECTIONS = [
  { id: 'attendance', label: 'Attendance Records', icon: '✓', desc: 'Full session-by-session attendance history' },
  { id: 'scores', label: 'Assessment Scores', icon: '📝', desc: 'Rubric scores and totals for all assessments' },
  { id: 'quiz', label: 'Quiz Results', icon: '❓', desc: 'All quiz scores by topic and date' },
  { id: 'competency', label: 'Competency Matrix', icon: '⬡', desc: 'Skill-by-skill progress levels' },
  { id: 'feedback', label: 'Approved Feedback', icon: '✦', desc: 'AI feedback sections (approved only)' },
  { id: 'certificates', label: 'Certificates', icon: '🏆', desc: 'Issued certificates and expiry dates' },
]

export default function TeacherReports() {
  const [selectedStudentId, setSelectedStudentId] = useState(STUDENTS[0].id)
  const [included, setIncluded] = useState<Set<string>>(new Set(SECTIONS.map((s) => s.id)))
  const [generated, setGenerated] = useState(false)
  const [generating, setGenerating] = useState(false)

  const toggleSection = (id: string) => {
    setIncluded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setGenerated(false)
  }

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => { setGenerating(false); setGenerated(true) }, 1800)
  }

  const student = STUDENTS.find((s) => s.id === selectedStudentId)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>PDF Reports</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Generate and download student performance reports</p>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 320px' }}>
        {/* Config */}
        <div className="space-y-4">
          <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <label className="block text-sm font-semibold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Student</label>
            <select
              value={selectedStudentId}
              onChange={(e) => { setSelectedStudentId(e.target.value); setGenerated(false) }}
              className="w-full px-3 py-2.5 rounded-lg text-sm"
              style={{ border: '1px solid var(--border)', background: 'var(--muted)', outline: 'none', cursor: 'pointer' }}
            >
              {STUDENTS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <p className="text-sm font-semibold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Include in Report</p>
            <div className="space-y-2">
              {SECTIONS.map((s) => (
                <label
                  key={s.id}
                  className="flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                  style={{
                    background: included.has(s.id) ? 'var(--secondary)' : 'transparent',
                    border: `1px solid ${included.has(s.id) ? 'var(--border)' : 'transparent'}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={included.has(s.id)}
                    onChange={() => toggleSection(s.id)}
                    className="mt-0.5 flex-shrink-0"
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <div>
                    <p className="text-sm font-medium">{s.icon} {s.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{s.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Preview + action */}
        <div className="space-y-4">
          <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <p className="text-sm font-semibold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>Report Preview</p>
            <div
              className="rounded-lg p-4 mb-4"
              style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--primary)' }}>L</div>
                <div>
                  <p className="text-xs font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>Lexicon Institute</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Student Performance Report</p>
                </div>
              </div>
              <p className="text-xs font-semibold border-t pt-2" style={{ borderColor: 'var(--border)' }}>{student?.name}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>FSWD-2026-A · Full-Stack Web Development</p>
              <p className="text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>Generated: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>

              <div className="mt-3 pt-2 border-t space-y-1" style={{ borderColor: 'var(--border)' }}>
                <p className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Contents:</p>
                {SECTIONS.filter((s) => included.has(s.id)).map((s) => (
                  <p key={s.id} className="text-xs">{s.icon} {s.label}</p>
                ))}
                {included.size === 0 && <p className="text-xs" style={{ color: '#B91C1C' }}>No sections selected</p>}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={generating || included.size === 0}
              className="w-full py-3 rounded-lg text-sm font-semibold transition-opacity flex items-center justify-center gap-2"
              style={{
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                cursor: generating || included.size === 0 ? 'not-allowed' : 'pointer',
                opacity: included.size === 0 ? 0.5 : generating ? 0.7 : 1,
              }}
            >
              <span>📄</span>
              {generating ? 'Generating PDF…' : 'Generate & Download PDF'}
            </button>

            {generated && (
              <p className="text-xs text-center mt-2 font-medium" style={{ color: '#15803D' }}>
                ✓ Report ready — download started
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
