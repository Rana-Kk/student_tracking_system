import { useState } from 'react'
import { AI_EVALUATIONS } from '../../data/mockData'
import type { AIEvaluation, EvaluationStatus } from '../../types'
import FeedbackStatusBanner from '../../components/FeedbackStatusBanner'

const STATUS_OPTIONS: EvaluationStatus[] = ['Draft', 'Approved', 'Rejected']

const SECTION_CFG = [
  { key: 'strengths' as const, label: 'Strengths', icon: '★', headerBg: '#F0FDF4', headerColor: '#15803D' },
  { key: 'areasForImprovement' as const, label: 'Areas for Improvement', icon: '◎', headerBg: '#FFFBEB', headerColor: '#92400E' },
  { key: 'recommendations' as const, label: 'Recommendations', icon: '→', headerBg: '#EFF6FF', headerColor: '#1E40AF' },
  { key: 'suggestedNextSteps' as const, label: 'Suggested Next Steps', icon: '⬆', headerBg: '#FAF5FF', headerColor: '#6D28D9' },
]

export default function TeacherAIEvaluations() {
  const [evaluations, setEvaluations] = useState<AIEvaluation[]>(AI_EVALUATIONS)
  const [selectedId, setSelectedId] = useState(AI_EVALUATIONS[0].id)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const evaluation = evaluations.find((e) => e.id === selectedId)!

  const updateCriterionScore = (criterionId: string, score: number) => {
    setSaved(false)
    setEvaluations((prev) => prev.map((e) => {
      if (e.id !== selectedId) return e
      const newScores = e.criterionScores.map((c) =>
        c.criterionId === criterionId ? { ...c, teacherFinalScore: score, teacherOverride: score !== c.aiRecommendedScore } : c
      )
      const totalTeacherScore = newScores.reduce((sum, c) => sum + c.teacherFinalScore, 0)
      return { ...e, criterionScores: newScores, totalTeacherScore }
    }))
  }

  const updateSection = (key: keyof Pick<AIEvaluation, 'strengths' | 'areasForImprovement' | 'recommendations' | 'suggestedNextSteps'>, value: string) => {
    setSaved(false)
    setEvaluations((prev) => prev.map((e) => e.id === selectedId ? { ...e, [key]: value } : e))
  }

  const updateStatus = (status: EvaluationStatus) => {
    setEvaluations((prev) => prev.map((e) =>
      e.id === selectedId ? { ...e, status, reviewedBy: status !== 'Draft' ? 'James Okonkwo' : e.reviewedBy, reviewedAt: status !== 'Draft' ? new Date().toISOString() : e.reviewedAt } : e
    ))
  }

  const handleSave = () => setSaved(true)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>AI Evaluations</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Review AI-generated evaluations and approve or reject before students can see results</p>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: '220px 1fr' }}>
        {/* Sidebar list */}
        <div className="space-y-2">
          {evaluations.map((ev) => {
            const active = ev.id === selectedId
            const statusColor = ev.status === 'Approved' ? '#15803D' : ev.status === 'Rejected' ? '#B91C1C' : '#B45309'
            const statusBg = ev.status === 'Approved' ? '#DCFCE7' : ev.status === 'Rejected' ? '#FEE2E2' : '#FEF3C7'
            return (
              <button
                key={ev.id}
                onClick={() => setSelectedId(ev.id)}
                className="w-full text-left rounded-xl p-3.5 transition-all"
                style={{ background: active ? 'var(--primary)' : 'var(--card)', border: active ? '1px solid var(--primary)' : '1px solid var(--border)', cursor: 'pointer' }}
              >
                <p className="text-sm font-semibold leading-snug" style={{ color: active ? 'white' : 'var(--foreground)' }}>
                  {ev.teamName ?? ev.studentName}
                </p>
                <p className="text-xs mt-0.5 truncate" style={{ color: active ? 'rgba(255,255,255,0.65)' : 'var(--muted-foreground)' }}>{ev.assessmentTitle}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-medium px-1.5 py-0.5 rounded-full" style={{ background: active ? 'rgba(255,255,255,0.2)' : statusBg, color: active ? 'white' : statusColor }}>
                    {ev.status}
                  </span>
                  <span className="text-xs mono" style={{ color: active ? 'rgba(255,255,255,0.65)' : 'var(--muted-foreground)' }}>
                    {ev.totalAIScore}/{ev.maxScore}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Main panel */}
        <div className="min-w-0">
          {/* Header */}
          <div className="rounded-xl p-5 mb-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--muted-foreground)' }}>{evaluation.assessmentTitle}</p>
                <h2 className="text-lg font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {evaluation.teamName ? `Team: ${evaluation.teamName}` : evaluation.studentName}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <span style={{ color: '#94A3B8', fontSize: '13px' }}>⎇</span>
                  <span className="text-sm mono" style={{ color: 'var(--primary)' }}>{evaluation.githubUrl}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {saved && <span className="text-xs font-medium px-2.5 py-1.5 rounded-lg" style={{ background: '#DCFCE7', color: '#15803D' }}>✓ Saved</span>}
                <button onClick={handleSave} className="text-sm px-4 py-2 rounded-lg font-medium" style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}>Save Changes</button>
                {evaluation.status === 'Draft' && (
                  <button
                    onClick={() => {
                      setEvaluations((prev) => prev.map((e) => {
                        if (e.id !== selectedId) return e
                        const newScores = e.criterionScores.map((c) => ({ ...c, teacherFinalScore: c.aiRecommendedScore, teacherOverride: false }))
                        return { ...e, criterionScores: newScores, totalTeacherScore: newScores.reduce((s, c) => s + c.teacherFinalScore, 0) }
                      }))
                      setSaved(false)
                    }}
                    className="text-sm px-4 py-2 rounded-lg font-medium"
                    style={{ background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A', cursor: 'pointer' }}
                  >
                    ✦ Accept All AI Scores
                  </button>
                )}
                {evaluation.status === 'Draft' && (
                  <>
                    <button onClick={() => updateStatus('Rejected')} className="text-sm px-4 py-2 rounded-lg font-medium" style={{ background: '#FEE2E2', color: '#B91C1C', border: 'none', cursor: 'pointer' }}>Reject</button>
                    <button onClick={() => updateStatus('Approved')} className="text-sm px-5 py-2 rounded-lg font-semibold" style={{ background: '#16A34A', color: 'white', border: 'none', cursor: 'pointer' }}>✓ Approve Evaluation</button>
                  </>
                )}
                {evaluation.status !== 'Draft' && (
                  <button onClick={() => updateStatus('Draft')} className="text-sm px-4 py-2 rounded-lg font-medium" style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}>Revert to Draft</button>
                )}
              </div>
            </div>
          </div>

          <FeedbackStatusBanner status={evaluation.status} />

          {/* CORE: Criterion scores table */}
          <div className="rounded-xl overflow-hidden mt-4 mb-4" style={{ border: '1px solid var(--border)' }}>
            <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Criterion Evaluation</h3>
                <div className="flex items-center gap-6 text-xs">
                  <span style={{ color: 'var(--muted-foreground)' }}>
                    AI Total: <span className="mono font-semibold" style={{ color: '#B45309' }}>{evaluation.totalAIScore}/{evaluation.maxScore}</span>
                  </span>
                  <span style={{ color: 'var(--muted-foreground)' }}>
                    Teacher Total: <span className="mono font-semibold" style={{ color: '#15803D' }}>{evaluation.totalTeacherScore}/{evaluation.maxScore}</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: '#F8FAFC' }}>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)', minWidth: '140px' }}>Criterion</th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)', width: '60px' }}>Max</th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider" style={{ color: '#B45309', width: '130px' }}>✦ AI Recommended</th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider" style={{ color: '#15803D', width: '130px' }}>Teacher Final</th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>AI Rationale</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluation.criterionScores.map((c, i) => {
                    const overridden = c.teacherFinalScore !== c.aiRecommendedScore
                    return (
                      <tr key={c.criterionId} style={{ borderBottom: i < evaluation.criterionScores.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <td className="px-4 py-3.5 text-sm font-medium">{c.criterionName}</td>
                        <td className="px-4 py-3.5 text-center text-sm mono" style={{ color: 'var(--muted-foreground)' }}>{c.maxScore}</td>
                        <td className="px-4 py-3.5 text-center">
                          <span
                            className="inline-block text-sm font-semibold px-2.5 py-1 rounded-lg mono"
                            style={{ background: '#FEF3C7', color: '#B45309', minWidth: '48px', textAlign: 'center' }}
                          >
                            {c.aiRecommendedScore}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            {evaluation.status === 'Draft' ? (
                              <>
                                <input
                                  type="number"
                                  value={c.teacherFinalScore}
                                  min={0}
                                  max={c.maxScore}
                                  onChange={(e) => updateCriterionScore(c.criterionId, Math.min(c.maxScore, Math.max(0, Number(e.target.value))))}
                                  className="w-16 px-2 py-1.5 rounded-lg text-sm text-center mono font-semibold"
                                  style={{ border: `2px solid ${overridden ? '#16A34A' : 'var(--border)'}`, outline: 'none', color: overridden ? '#15803D' : 'var(--foreground)', background: overridden ? '#F0FDF4' : 'var(--muted)' }}
                                />
                                {overridden ? (
                                  <button
                                    onClick={() => updateCriterionScore(c.criterionId, c.aiRecommendedScore)}
                                    className="text-xs px-2 py-0.5 rounded"
                                    style={{ color: '#B45309', background: '#FEF3C7', border: 'none', cursor: 'pointer' }}
                                  >
                                    ← Accept AI
                                  </button>
                                ) : (
                                  <span className="text-xs" style={{ color: '#94A3B8' }}>= AI score</span>
                                )}
                              </>
                            ) : (
                              <span className="text-sm font-semibold mono px-2.5 py-1 rounded-lg" style={{ background: '#F0FDF4', color: '#15803D' }}>
                                {c.teacherFinalScore}
                              </span>
                            )}
                            {overridden && evaluation.status !== 'Draft' && <span className="text-xs" style={{ color: '#15803D' }}>↑ overridden</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)', maxWidth: '280px' }}>
                          <span className="text-xs mr-1" style={{ color: '#B45309' }}>✦</span>
                          {c.aiRationale}
                        </td>
                      </tr>
                    )
                  })}
                  <tr style={{ background: 'var(--muted)', borderTop: '2px solid var(--border)' }}>
                    <td className="px-4 py-3 text-sm font-semibold" colSpan={2}>Total</td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-semibold mono px-2 py-0.5 rounded" style={{ background: '#FEF3C7', color: '#B45309' }}>
                        {evaluation.totalAIScore}/{evaluation.maxScore}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-semibold mono px-2 py-0.5 rounded" style={{ background: '#DCFCE7', color: '#15803D' }}>
                        {evaluation.totalTeacherScore}/{evaluation.maxScore}
                      </span>
                    </td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* AI narrative sections */}
          <div className="space-y-3">
            {SECTION_CFG.map(({ key, label, icon, headerBg, headerColor }) => (
              <div key={key} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <div className="px-5 py-3 flex items-center justify-between" style={{ background: headerBg, borderBottom: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2">
                    <span style={{ color: headerColor, fontSize: '13px' }}>{icon}</span>
                    <span className="text-sm font-semibold" style={{ color: headerColor, fontFamily: 'Outfit, sans-serif' }}>{label}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded mono font-medium" style={{ background: 'rgba(0,0,0,0.08)', color: headerColor }}>✦ AI Generated</span>
                  </div>
                  {evaluation.status === 'Draft' && (
                    <button onClick={() => setEditingSection(editingSection === key ? null : key)} className="text-xs px-2.5 py-1 rounded-md" style={{ border: '1px solid var(--border)', background: 'white', cursor: 'pointer' }}>
                      {editingSection === key ? 'Done' : 'Edit'}
                    </button>
                  )}
                </div>
                <div className="p-5" style={{ background: 'var(--card)' }}>
                  {editingSection === key ? (
                    <textarea
                      value={evaluation[key]}
                      onChange={(e) => updateSection(key, e.target.value)}
                      rows={4}
                      className="w-full text-sm rounded-lg px-3 py-2.5 resize-y"
                      style={{ border: '1px solid var(--primary)', outline: 'none', background: 'var(--muted)', lineHeight: '1.6' }}
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">{evaluation[key]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
