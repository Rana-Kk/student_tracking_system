import { AI_EVALUATIONS } from '../../data/mockData'
import type { EvaluationStatus } from '../../types'

const approvedFeedback = AI_EVALUATIONS.filter(
  (e) => e.status === 'Approved'
)

const SECTION_LABELS: { key: keyof Pick<typeof AI_EVALUATIONS[0], 'strengths' | 'areasForImprovement' | 'recommendations' | 'suggestedNextSteps'>; label: string; icon: string; bg: string; color: string }[] = [
  { key: 'strengths', label: 'Strengths', icon: '★', bg: '#F0FDF4', color: '#15803D' },
  { key: 'areasForImprovement', label: 'Areas for Improvement', icon: '◎', bg: '#FFFBEB', color: '#92400E' },
  { key: 'recommendations', label: 'Recommendations', icon: '→', bg: '#EFF6FF', color: '#1E40AF' },
  { key: 'suggestedNextSteps', label: 'Suggested Next Steps', icon: '⬆', bg: '#FAF5FF', color: '#6D28D9' },
]

const STATUS_CFG: Record<EvaluationStatus, { bg: string; color: string }> = {
  Draft:    { bg: '#FEF3C7', color: '#B45309' },
  Approved: { bg: '#DCFCE7', color: '#15803D' },
  Rejected: { bg: '#FEE2E2', color: '#B91C1C' },
}

export default function StudentFeedback() {
  if (approvedFeedback.length === 0) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>Feedback</h1>
        <div className="rounded-xl p-12 text-center" style={{ background: 'var(--card)', border: '1px dashed var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>No approved feedback yet. Check back after your teacher reviews your work.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Feedback</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Teacher-reviewed and approved feedback only</p>
      </div>

      <div className="space-y-6">
        {approvedFeedback.map((ev) => {
          const cfg = STATUS_CFG[ev.status]
          return (
            <div key={ev.id} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <div className="px-5 py-4 flex items-center justify-between" style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <p className="text-sm font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {ev.assessmentTitle} — {ev.teamName ?? ev.studentName}
                  </p>
                  <p className="text-xs mt-0.5 mono" style={{ color: 'var(--muted-foreground)' }}>
                    {new Date(ev.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {ev.reviewedBy && ` · Reviewed by ${ev.reviewedBy}`}
                  </p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>
                  ✓ {ev.status}
                </span>
              </div>

              {/* Final score */}
              <div className="px-5 py-4 flex items-center gap-4 border-b" style={{ borderColor: 'var(--border)', background: '#F0FDF4' }}>
                <div>
                  <p className="text-xs font-medium" style={{ color: '#15803D' }}>Final Score</p>
                  <p className="text-2xl font-bold mono" style={{ color: '#15803D', fontFamily: 'Outfit, sans-serif' }}>
                    {ev.totalTeacherScore}<span className="text-base font-normal">/{ev.maxScore}</span>
                  </p>
                </div>
                <div className="text-2xl font-bold mono ml-4" style={{ color: '#15803D', fontFamily: 'Outfit, sans-serif' }}>
                  {Math.round((ev.totalTeacherScore / ev.maxScore) * 100)}%
                </div>
              </div>

              <div style={{ background: 'var(--muted)' }}>
                {SECTION_LABELS.map(({ key, label, icon, bg, color }) => (
                  <div key={key} style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="px-5 py-2.5 flex items-center gap-2" style={{ background: bg }}>
                      <span style={{ color, fontSize: '12px' }}>{icon}</span>
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color }}>{label}</span>
                    </div>
                    <div className="px-5 py-4" style={{ background: 'var(--card)' }}>
                      <p className="text-sm leading-relaxed">{ev[key]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
