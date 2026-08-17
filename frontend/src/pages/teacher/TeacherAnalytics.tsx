import { PROGRESS_TREND, STUDENT_COMPETENCIES, STUDENTS, AI_EVALUATIONS, QUIZ_RESULTS } from '../../data/mockData'
import StatCard from '../../components/StatCard'
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const studentComparison = STUDENTS.slice(0, 6).map((s, i) => {
  const quizResults = QUIZ_RESULTS.filter((r) => r.studentId === s.id)
  const quizAvg = quizResults.length > 0 ? Math.round(quizResults.reduce((a, r) => a + r.percentage, 0) / quizResults.length) : 0
  const evalResult = AI_EVALUATIONS.find((e) => e.status === 'Approved' && (e.studentName === s.name || e.teamName))
  const assessmentAvg = evalResult ? Math.round((evalResult.totalTeacherScore / evalResult.maxScore) * 100) : 70 + i * 3
  return { name: s.name.split(' ')[0], assessmentAvg, quizAvg }
})

export default function TeacherAnalytics() {
  const quizAvg = QUIZ_RESULTS.length > 0 ? Math.round(QUIZ_RESULTS.reduce((a, r) => a + r.percentage, 0) / QUIZ_RESULTS.length) : 0

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Group Analytics</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>FSWD-2026-A · Performance overview</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Avg Attendance" value="86%" icon={<span>✓</span>} trend={{ value: '2% up', positive: true }} />
        <StatCard label="Avg Quiz Score" value={`${quizAvg}%`} icon={<span>❓</span>} />
        <StatCard label="Avg Assessment" value="82%" icon={<span>📝</span>} trend={{ value: '3% up', positive: true }} />
        <StatCard label="Avg Progress" value="74%" icon={<span>⬆</span>} accent />
      </div>

      <div className="grid gap-6 mb-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Progress Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={PROGRESS_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '12px' }} />
              <Line type="monotone" dataKey="score" name="Score %" stroke="#1D4ED8" strokeWidth={2} dot={{ r: 3, fill: '#1D4ED8', stroke: 'white', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Group Competency</h2>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={STUDENT_COMPETENCIES}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'DM Mono, monospace' }} />
              <Radar dataKey="level" stroke="#0891B2" fill="#0891B2" fillOpacity={0.2} strokeWidth={2} name="Level %" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Student comparison */}
      <div className="rounded-xl p-5 mb-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Student Comparison</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={studentComparison} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={28} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '12px' }} />
            <Bar dataKey="assessmentAvg" name="Assessment Avg %" fill="#1D4ED8" radius={[4, 4, 0, 0]} />
            <Bar dataKey="quizAvg" name="Quiz Avg %" fill="#0891B2" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Comparison table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-base font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Student Summary Table</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
              {['Student', 'Attendance', 'Assessment Avg', 'Quiz Avg', 'Progress'].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {studentComparison.map((s, i) => (
              <tr key={s.name} style={{ borderBottom: i < studentComparison.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <td className="px-5 py-3.5 text-sm font-medium">{STUDENTS[i].name}</td>
                <td className="px-5 py-3.5 text-sm mono">{80 + i * 2}%</td>
                <td className="px-5 py-3.5">
                  <span className="text-xs font-semibold mono px-2 py-0.5 rounded-full" style={{ background: '#DBEAFE', color: '#1E40AF' }}>{s.assessmentAvg}%</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-xs font-semibold mono px-2 py-0.5 rounded-full" style={{ background: '#CFFAFE', color: '#0E7490' }}>{s.quizAvg || '—'}%</span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-full overflow-hidden" style={{ height: '5px', background: 'var(--secondary)', maxWidth: '64px' }}>
                      <div className="h-full rounded-full" style={{ width: `${s.assessmentAvg}%`, background: 'var(--primary)' }} />
                    </div>
                    <span className="text-xs mono">{s.assessmentAvg}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
