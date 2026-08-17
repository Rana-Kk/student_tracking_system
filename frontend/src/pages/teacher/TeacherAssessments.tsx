import { useState, useMemo } from 'react'
import { ASSESSMENTS, GROUPS, SUBMISSIONS, AI_EVALUATIONS, STUDENTS, TEAMS } from '../../data/mockData'
import type { Assessment, SubmissionMode, SubmissionStatus } from '../../types'

/* ────────────────────────────────────────────────────────────────────
   Shared helpers
───────────────────────────────────────────────────────────────────── */

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  Project:        { bg: '#DBEAFE', color: '#1E40AF' },
  Assignment:     { bg: '#F3E8FF', color: '#6D28D9' },
  Presentation:   { bg: '#CFFAFE', color: '#0E7490' },
  Practical:      { bg: '#FEF3C7', color: '#92400E' },
  'Final Project':{ bg: '#FCE7F3', color: '#9D174D' },
  Other:          { bg: '#F1F5F9', color: '#475569' },
}

const STATUS_CFG: Record<SubmissionStatus, { bg: string; color: string; label: string }> = {
  'Not Submitted': { bg: '#F1F5F9', color: '#64748B', label: 'Not Submitted' },
  'Submitted':     { bg: '#DBEAFE', color: '#1E40AF', label: 'Submitted' },
  'Analyzing':     { bg: '#EDE9FE', color: '#6D28D9', label: 'Analyzing' },
  'AI Draft Ready':{ bg: '#FEF3C7', color: '#B45309', label: 'AI Draft Ready' },
  'Teacher Review':{ bg: '#FEF3C7', color: '#92400E', label: 'Review Required' },
  'Approved':      { bg: '#DCFCE7', color: '#15803D', label: 'Approved' },
  'Rejected':      { bg: '#FEE2E2', color: '#B91C1C', label: 'Rejected' },
}

function StatusPill({ status }: { status: SubmissionStatus }) {
  const c = STATUS_CFG[status]
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: c.bg, color: c.color }}>
      {c.label}
    </span>
  )
}

function ModeTag({ mode }: { mode: SubmissionMode }) {
  return (
    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: mode === 'Team' ? '#EDE9FE' : '#DBEAFE', color: mode === 'Team' ? '#6D28D9' : '#1E40AF' }}>
      {mode}
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────
   Assessment card — shown inside each group section
───────────────────────────────────────────────────────────────────── */

function assessmentStats(a: Assessment) {
  const subs = SUBMISSIONS.filter(s => s.assessmentId === a.id)
  const total = a.submissionMode === 'Team' ? TEAMS.filter(t => t.groupId === a.groupId).length : STUDENTS.length
  const submitted = subs.filter(s => s.status !== 'Not Submitted').length
  const approved = subs.filter(s => s.status === 'Approved').length
  const needsReview = subs.filter(s => s.status === 'Teacher Review' || s.status === 'AI Draft Ready').length
  const analyzing = subs.filter(s => s.status === 'Analyzing').length
  return { submitted, approved, needsReview, analyzing, total: Math.max(total, subs.length) }
}

function AssessmentCard({ a, onClick }: { a: Assessment; onClick: () => void }) {
  const tc = TYPE_COLORS[a.type] ?? TYPE_COLORS.Other
  const { submitted, approved, needsReview, analyzing, total } = assessmentStats(a)
  const pct = total > 0 ? Math.round((submitted / total) * 100) : 0
  const overdue = new Date(a.dueDate) < new Date() && submitted < total

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl p-4 transition-shadow hover:shadow-md"
      style={{ background: 'var(--card)', border: '1px solid var(--border)', cursor: 'pointer' }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: tc.bg, color: tc.color }}>{a.type}</span>
          <ModeTag mode={a.submissionMode} />
          {overdue && <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: '#FEE2E2', color: '#B91C1C' }}>Overdue</span>}
        </div>
        <span className="text-xs mono flex-shrink-0" style={{ color: 'var(--muted-foreground)' }}>Due {a.dueDate}</span>
      </div>

      {/* Title */}
      <p className="text-sm font-semibold mb-3 leading-snug" style={{ fontFamily: 'Outfit, sans-serif' }}>{a.title}</p>

      {/* Submission progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
          <span>Submissions</span>
          <span className="mono">{submitted}/{total}</span>
        </div>
        <div className="rounded-full overflow-hidden" style={{ height: '5px', background: 'var(--secondary)' }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct === 100 ? '#15803D' : 'var(--primary)' }} />
        </div>
      </div>

      {/* Status counts */}
      <div className="flex items-center gap-3 flex-wrap">
        {approved > 0 && (
          <span className="flex items-center gap-1 text-xs" style={{ color: '#15803D' }}>
            <span>✓</span><span className="mono">{approved} approved</span>
          </span>
        )}
        {needsReview > 0 && (
          <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: '#B45309' }}>
            <span>⚑</span><span className="mono">{needsReview} needs review</span>
          </span>
        )}
        {analyzing > 0 && (
          <span className="flex items-center gap-1 text-xs" style={{ color: '#6D28D9' }}>
            <span>✦</span><span className="mono">{analyzing} analyzing</span>
          </span>
        )}
        {submitted === 0 && (
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>No submissions yet</span>
        )}
        <span className="ml-auto text-xs" style={{ color: 'var(--muted-foreground)' }}>{a.maxScore} pts</span>
      </div>
    </button>
  )
}

/* ────────────────────────────────────────────────────────────────────
   Assessment Detail — 5 tabs
───────────────────────────────────────────────────────────────────── */

type DetailTab = 'overview' | 'rubric' | 'submissions' | 'evaluations' | 'results'

function AssessmentDetail({ a, onBack }: { a: Assessment; onBack: () => void }) {
  const [tab, setTab] = useState<DetailTab>('overview')
  const group = GROUPS.find(g => g.id === a.groupId)
  const subs = SUBMISSIONS.filter(s => s.assessmentId === a.id)
  const evals = AI_EVALUATIONS.filter(e => subs.some(s => s.id === e.submissionId))
  const { submitted, approved, needsReview, total } = assessmentStats(a)
  const tc = TYPE_COLORS[a.type] ?? TYPE_COLORS.Other

  const TABS: { id: DetailTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'rubric', label: 'Evaluation Criteria' },
    { id: 'submissions', label: `Submissions (${subs.filter(s => s.status !== 'Not Submitted').length})` },
    { id: 'evaluations', label: `AI Evaluations (${evals.length})` },
    { id: 'results', label: 'Results' },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: 0, fontSize: '14px' }}>
          ← Assessments
        </button>
        <span>/</span>
        <span className="font-medium" style={{ color: 'var(--foreground)' }}>{group?.name}</span>
        <span>/</span>
        <span className="font-medium" style={{ color: 'var(--foreground)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</span>
      </div>

      {/* Header */}
      <div className="rounded-xl p-5 mb-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md" style={{ background: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE' }}>
                📌 {group?.name}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: tc.bg, color: tc.color }}>{a.type}</span>
              <ModeTag mode={a.submissionMode} />
            </div>
            <h1 className="text-xl font-semibold mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>{a.title}</h1>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{a.description}</p>
          </div>
          <div className="flex gap-4 flex-shrink-0">
            {[
              { label: 'Assessment Date', value: a.assessmentDate },
              { label: 'Due Date', value: a.dueDate },
              { label: 'Max Score', value: `${a.maxScore} pts` },
            ].map(({ label, value }) => (
              <div key={label} className="text-right">
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
                <p className="text-sm font-semibold mono">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stat row */}
        <div className="mt-4 pt-4 flex gap-6 flex-wrap" style={{ borderTop: '1px solid var(--border)' }}>
          {[
            { label: 'Total Submitters', value: total, color: 'var(--foreground)' },
            { label: 'Submitted', value: submitted, color: '#1D4ED8' },
            { label: 'Approved', value: approved, color: '#15803D' },
            { label: 'Needs Review', value: needsReview, color: '#B45309' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <p className="text-2xl font-bold mono" style={{ color }}>{value}</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
            </div>
          ))}
          <div className="flex-1 flex items-end pb-1 min-w-32">
            <div className="w-full">
              <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
                <span>Submission progress</span>
                <span className="mono">{total > 0 ? Math.round((submitted / total) * 100) : 0}%</span>
              </div>
              <div className="rounded-full overflow-hidden" style={{ height: '6px', background: 'var(--secondary)' }}>
                <div className="h-full rounded-full" style={{ width: `${total > 0 ? (submitted / total) * 100 : 0}%`, background: 'var(--primary)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-5 border-b" style={{ borderColor: 'var(--border)' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="px-4 py-2.5 text-sm font-medium whitespace-nowrap"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: tab === t.id ? 'var(--primary)' : 'var(--muted-foreground)',
              borderBottom: tab === t.id ? '2px solid var(--primary)' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && <OverviewTab a={a} group={group} subs={subs} evals={evals} />}
      {tab === 'rubric' && <RubricTab a={a} />}
      {tab === 'submissions' && <SubmissionsTab a={a} subs={subs} />}
      {tab === 'evaluations' && <EvaluationsTab a={a} subs={subs} evals={evals} />}
      {tab === 'results' && <ResultsTab a={a} subs={subs} evals={evals} />}
    </div>
  )
}

/* ── Overview tab ── */
function OverviewTab({ a, group, subs, evals }: { a: Assessment; group: any; subs: any[]; evals: any[] }) {
  const groupStudents = a.submissionMode === 'Individual' ? STUDENTS.slice(0, group?.studentCount ?? 8) : []
  const groupTeams = a.submissionMode === 'Team' ? TEAMS.filter(t => t.groupId === a.groupId) : []

  return (
    <div className="space-y-5">
      {/* Submission mode explanation */}
      <div className="rounded-xl p-4" style={{ background: a.submissionMode === 'Individual' ? '#EFF6FF' : '#F5F3FF', border: `1px solid ${a.submissionMode === 'Individual' ? '#BFDBFE' : '#DDD6FE'}` }}>
        <p className="text-xs font-semibold mb-2" style={{ color: a.submissionMode === 'Individual' ? '#1E40AF' : '#6D28D9' }}>
          {a.submissionMode === 'Individual' ? '● Individual Submission Mode' : '⬡ Team Submission Mode'}
        </p>
        <p className="text-xs" style={{ color: a.submissionMode === 'Individual' ? '#1D4ED8' : '#7C3AED' }}>
          {a.submissionMode === 'Individual'
            ? `Each of the ${group?.studentCount ?? ''} students in ${group?.name} submits their own GitHub repository. AI evaluates each repository separately. Teacher reviews and approves each student's score individually.`
            : `Each team in ${group?.name} submits one shared GitHub repository. AI evaluates each team repository. Teacher reviews and approves each team's score.`}
        </p>
      </div>

      {/* Per-entity status grid */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
            {a.submissionMode === 'Individual' ? 'Student Status' : 'Team Status'}
          </p>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
          {(a.submissionMode === 'Individual' ? groupStudents : groupTeams).map((entity: any) => {
            const sub = subs.find(s => a.submissionMode === 'Individual' ? s.studentId === entity.id : s.teamId === entity.id)
            const ev = evals.find(e => e.submissionId === sub?.id)
            return (
              <div key={entity.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: a.submissionMode === 'Individual' ? '#0891B2' : '#7C3AED' }}>
                  {entity.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{entity.name}</p>
                  {sub?.githubUrl && <p className="text-xs mono truncate" style={{ color: 'var(--muted-foreground)' }}>{sub.githubUrl}</p>}
                </div>
                <StatusPill status={sub?.status ?? 'Not Submitted'} />
                {ev && (
                  <span className="text-xs mono font-semibold" style={{ color: ev.status === 'Approved' ? '#15803D' : '#B45309' }}>
                    {ev.totalTeacherScore}/{ev.maxScore}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ── Rubric tab ── */
function RubricTab({ a }: { a: Assessment }) {
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <div>
          <p className="text-sm font-semibold">{a.rubric.length} criteria · {a.maxScore} pts total</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            Applied {a.submissionMode === 'Individual' ? 'per student' : 'per team'}
          </p>
        </div>
        <button className="text-xs px-3 py-1.5 rounded-lg" style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}>+ Add Criterion</button>
      </div>
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
            {['#', 'Criterion', 'Description', 'Max Score', ''].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {a.rubric.map((c, i) => (
            <tr key={c.id} style={{ borderBottom: i < a.rubric.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <td className="px-4 py-3.5 text-xs mono" style={{ color: 'var(--muted-foreground)' }}>{c.order}</td>
              <td className="px-4 py-3.5 text-sm font-medium">{c.name}</td>
              <td className="px-4 py-3.5 text-xs" style={{ color: 'var(--muted-foreground)', maxWidth: '260px' }}>{c.description}</td>
              <td className="px-4 py-3.5 text-sm mono font-semibold">{c.maxScore}</td>
              <td className="px-4 py-3.5">
                <button className="text-xs px-2 py-1 rounded" style={{ color: 'var(--muted-foreground)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Edit</button>
              </td>
            </tr>
          ))}
          <tr style={{ borderTop: '2px solid var(--border)', background: 'var(--muted)' }}>
            <td colSpan={3} className="px-4 py-3 text-sm font-semibold">Total</td>
            <td className="px-4 py-3 text-sm mono font-semibold">{a.maxScore}</td>
            <td />
          </tr>
        </tbody>
      </table>
    </div>
  )
}

/* ── Submissions tab ── */
function SubmissionsTab({ a, subs }: { a: Assessment; subs: any[] }) {
  const group = GROUPS.find(g => g.id === a.groupId)
  const groupStudents = a.submissionMode === 'Individual' ? STUDENTS.slice(0, group?.studentCount ?? 8) : []
  const groupTeams = a.submissionMode === 'Team' ? TEAMS.filter(t => t.groupId === a.groupId) : []

  const rows = a.submissionMode === 'Individual'
    ? groupStudents.map(s => ({ entity: s, sub: subs.find(sub => sub.studentId === s.id) }))
    : groupTeams.map(t => ({ entity: t, sub: subs.find(sub => sub.teamId === t.id) }))

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}>
        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
          {a.submissionMode === 'Individual' ? 'Individual Student Submissions' : 'Team Submissions'}
        </p>
      </div>
      <table className="w-full">
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
            {(a.submissionMode === 'Individual'
              ? ['Student', 'GitHub Repository', 'Submitted At', 'Status']
              : ['Team', 'Members', 'GitHub Repository', 'Submitted At', 'Status']
            ).map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ entity, sub }, i) => (
            <tr key={entity.id} style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none' }}>
              {a.submissionMode === 'Individual' ? (
                <td className="px-4 py-3.5 text-sm font-medium">{entity.name}</td>
              ) : (
                <>
                  <td className="px-4 py-3.5 text-sm font-medium">{entity.name}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {(entity.memberNames ?? []).map((m: string) => (
                        <span key={m} className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)' }}>{m.split(' ')[0]}</span>
                      ))}
                    </div>
                  </td>
                </>
              )}
              <td className="px-4 py-3.5">
                {sub?.githubUrl
                  ? <span className="text-xs mono" style={{ color: 'var(--primary)' }}>⎇ {sub.githubUrl}</span>
                  : <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>—</span>}
              </td>
              <td className="px-4 py-3.5 text-xs mono" style={{ color: 'var(--muted-foreground)' }}>
                {sub?.submittedAt ? new Date(sub.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
              </td>
              <td className="px-4 py-3.5"><StatusPill status={sub?.status ?? 'Not Submitted'} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ── AI Evaluations tab ── */
function EvaluationsTab({ a, subs, evals }: { a: Assessment; subs: any[]; evals: any[] }) {
  const [expandedEval, setExpandedEval] = useState<string | null>(null)

  if (evals.length === 0) {
    return (
      <div className="rounded-xl py-16 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <p className="text-2xl mb-2">✦</p>
        <p className="font-medium" style={{ color: 'var(--muted-foreground)' }}>No AI evaluations yet</p>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Evaluations appear once submissions have been analyzed.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {evals.map(ev => {
        const sub = subs.find(s => s.id === ev.submissionId)
        const expanded = expandedEval === ev.id
        const evStatusColor = ev.status === 'Approved' ? { bg: '#DCFCE7', color: '#15803D' } : ev.status === 'Rejected' ? { bg: '#FEE2E2', color: '#B91C1C' } : { bg: '#FEF3C7', color: '#B45309' }

        return (
          <div key={ev.id} className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div
              className="flex items-center gap-4 px-5 py-4 cursor-pointer"
              style={{ background: 'var(--card)' }}
              onClick={() => setExpandedEval(expanded ? null : ev.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold">{ev.teamName ?? ev.studentName ?? 'Unknown'}</p>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: evStatusColor.bg, color: evStatusColor.color }}>{ev.status}</span>
                </div>
                <p className="text-xs mono truncate" style={{ color: 'var(--muted-foreground)' }}>{ev.githubUrl}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold mono">{ev.totalTeacherScore}<span className="text-xs font-normal">/{ev.maxScore}</span></p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{Math.round((ev.totalTeacherScore / ev.maxScore) * 100)}%</p>
              </div>
              <span style={{ color: 'var(--muted-foreground)', fontSize: '12px' }}>{expanded ? '▲' : '▼'}</span>
            </div>

            {expanded && (
              <div className="px-5 pb-5 pt-1" style={{ borderTop: '1px solid var(--border)' }}>
                <table className="w-full mb-4">
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Criterion', 'Max', '✦ AI Score', 'Final Score', 'Rationale'].map(h => (
                        <th key={h} className="px-3 py-2 text-left text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ev.criterionScores.map((cs: any, i: number) => (
                      <tr key={cs.criterionId} style={{ borderBottom: i < ev.criterionScores.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <td className="px-3 py-2.5 text-sm font-medium">{cs.criterionName}</td>
                        <td className="px-3 py-2.5 text-xs mono">{cs.maxScore}</td>
                        <td className="px-3 py-2.5">
                          <span className="text-xs mono font-semibold px-2 py-0.5 rounded-full" style={{ background: '#FEF3C7', color: '#B45309' }}>{cs.aiRecommendedScore}</span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="text-xs mono font-semibold px-2 py-0.5 rounded-full" style={{ background: cs.teacherOverride ? '#DCFCE7' : 'var(--secondary)', color: cs.teacherOverride ? '#15803D' : 'var(--foreground)' }}>
                            {cs.teacherFinalScore}{cs.teacherOverride && ' ↑'}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-xs" style={{ color: 'var(--muted-foreground)', maxWidth: '200px' }}>{cs.aiRationale}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {ev.reviewedBy && (
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Reviewed by {ev.reviewedBy} · {ev.reviewedAt ? new Date(ev.reviewedAt).toLocaleDateString() : ''}</p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Results tab ── */
function ResultsTab({ a, subs, evals }: { a: Assessment; subs: any[]; evals: any[] }) {
  const group = GROUPS.find(g => g.id === a.groupId)
  const approvedEvals = evals.filter(e => e.status === 'Approved')
  const avgScore = approvedEvals.length > 0
    ? Math.round(approvedEvals.reduce((s, e) => s + (e.totalTeacherScore / e.maxScore) * 100, 0) / approvedEvals.length)
    : 0

  const groupStudents = a.submissionMode === 'Individual' ? STUDENTS.slice(0, group?.studentCount ?? 8) : []
  const groupTeams = a.submissionMode === 'Team' ? TEAMS.filter(t => t.groupId === a.groupId) : []
  const entities = a.submissionMode === 'Individual' ? groupStudents : groupTeams

  if (approvedEvals.length === 0) {
    return (
      <div className="rounded-xl py-16 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <p className="text-2xl mb-2">📊</p>
        <p className="font-medium" style={{ color: 'var(--muted-foreground)' }}>No results yet</p>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Results appear once evaluations are approved.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Evaluations Approved', value: `${approvedEvals.length}/${entities.length}`, color: '#15803D' },
          { label: 'Group Average', value: `${avgScore}%`, color: 'var(--primary)' },
          { label: 'Max Score', value: `${a.maxScore} pts`, color: 'var(--foreground)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <p className="text-2xl font-bold mono" style={{ color }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Per-entity results table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
            {a.submissionMode === 'Individual' ? 'Per-Student Results' : 'Per-Team Results'}
          </p>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
              {[a.submissionMode === 'Individual' ? 'Student' : 'Team', 'Score', '%', 'Criteria breakdown', 'Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entities.map((entity: any, i: number) => {
              const sub = subs.find(s => a.submissionMode === 'Individual' ? s.studentId === entity.id : s.teamId === entity.id)
              const ev = evals.find(e => e.submissionId === sub?.id)
              const pct = ev ? Math.round((ev.totalTeacherScore / ev.maxScore) * 100) : null

              return (
                <tr key={entity.id} style={{ borderBottom: i < entities.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td className="px-4 py-3.5 text-sm font-medium">{entity.name}</td>
                  <td className="px-4 py-3.5 text-sm mono font-semibold">
                    {ev ? `${ev.totalTeacherScore}/${ev.maxScore}` : '—'}
                  </td>
                  <td className="px-4 py-3.5">
                    {pct !== null
                      ? <span className="text-xs font-semibold mono px-2 py-0.5 rounded-full" style={{ background: pct >= 80 ? '#DCFCE7' : pct >= 60 ? '#FEF3C7' : '#FEE2E2', color: pct >= 80 ? '#15803D' : pct >= 60 ? '#B45309' : '#B91C1C' }}>{pct}%</span>
                      : <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>—</span>}
                  </td>
                  <td className="px-4 py-3.5">
                    {ev ? (
                      <div className="flex gap-1 flex-wrap">
                        {ev.criterionScores.map((cs: any) => (
                          <div key={cs.criterionId} title={`${cs.criterionName}: ${cs.teacherFinalScore}/${cs.maxScore}`} className="w-2 rounded-full" style={{ height: '24px', background: `hsl(${(cs.teacherFinalScore / cs.maxScore) * 120}, 60%, 50%)`, opacity: 0.8 }} />
                        ))}
                      </div>
                    ) : <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>—</span>}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusPill status={sub?.status ?? 'Not Submitted'} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────
   Create Wizard (unchanged logic, extracted here)
───────────────────────────────────────────────────────────────────── */

const STEPS = ['Group & Mode', 'Details', 'Rubric', 'Publish'] as const
type WizardStep = 0 | 1 | 2 | 3
interface RubricRow { id: string; name: string; description: string; maxScore: number }
interface WizardState {
  groupId: string; mode: SubmissionMode; title: string; description: string; type: string
  assessmentDate: string; dueDate: string; maxScore: string; rubric: RubricRow[]
}
const EMPTY_WIZARD: WizardState = {
  groupId: '', mode: 'Individual', title: '', description: '', type: 'Project',
  assessmentDate: '', dueDate: '', maxScore: '100',
  rubric: [{ id: 'r1', name: '', description: '', maxScore: 25 }, { id: 'r2', name: '', description: '', maxScore: 25 }],
}

function StepIndicator({ step }: { step: WizardStep }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {STEPS.map((label, i) => {
        const done = i < step; const active = i === step
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: done ? '#15803D' : active ? 'var(--primary)' : 'var(--secondary)', color: done || active ? 'white' : 'var(--muted-foreground)' }}>
                {done ? '✓' : i + 1}
              </div>
              <span className="text-xs mt-1 whitespace-nowrap" style={{ color: active ? 'var(--foreground)' : 'var(--muted-foreground)', fontWeight: active ? 600 : 400 }}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <div className="h-px w-10 mx-1 mb-5 flex-shrink-0" style={{ background: i < step ? '#15803D' : 'var(--border)' }} />}
          </div>
        )
      })}
    </div>
  )
}

function CreateWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<WizardStep>(0)
  const [form, setForm] = useState<WizardState>(EMPTY_WIZARD)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [published, setPublished] = useState(false)
  const set = <K extends keyof WizardState>(k: K, v: WizardState[K]) => setForm(p => ({ ...p, [k]: v }))

  function validate() {
    const e: Record<string, string> = {}
    if (step === 0 && !form.groupId) e.groupId = 'Please select a group'
    if (step === 1) {
      if (!form.title.trim()) e.title = 'Title is required'
      if (!form.assessmentDate) e.assessmentDate = 'Required'
      if (!form.dueDate) e.dueDate = 'Required'
      if (!form.maxScore || isNaN(Number(form.maxScore))) e.maxScore = 'Enter a valid number'
    }
    if (step === 2) {
      form.rubric.forEach((r, i) => { if (!r.name.trim()) e[`rname-${i}`] = 'Required' })
      const total = form.rubric.reduce((s, r) => s + Number(r.maxScore || 0), 0)
      if (total !== Number(form.maxScore)) e.rubricTotal = `Criterion scores must sum to ${form.maxScore} (currently ${total})`
    }
    setErrors(e); return Object.keys(e).length === 0
  }

  const selectedGroup = GROUPS.find(g => g.id === form.groupId)
  const rubricTotal = form.rubric.reduce((s, r) => s + Number(r.maxScore || 0), 0)

  if (published) return (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4" style={{ background: '#DCFCE7' }}>✓</div>
      <h3 className="text-lg font-semibold mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Assessment Published!</h3>
      <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
        <strong>{form.title}</strong> assigned to <strong>{selectedGroup?.name}</strong> ({form.mode} mode).
      </p>
      <button onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-semibold" style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}>Done</button>
    </div>
  )

  return (
    <div>
      <StepIndicator step={step} />

      {step === 0 && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Group / Class <span style={{ color: '#EF4444' }}>*</span></label>
            <select value={form.groupId} onChange={e => set('groupId', e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: `1px solid ${errors.groupId ? '#EF4444' : 'var(--border)'}`, background: 'var(--muted)', outline: 'none' }}>
              <option value="">Select a group…</option>
              {GROUPS.map(g => <option key={g.id} value={g.id}>{g.name} — {g.courseName}</option>)}
            </select>
            {errors.groupId && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.groupId}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Submission Mode</label>
            <div className="grid grid-cols-2 gap-3">
              {(['Individual', 'Team'] as SubmissionMode[]).map(mode => {
                const active = form.mode === mode
                return (
                  <button key={mode} type="button" onClick={() => set('mode', mode)} className="p-4 rounded-xl text-left" style={{ border: `2px solid ${active ? 'var(--primary)' : 'var(--border)'}`, background: active ? '#EFF6FF' : 'var(--muted)', cursor: 'pointer' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: active ? 'var(--primary)' : 'var(--border)' }}>
                        {active && <div className="w-2 h-2 rounded-full" style={{ background: 'var(--primary)' }} />}
                      </div>
                      <span className="text-sm font-semibold" style={{ color: active ? 'var(--primary)' : 'var(--foreground)' }}>{mode}</span>
                    </div>
                    <div className="text-xs space-y-0.5" style={{ color: 'var(--muted-foreground)' }}>
                      {mode === 'Individual' ? <><p>Each student → own GitHub repo</p><p>AI evaluates each repo separately</p></> : <><p>Each team → one shared GitHub repo</p><p>AI evaluates per team</p></>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
          {form.groupId && (
            <div className="rounded-lg p-4" style={{ background: form.mode === 'Individual' ? '#EFF6FF' : '#F5F3FF', border: `1px solid ${form.mode === 'Individual' ? '#BFDBFE' : '#DDD6FE'}` }}>
              <p className="text-xs font-semibold mb-2" style={{ color: form.mode === 'Individual' ? '#1E40AF' : '#6D28D9' }}>Flow preview</p>
              {form.mode === 'Individual' ? (
                <div className="text-xs space-y-1 mono" style={{ color: '#1E40AF' }}>
                  <p>{selectedGroup?.name}</p>
                  <p className="pl-3">├── Student A → GitHub Repo A → AI Eval → Teacher Review</p>
                  <p className="pl-3">└── Student B → GitHub Repo B → AI Eval → Teacher Review</p>
                </div>
              ) : (
                <div className="text-xs space-y-1 mono" style={{ color: '#6D28D9' }}>
                  <p>{selectedGroup?.name}</p>
                  <p className="pl-3">├── Team 1 → GitHub Repo 1 → AI Eval → Teacher Review</p>
                  <p className="pl-3">└── Team 2 → GitHub Repo 2 → AI Eval → Teacher Review</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 mb-1">
            <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: '#EFF6FF', color: '#1E40AF' }}>📌 {selectedGroup?.name}</span>
            <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: form.mode === 'Individual' ? '#DBEAFE' : '#EDE9FE', color: form.mode === 'Individual' ? '#1E40AF' : '#6D28D9' }}>{form.mode}</span>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Title <span style={{ color: '#EF4444' }}>*</span></label>
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. React Component Architecture" className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: `1px solid ${errors.title ? '#EF4444' : 'var(--border)'}`, background: 'var(--muted)', outline: 'none' }} />
            {errors.title && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.title}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="What should students build or demonstrate?" rows={3} className="w-full px-3 py-2.5 rounded-lg text-sm resize-none" style={{ border: '1px solid var(--border)', background: 'var(--muted)', outline: 'none' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Type</label>
            <select value={form.type} onChange={e => set('type', e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1px solid var(--border)', background: 'var(--muted)', outline: 'none' }}>
              {['Project', 'Assignment', 'Presentation', 'Practical', 'Final Project', 'Other'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'assessmentDate' as const, label: 'Assessment Date' },
              { key: 'dueDate' as const, label: 'Due Date' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>{label} <span style={{ color: '#EF4444' }}>*</span></label>
                <input type="date" value={form[key]} onChange={e => set(key, e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: `1px solid ${errors[key] ? '#EF4444' : 'var(--border)'}`, background: 'var(--muted)', outline: 'none' }} />
              </div>
            ))}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Max Score <span style={{ color: '#EF4444' }}>*</span></label>
              <input type="number" value={form.maxScore} onChange={e => set('maxScore', e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: `1px solid ${errors.maxScore ? '#EF4444' : 'var(--border)'}`, background: 'var(--muted)', outline: 'none' }} />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium">Evaluation Criteria</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Scores must total {form.maxScore} pts.</p>
            </div>
            <button onClick={() => setForm(p => ({ ...p, rubric: [...p.rubric, { id: `r${Date.now()}`, name: '', description: '', maxScore: 0 }] }))} className="text-xs px-3 py-1.5 rounded-lg" style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}>+ Add</button>
          </div>
          <div className="space-y-2 mb-3">
            {form.rubric.map((r, i) => (
              <div key={r.id} className="flex items-start gap-2 rounded-lg p-3" style={{ border: '1px solid var(--border)', background: 'var(--muted)' }}>
                <span className="text-xs mono pt-2.5 w-5 flex-shrink-0" style={{ color: 'var(--muted-foreground)' }}>{i + 1}</span>
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <div>
                    <input value={r.name} onChange={e => setForm(p => ({ ...p, rubric: p.rubric.map(x => x.id === r.id ? { ...x, name: e.target.value } : x) }))} placeholder="Criterion name" className="w-full px-2.5 py-2 rounded-md text-xs" style={{ border: `1px solid ${errors[`rname-${i}`] ? '#EF4444' : 'var(--border)'}`, background: 'var(--card)', outline: 'none' }} />
                  </div>
                  <div>
                    <input value={r.description} onChange={e => setForm(p => ({ ...p, rubric: p.rubric.map(x => x.id === r.id ? { ...x, description: e.target.value } : x) }))} placeholder="Description" className="w-full px-2.5 py-2 rounded-md text-xs" style={{ border: '1px solid var(--border)', background: 'var(--card)', outline: 'none' }} />
                  </div>
                  <div>
                    <input type="number" value={r.maxScore} onChange={e => setForm(p => ({ ...p, rubric: p.rubric.map(x => x.id === r.id ? { ...x, maxScore: Number(e.target.value) } : x) }))} placeholder="Pts" className="w-full px-2.5 py-2 rounded-md text-xs" style={{ border: '1px solid var(--border)', background: 'var(--card)', outline: 'none' }} />
                  </div>
                </div>
                <button onClick={() => setForm(p => ({ ...p, rubric: p.rubric.filter(x => x.id !== r.id) }))} disabled={form.rubric.length <= 1} className="text-xs pt-2 px-1" style={{ color: '#EF4444', background: 'none', border: 'none', cursor: form.rubric.length > 1 ? 'pointer' : 'not-allowed', opacity: form.rubric.length > 1 ? 1 : 0.3 }}>✕</button>
              </div>
            ))}
          </div>
          <div className="flex justify-between px-1">
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{form.rubric.length} criteria</span>
            <span className="text-xs font-semibold mono" style={{ color: rubricTotal === Number(form.maxScore) ? '#15803D' : '#B45309' }}>Total: {rubricTotal} / {form.maxScore} pts</span>
          </div>
          {errors.rubricTotal && <p className="text-xs mt-2" style={{ color: '#EF4444' }}>{errors.rubricTotal}</p>}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="rounded-xl p-4" style={{ background: 'var(--muted)', border: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--muted-foreground)' }}>Summary</p>
            {[['Group / Class', selectedGroup?.name ?? '—'], ['Submission Mode', form.mode], ['Title', form.title], ['Type', form.type], ['Assessment Date', form.assessmentDate], ['Due Date', form.dueDate], ['Max Score', `${form.maxScore} pts`], ['Criteria', `${form.rubric.length} criteria`]].map(([l, v]) => (
              <div key={l} className="flex justify-between text-sm py-1">
                <span style={{ color: 'var(--muted-foreground)' }}>{l}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>
          <div className="rounded-lg p-4" style={{ background: form.mode === 'Individual' ? '#EFF6FF' : '#F5F3FF', border: `1px solid ${form.mode === 'Individual' ? '#BFDBFE' : '#DDD6FE'}` }}>
            <p className="text-xs" style={{ color: form.mode === 'Individual' ? '#1D4ED8' : '#7C3AED' }}>
              {form.mode === 'Individual'
                ? `All students in ${selectedGroup?.name} will submit individually. Each GitHub repository is evaluated separately by AI, and you review each student's score.`
                : `Each team in ${selectedGroup?.name} submits one shared repository. AI evaluates each team, and you review each team's score.`}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-6 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
        <button onClick={() => { if (step === 0) onClose(); else { setErrors({}); setStep(s => (s - 1) as WizardStep) } }} className="px-5 py-2.5 rounded-lg text-sm" style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}>
          {step === 0 ? 'Cancel' : '← Back'}
        </button>
        <div className="flex-1" />
        {step < 3
          ? <button onClick={() => { if (validate()) setStep(s => (s + 1) as WizardStep) }} className="px-6 py-2.5 rounded-lg text-sm font-semibold" style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}>{step === 2 ? 'Review & Publish →' : 'Continue →'}</button>
          : <button onClick={() => setPublished(true)} className="px-6 py-2.5 rounded-lg text-sm font-semibold" style={{ background: '#15803D', color: 'white', border: 'none', cursor: 'pointer' }}>Publish Assessment</button>}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────
   Main page — grouped by Group/Class
───────────────────────────────────────────────────────────────────── */

type FilterMode = 'all' | SubmissionMode
type FilterStatus = 'all' | 'pending' | 'in_progress' | 'completed'

export default function TeacherAssessments() {
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [showCreate, setShowCreate] = useState(false)

  // Filters
  const [filterGroup, setFilterGroup] = useState('all')
  const [filterMode, setFilterMode] = useState<FilterMode>('all')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')

  const types = useMemo(() => ['all', ...Array.from(new Set(ASSESSMENTS.map(a => a.type)))], [])

  const filtered = useMemo(() => ASSESSMENTS.filter(a => {
    if (filterGroup !== 'all' && a.groupId !== filterGroup) return false
    if (filterMode !== 'all' && a.submissionMode !== filterMode) return false
    if (filterType !== 'all' && a.type !== filterType) return false
    if (filterStatus !== 'all') {
      const { submitted, approved, total } = assessmentStats(a)
      if (filterStatus === 'pending' && submitted > 0) return false
      if (filterStatus === 'in_progress' && (submitted === 0 || approved === total)) return false
      if (filterStatus === 'completed' && approved < total) return false
    }
    return true
  }), [filterGroup, filterMode, filterType, filterStatus])

  // Group filtered assessments by group
  const byGroup = useMemo(() => {
    const map = new Map<string, { group: typeof GROUPS[0]; assessments: Assessment[] }>()
    GROUPS.forEach(g => map.set(g.id, { group: g, assessments: [] }))
    filtered.forEach(a => { map.get(a.groupId)?.assessments.push(a) })
    return [...map.values()].filter(v => v.assessments.length > 0)
  }, [filtered])

  if (selectedAssessment) {
    return <AssessmentDetail a={selectedAssessment} onBack={() => setSelectedAssessment(null)} />
  }

  const totalAssessments = ASSESSMENTS.length
  const totalPending = ASSESSMENTS.filter(a => {
    const subs = SUBMISSIONS.filter(s => s.assessmentId === a.id && (s.status === 'Teacher Review' || s.status === 'AI Draft Ready'))
    return subs.length > 0
  }).length

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Assessments</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
            {totalAssessments} assessments across {GROUPS.length} groups
            {totalPending > 0 && <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#FEF3C7', color: '#B45309' }}>⚑ {totalPending} need review</span>}
          </p>
        </div>
        <button onClick={() => setShowCreate(true)} className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}>
          + New Assessment
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-6 p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Group</label>
          <select value={filterGroup} onChange={e => setFilterGroup(e.target.value)} className="text-sm px-2.5 py-1.5 rounded-lg" style={{ border: '1px solid var(--border)', background: 'var(--muted)', outline: 'none' }}>
            <option value="all">All Groups</option>
            {GROUPS.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Mode</label>
          <select value={filterMode} onChange={e => setFilterMode(e.target.value as FilterMode)} className="text-sm px-2.5 py-1.5 rounded-lg" style={{ border: '1px solid var(--border)', background: 'var(--muted)', outline: 'none' }}>
            <option value="all">All Modes</option>
            <option value="Individual">Individual</option>
            <option value="Team">Team</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Type</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="text-sm px-2.5 py-1.5 rounded-lg" style={{ border: '1px solid var(--border)', background: 'var(--muted)', outline: 'none' }}>
            {types.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Status</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as FilterStatus)} className="text-sm px-2.5 py-1.5 rounded-lg" style={{ border: '1px solid var(--border)', background: 'var(--muted)', outline: 'none' }}>
            <option value="all">All Statuses</option>
            <option value="pending">Pending (no submissions)</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        {(filterGroup !== 'all' || filterMode !== 'all' || filterType !== 'all' || filterStatus !== 'all') && (
          <button onClick={() => { setFilterGroup('all'); setFilterMode('all'); setFilterType('all'); setFilterStatus('all') }} className="text-xs px-2.5 py-1.5 rounded-lg ml-auto" style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', color: 'var(--muted-foreground)' }}>
            Clear filters
          </button>
        )}
      </div>

      {/* Grouped list */}
      {byGroup.length === 0 ? (
        <div className="rounded-xl py-16 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <p className="font-medium" style={{ color: 'var(--muted-foreground)' }}>No assessments match the selected filters.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {byGroup.map(({ group, assessments }) => (
            <div key={group.id}>
              {/* Group header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: 'var(--primary)' }}>
                  {group.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>{group.name}</h2>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{group.courseName} · {group.studentCount} students · {assessments.length} assessment{assessments.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Assessment cards grid */}
              <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {assessments.map(a => (
                  <AssessmentCard key={a.id} a={a} onClick={() => setSelectedAssessment(a)} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={() => setShowCreate(false)}>
          <div className="rounded-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto" style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>Create Assessment</h2>
            <CreateWizard onClose={() => setShowCreate(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
