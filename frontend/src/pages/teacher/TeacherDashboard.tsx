import StatCard from '../../components/StatCard'
import { SUBMISSIONS, AI_EVALUATIONS, RECENT_ACTIVITY, ASSESSMENTS } from '../../data/mockData'
import type { TeacherPage } from '../../layouts/TeacherLayout'

interface Props {
  onNavigate: (page: TeacherPage) => void
}

const SUBMISSION_STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  'Not Submitted': { bg: '#F1F5F9', color: '#64748B' },
  'Submitted':     { bg: '#DBEAFE', color: '#1E40AF' },
  'Analyzing':     { bg: '#EDE9FE', color: '#6D28D9' },
  'AI Draft Ready':{ bg: '#FEF3C7', color: '#B45309' },
  'Teacher Review':{ bg: '#FEF3C7', color: '#B45309' },
  'Approved':      { bg: '#DCFCE7', color: '#15803D' },
  'Rejected':      { bg: '#FEE2E2', color: '#B91C1C' },
}

const ACTIVITY_ICONS: Record<string, string> = {
  submission: '⬆', ai: '✦', approved: '✓', quiz: '❓', student: '🎓',
}

export default function TeacherDashboard({ onNavigate }: Props) {
  const pendingReview = SUBMISSIONS.filter((s) => s.status === 'Teacher Review' || s.status === 'AI Draft Ready').length
  const analyzing = SUBMISSIONS.filter((s) => s.status === 'Analyzing').length
  const pendingEvals = AI_EVALUATIONS.filter((e) => e.status === 'Draft').length

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Teacher Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>FSWD-2026-A · Full-Stack Web Development</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="My Groups" value={1} icon={<span>🗂</span>} />
        <StatCard label="Students" value={18} icon={<span>🎓</span>} />
        <StatCard label="Pending Review" value={pendingReview} sub="Submissions awaiting you" icon={<span>⏳</span>} accent />
        <StatCard label="AI Evaluations" value={`${pendingEvals} draft`} sub="Ready for approval" icon={<span>✦</span>} />
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 320px' }}>
        <div className="space-y-4">
          {/* AI evaluations needing review */}
          {pendingEvals > 0 && (
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #FCD34D', background: '#FFFBEB' }}>
              <div className="px-5 py-3 flex items-center justify-between border-b" style={{ borderColor: '#FCD34D' }}>
                <div className="flex items-center gap-2">
                  <span style={{ color: '#B45309' }}>✦</span>
                  <p className="text-sm font-semibold" style={{ color: '#92400E', fontFamily: 'Outfit, sans-serif' }}>
                    {pendingEvals} AI evaluation{pendingEvals > 1 ? 's' : ''} waiting for your review
                  </p>
                </div>
                <button onClick={() => onNavigate('aievaluations')} className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: '#B45309', color: 'white', border: 'none', cursor: 'pointer' }}>
                  Review Now →
                </button>
              </div>
              {AI_EVALUATIONS.filter((e) => e.status === 'Draft').map((ev) => (
                <div key={ev.id} className="px-5 py-3 flex items-center justify-between border-b last:border-0" style={{ borderColor: '#FEF3C7' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#92400E' }}>{ev.teamName ?? ev.studentName}</p>
                    <p className="text-xs" style={{ color: '#B45309' }}>{ev.assessmentTitle}</p>
                  </div>
                  <div className="text-xs mono" style={{ color: '#B45309' }}>
                    AI Score: {ev.totalAIScore}/{ev.maxScore}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recent submissions */}
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-base font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Recent Submissions</h2>
              <button onClick={() => onNavigate('submissions')} className="text-xs" style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
            </div>
            {SUBMISSIONS.slice(0, 5).map((s, i) => {
              const sc = SUBMISSION_STATUS_COLORS[s.status] ?? { bg: '#F1F5F9', color: '#64748B' }
              return (
                <div key={s.id} className="px-5 py-3.5 flex items-center gap-4" style={{ borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.teamName ?? s.studentName}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted-foreground)' }}>
                      {s.githubUrl ? `⎇ ${s.githubUrl}` : 'No submission yet'}
                    </p>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0" style={{ background: sc.bg, color: sc.color }}>
                    {s.status}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Assessments */}
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <h2 className="text-base font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Active Assessments</h2>
              <button onClick={() => onNavigate('assessments')} className="text-xs" style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
            </div>
            {ASSESSMENTS.map((a, i) => (
              <div key={a.id} className="px-5 py-3.5 flex items-center gap-4" style={{ borderBottom: i < ASSESSMENTS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                    {a.type} · Due {a.dueDate} · {a.submissionMode}
                  </p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: a.submissionMode === 'Team' ? '#EDE9FE' : '#DBEAFE', color: a.submissionMode === 'Team' ? '#6D28D9' : '#1E40AF' }}>
                  {a.submissionMode}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Activity</h2>
          <div className="space-y-1">
            {RECENT_ACTIVITY.map((item) => (
              <div key={item.id} className="flex gap-3 py-3 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: 'var(--secondary)' }}>
                  {ACTIVITY_ICONS[item.type] ?? '•'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">{item.action}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted-foreground)' }}>{item.detail}</p>
                  <p className="text-xs mt-1 mono" style={{ color: 'var(--muted-foreground)' }}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
