import StatCard from '../../components/StatCard'
import { PROGRESS_TREND, STUDENT_COMPETENCIES, AI_EVALUATIONS, QUIZ_RESULTS } from '../../data/mockData'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { StudentPage } from '../../layouts/StudentLayout'

interface Props { onNavigate: (page: StudentPage) => void }

export default function StudentDashboard({ onNavigate }: Props) {
  const approvedFeedback = AI_EVALUATIONS.filter((e) => e.status === 'Approved')
  const myQuizResults = QUIZ_RESULTS.filter((r) => r.studentId === 'student-1')
  const quizAvg = myQuizResults.length > 0 ? Math.round(myQuizResults.reduce((a, r) => a + r.percentage, 0) / myQuizResults.length) : 0

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Good morning, Aisha</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>FSWD-2026-A · Full-Stack Web Development</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Overall Progress" value="74%" trend={{ value: '3% this week', positive: true }} icon={<span>⬆</span>} accent />
        <StatCard label="Attendance Rate" value="91%" sub="22 of 24 sessions" icon={<span>✓</span>} />
        <StatCard label="Assessment Avg" value="85%" trend={{ value: '5% up', positive: true }} icon={<span>★</span>} />
        <StatCard label="Quiz Average" value={`${quizAvg}%`} sub={`${myQuizResults.length} quizzes`} icon={<span>❓</span>} />
      </div>

      <div className="grid gap-6 mb-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Score Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={PROGRESS_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '12px' }} formatter={(v) => [`${v}%`, 'Score']} />
              <Line type="monotone" dataKey="score" stroke="#1D4ED8" strokeWidth={2.5} dot={{ r: 4, fill: '#1D4ED8', stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-between mt-2 px-1">
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Week 1: <span className="mono font-medium">58%</span></span>
            <span className="text-xs font-medium" style={{ color: '#15803D' }}>Week 8: <span className="mono">82%</span> ↑ 24 pts</span>
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Competency Progress</h2>
          <div className="space-y-3">
            {STUDENT_COMPETENCIES.map((c) => (
              <div key={c.skill}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{c.skill}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: c.trend === 'improving' ? '#15803D' : c.trend === 'declining' ? '#B91C1C' : '#64748B' }}>
                      {c.trend === 'improving' ? '↑' : c.trend === 'declining' ? '↓' : '→'}
                    </span>
                    <span className="text-sm mono font-medium">{c.level}%</span>
                  </div>
                </div>
                <div className="w-full rounded-full overflow-hidden" style={{ height: '5px', background: 'var(--secondary)' }}>
                  <div className="h-full rounded-full" style={{ width: `${c.level}%`, background: c.level >= 80 ? '#16A34A' : c.level >= 65 ? '#0891B2' : '#D97706' }} />
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => onNavigate('competency')} className="text-xs mt-4" style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
            View full competency matrix →
          </button>
        </div>
      </div>

      {/* Approved feedback */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-base font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Teacher-Approved Feedback</h2>
          <button onClick={() => onNavigate('feedback')} className="text-xs" style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
        </div>
        {approvedFeedback.length > 0 ? approvedFeedback.slice(0, 2).map((e, i) => (
          <div key={e.id} className="px-5 py-4" style={{ borderBottom: i < 1 && approvedFeedback.length > 1 ? '1px solid var(--border)' : 'none' }}>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-medium">{e.assessmentTitle}</p>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: '#DCFCE7', color: '#15803D' }}>✓ Approved</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{e.strengths.substring(0, 150)}…</p>
            <p className="text-xs mt-2 mono" style={{ color: 'var(--muted-foreground)' }}>{new Date(e.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
          </div>
        )) : (
          <div className="px-5 py-8 text-center"><p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>No approved feedback yet.</p></div>
        )}
      </div>
    </div>
  )
}
