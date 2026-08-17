import { useState } from 'react'
import { ASSESSMENTS, SUBMISSIONS } from '../../data/mockData'
import type { StudentPage } from '../../layouts/StudentLayout'

// Student-visible labels — AI analysis is hidden from students
const STATUS_CFG: Record<string, { bg: string; color: string; label: string }> = {
  'Not Submitted': { bg: '#F1F5F9', color: '#64748B', label: 'Not Submitted' },
  'Submitted':     { bg: '#DBEAFE', color: '#1E40AF', label: 'Submitted' },
  'Analyzing':     { bg: '#DBEAFE', color: '#1E40AF', label: 'Submitted' },
  'AI Draft Ready':{ bg: '#FEF3C7', color: '#92400E', label: 'Teacher Review' },
  'Teacher Review':{ bg: '#FEF3C7', color: '#92400E', label: 'Teacher Review' },
  'Approved':      { bg: '#DCFCE7', color: '#15803D', label: 'Approved' },
  'Rejected':      { bg: '#FEE2E2', color: '#B91C1C', label: 'Not Approved' },
}

interface Props {
  onNavigate: (page: StudentPage) => void
}

export default function StudentAssignments({ onNavigate }: Props) {
  const mySubmissions = SUBMISSIONS.filter((s) => s.studentId === 'student-1' || s.teamId === 't1')

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>My Assignments</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>FSWD-2026-A · All assigned assessments</p>
      </div>

      <div className="space-y-4">
        {ASSESSMENTS.map((a) => {
          const sub = mySubmissions.find((s) => s.assessmentId === a.id)
          const status = sub?.status ?? 'Not Submitted'
          const cfg = STATUS_CFG[status]
          const isApproved = status === 'Approved'
          const isTeam = a.submissionMode === 'Team'

          return (
            <div
              key={a.id}
              className="rounded-xl p-5"
              style={{ background: 'var(--card)', border: `1px solid ${isApproved ? '#86EFAC' : 'var(--border)'}` }}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: '#F3E8FF', color: '#6D28D9' }}>{a.type}</span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: isTeam ? '#EDE9FE' : '#DBEAFE', color: isTeam ? '#6D28D9' : '#1E40AF' }}>
                      {isTeam ? '⬡ Team' : '○ Individual'}
                    </span>
                  </div>
                  <h2 className="text-base font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>{a.title}</h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{a.description.substring(0, 100)}…</p>
                  <div className="flex gap-4 mt-2 text-xs mono" style={{ color: 'var(--muted-foreground)' }}>
                    <span>Due: {a.dueDate}</span>
                    <span>Max: {a.maxScore} pts</span>
                    {sub?.githubUrl && <span className="truncate">⎇ {sub.githubUrl}</span>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-sm font-medium px-3 py-1.5 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>
                    {cfg.label}
                  </span>
                  {isApproved ? (
                    <button
                      onClick={() => onNavigate('submissions')}
                      className="text-sm font-semibold px-4 py-2 rounded-lg"
                      style={{ background: '#16A34A', color: 'white', border: 'none', cursor: 'pointer' }}
                    >
                      View Result →
                    </button>
                  ) : status === 'Not Submitted' ? (
                    <button
                      onClick={() => onNavigate('submissions')}
                      className="text-sm font-semibold px-4 py-2 rounded-lg"
                      style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}
                    >
                      Submit Repository →
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate('submissions')}
                      className="text-sm px-4 py-2 rounded-lg"
                      style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}
                    >
                      View Status
                    </button>
                  )}
                </div>
              </div>

              {/* Rubric preview */}
              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <p className="text-xs font-medium mb-2" style={{ color: 'var(--muted-foreground)' }}>Evaluation Criteria ({a.rubric.length} criteria · {a.maxScore} pts total)</p>
                <div className="flex flex-wrap gap-2">
                  {a.rubric.map((c) => (
                    <span key={c.id} className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)' }}>
                      {c.name} · {c.maxScore}pts
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
