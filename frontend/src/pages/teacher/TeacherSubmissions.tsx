import { Fragment, useState } from 'react'
import { SUBMISSIONS, ASSESSMENTS } from '../../data/mockData'
import type { AssessmentSubmission, SubmissionStatus } from '../../types'
import type { TeacherPage } from '../../layouts/TeacherLayout'

const STATUS_CFG: Record<SubmissionStatus, { bg: string; color: string; label: string }> = {
  'Not Submitted': { bg: '#F1F5F9', color: '#64748B', label: 'Not Submitted' },
  'Submitted':     { bg: '#DBEAFE', color: '#1E40AF', label: 'Submitted' },
  'Analyzing':     { bg: '#EDE9FE', color: '#6D28D9', label: 'Analyzing…' },
  'AI Draft Ready':{ bg: '#FEF3C7', color: '#B45309', label: 'AI Draft Ready' },
  'Teacher Review':{ bg: '#FEF3C7', color: '#92400E', label: 'Review Required' },
  'Approved':      { bg: '#DCFCE7', color: '#15803D', label: 'Approved' },
  'Rejected':      { bg: '#FEE2E2', color: '#B91C1C', label: 'Rejected' },
}

interface Props {
  onNavigate: (page: TeacherPage) => void
}

export default function TeacherSubmissions({ onNavigate }: Props) {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(ASSESSMENTS[0].id)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const assessment = ASSESSMENTS.find((a) => a.id === selectedAssessmentId)!
  const filtered = SUBMISSIONS.filter((s) => s.assessmentId === selectedAssessmentId)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Submissions</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>GitHub repository submissions and analysis status</p>
      </div>

      {/* Assessment selector */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {ASSESSMENTS.map((a) => (
          <button
            key={a.id}
            onClick={() => setSelectedAssessmentId(a.id)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: selectedAssessmentId === a.id ? 'var(--primary)' : 'var(--card)',
              color: selectedAssessmentId === a.id ? 'white' : 'var(--foreground)',
              border: `1px solid ${selectedAssessmentId === a.id ? 'var(--primary)' : 'var(--border)'}`,
              cursor: 'pointer',
            }}
          >
            {a.title}
            <span className="ml-2 text-xs opacity-70">{a.submissionMode}</span>
          </button>
        ))}
      </div>

      {/* Assessment info bar */}
      <div className="rounded-xl px-5 py-4 mb-5 flex flex-wrap items-center gap-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Assessment</p>
          <p className="text-sm font-semibold">{assessment.title}</p>
        </div>
        <div>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Group</p>
          <p className="text-sm font-semibold mono">{assessment.groupName}</p>
        </div>
        <div>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Submission Mode</p>
          <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full" style={{ background: assessment.submissionMode === 'Team' ? '#EDE9FE' : '#DBEAFE', color: assessment.submissionMode === 'Team' ? '#6D28D9' : '#1E40AF' }}>
            {assessment.submissionMode}
          </span>
        </div>
        <div>
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Due</p>
          <p className="text-sm font-semibold mono">{assessment.dueDate}</p>
        </div>
        <div className="ml-auto flex gap-3 text-center">
          {(['Submitted', 'Analyzing', 'AI Draft Ready', 'Teacher Review', 'Approved'] as SubmissionStatus[]).map((s) => {
            const count = filtered.filter((f) => f.status === s).length
            const cfg = STATUS_CFG[s]
            if (count === 0) return null
            return (
              <div key={s}>
                <p className="text-lg font-semibold mono" style={{ color: cfg.color }}>{count}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{s}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Submissions table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
              {assessment.submissionMode === 'Team'
                ? ['Team', 'Members', 'GitHub Repository', 'Submitted', 'Status', 'Action'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))
                : ['Student', 'GitHub Repository', 'Submitted', 'Status', 'Action'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                  ))
              }
            </tr>
          </thead>
          <tbody>
            {filtered.map((sub, i) => {
              const cfg = STATUS_CFG[sub.status]
              const needsAction = sub.status === 'Teacher Review' || sub.status === 'AI Draft Ready'
              return (
                <Fragment key={sub.id}>
                  <tr
                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', background: needsAction ? '#FFFBEB' : 'white' }}
                  >
                    {assessment.submissionMode === 'Team' && (
                      <td className="px-4 py-4 text-sm font-semibold">{sub.teamName}</td>
                    )}
                    {assessment.submissionMode === 'Team' && (
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {(sub.teamMembers ?? []).map((m) => (
                            <span key={m} className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
                              {m.split(' ')[0]}
                            </span>
                          ))}
                        </div>
                      </td>
                    )}
                    {assessment.submissionMode === 'Individual' && (
                      <td className="px-4 py-4 text-sm font-medium">{sub.studentName}</td>
                    )}
                    <td className="px-4 py-4">
                      {sub.githubUrl ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs" style={{ color: '#94A3B8' }}>⎇</span>
                          <span className="text-sm mono" style={{ color: 'var(--primary)' }}>{sub.githubUrl}</span>
                        </div>
                      ) : (
                        <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-xs mono" style={{ color: 'var(--muted-foreground)' }}>
                      {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {needsAction && (
                        <button
                          onClick={() => onNavigate('aievaluations')}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                          style={{ background: '#B45309', color: 'white', border: 'none', cursor: 'pointer' }}
                        >
                          Review →
                        </button>
                      )}
                      {sub.status === 'Analyzing' && (
                        <button
                          onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
                          className="text-xs px-3 py-1.5 rounded-lg"
                          style={{ background: '#EDE9FE', color: '#6D28D9', border: 'none', cursor: 'pointer' }}
                        >
                          Progress
                        </button>
                      )}
                    </td>
                  </tr>
                  {expandedId === sub.id && sub.status === 'Analyzing' && (
                    <tr>
                      <td colSpan={6} className="px-4 py-4" style={{ background: '#F5F3FF', borderBottom: '1px solid var(--border)' }}>
                        <p className="text-xs font-semibold mb-3" style={{ color: '#6D28D9' }}>Analysis Progress — {sub.githubUrl}</p>
                        <div className="space-y-2">
                          {[
                            { label: 'Repository connected', done: true },
                            { label: 'Repository structure inspected', done: true },
                            { label: 'Source code analyzed', done: true },
                            { label: 'Evaluation criteria being checked', done: false, active: true },
                            { label: 'AI recommendations generated', done: false },
                          ].map(({ label, done, active }) => (
                            <div key={label} className="flex items-center gap-2.5">
                              <span style={{ fontSize: '14px', color: done ? '#15803D' : active ? '#6D28D9' : '#94A3B8' }}>
                                {done ? '✓' : active ? '●' : '○'}
                              </span>
                              <span className="text-sm" style={{ color: done ? '#15803D' : active ? '#6D28D9' : '#94A3B8', fontWeight: active ? 500 : 400 }}>
                                {label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
