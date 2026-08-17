import { useState } from 'react'
import { QUIZ_RESULTS, STUDENTS, QUIZZES } from '../../data/mockData'
import StatCard from '../../components/StatCard'
import TeacherQuizImport from './TeacherQuizImport'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

export default function TeacherQuizResults() {
  const [showImport, setShowImport] = useState(false)
  const [filterStudent, setFilterStudent] = useState('all')
  const [filterTopic, setFilterTopic] = useState('all')

  if (showImport) return <TeacherQuizImport onDone={() => setShowImport(false)} />

  const filtered = QUIZ_RESULTS.filter((r) => {
    if (filterStudent !== 'all' && r.studentId !== filterStudent) return false
    if (filterTopic !== 'all' && r.topic !== filterTopic) return false
    return true
  })

  const avg = filtered.length > 0 ? Math.round(filtered.reduce((a, r) => a + r.percentage, 0) / filtered.length) : 0
  const highest = filtered.length > 0 ? Math.max(...filtered.map((r) => r.percentage)) : 0
  const lowest = filtered.length > 0 ? Math.min(...filtered.map((r) => r.percentage)) : 0

  const topics = [...new Set(QUIZ_RESULTS.map((r) => r.topic))]

  // Per-student averages for bar chart
  const studentAvgs = STUDENTS.slice(0, 5).map((s) => {
    const results = QUIZ_RESULTS.filter((r) => r.studentId === s.id)
    const avg = results.length > 0 ? Math.round(results.reduce((a, r) => a + r.percentage, 0) / results.length) : 0
    return { name: s.name.split(' ')[0], avg }
  })

  // Quiz trend (all students avg per quiz)
  const quizTrend = QUIZZES.map((q) => {
    const results = QUIZ_RESULTS.filter((r) => r.quizId === q.id)
    const avg = results.length > 0 ? Math.round(results.reduce((a, r) => a + r.percentage, 0) / results.length) : 0
    return { quiz: q.title.split(' ').slice(-1)[0], avg }
  })

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Quiz Results</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>FSWD-2026-A · Imported from external quiz platform</p>
        </div>
        <button onClick={() => setShowImport(true)} className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}>
          ↑ Import Results
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Average Score" value={`${avg}%`} icon={<span>📊</span>} accent />
        <StatCard label="Highest Score" value={`${highest}%`} icon={<span>★</span>} />
        <StatCard label="Lowest Score" value={`${lowest}%`} icon={<span>↓</span>} />
        <StatCard label="Results Imported" value={QUIZ_RESULTS.length} icon={<span>❓</span>} />
      </div>

      <div className="grid gap-6 mb-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Group Average per Quiz</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={quizTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="quiz" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '12px' }} formatter={(v) => [`${v}%`, 'Avg']} />
              <Line type="monotone" dataKey="avg" name="Group Avg %" stroke="#1D4ED8" strokeWidth={2} dot={{ r: 4, fill: '#1D4ED8', stroke: 'white', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Student Comparison</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={studentAvgs} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '12px' }} formatter={(v) => [`${v}%`, 'Avg']} />
              <Bar dataKey="avg" name="Avg Score %" fill="#0891B2" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters + table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-4 border-b flex flex-wrap items-center gap-3" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-base font-semibold flex-shrink-0" style={{ fontFamily: 'Outfit, sans-serif' }}>All Results</h2>
          <div className="flex gap-2 ml-auto">
            <select value={filterStudent} onChange={(e) => setFilterStudent(e.target.value)} className="px-3 py-1.5 rounded-lg text-sm" style={{ border: '1px solid var(--border)', background: 'var(--muted)', outline: 'none', cursor: 'pointer' }}>
              <option value="all">All students</option>
              {STUDENTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={filterTopic} onChange={(e) => setFilterTopic(e.target.value)} className="px-3 py-1.5 rounded-lg text-sm" style={{ border: '1px solid var(--border)', background: 'var(--muted)', outline: 'none', cursor: 'pointer' }}>
              <option value="all">All topics</option>
              {topics.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
              {['Student', 'Quiz', 'Topic', 'Score', 'Percentage', 'Date'].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <td className="px-5 py-3.5 text-sm font-medium">{r.studentName}</td>
                <td className="px-5 py-3.5 text-sm">{r.quizTitle}</td>
                <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--muted-foreground)' }}>{r.topic}</td>
                <td className="px-5 py-3.5 text-sm mono">{r.score}/{r.maxScore}</td>
                <td className="px-5 py-3.5">
                  <span className="text-sm font-semibold mono px-2.5 py-1 rounded-full" style={{ background: r.percentage >= 80 ? '#DCFCE7' : r.percentage >= 60 ? '#FEF3C7' : '#FEE2E2', color: r.percentage >= 80 ? '#15803D' : r.percentage >= 60 ? '#B45309' : '#B91C1C' }}>
                    {r.percentage}%
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm mono" style={{ color: 'var(--muted-foreground)' }}>{r.completedAt}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>No results match the current filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
