import { QUIZ_RESULTS } from '../../data/mockData'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import StatCard from '../../components/StatCard'

const myResults = QUIZ_RESULTS.filter((r) => r.studentId === 'student-1')

const TREND = myResults.map((r) => ({ quiz: r.quizTitle.split(' ').slice(-1)[0], score: r.percentage }))

const topicScores: Record<string, number[]> = {}
myResults.forEach((r) => {
  if (!topicScores[r.topic]) topicScores[r.topic] = []
  topicScores[r.topic].push(r.percentage)
})
const topicAvgs = Object.entries(topicScores).map(([topic, scores]) => ({
  topic,
  avg: Math.round(scores.reduce((a, s) => a + s, 0) / scores.length),
})).sort((a, b) => b.avg - a.avg)

const bestTopic = topicAvgs[0]?.topic ?? '—'
const worstTopic = topicAvgs[topicAvgs.length - 1]?.topic ?? '—'
const avg = myResults.length > 0 ? Math.round(myResults.reduce((a, r) => a + r.percentage, 0) / myResults.length) : 0

export default function StudentQuizResults() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Quiz Results</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Your quiz performance across all topics</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Average Score" value={`${avg}%`} icon={<span>📊</span>} accent />
        <StatCard label="Quizzes Completed" value={myResults.length} icon={<span>✓</span>} />
        <StatCard label="Best Topic" value={bestTopic} icon={<span>★</span>} />
        <StatCard label="Needs Improvement" value={worstTopic} icon={<span>◎</span>} />
      </div>

      {/* Trend chart */}
      <div className="rounded-xl p-5 mb-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Quiz Performance Over Time</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="quiz" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={28} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '12px' }} formatter={(v) => [`${v}%`, 'Score']} />
            <Line type="monotone" dataKey="score" name="Score %" stroke="#1D4ED8" strokeWidth={2.5} dot={{ r: 5, fill: '#1D4ED8', stroke: 'white', strokeWidth: 2 }} activeDot={{ r: 7 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Results table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-base font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>All Quizzes</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
              {['Quiz', 'Topic', 'Score', 'Percentage', 'Date'].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {myResults.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: i < myResults.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <td className="px-5 py-3.5 text-sm font-medium">{r.quizTitle}</td>
                <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--muted-foreground)' }}>{r.topic}</td>
                <td className="px-5 py-3.5 text-sm mono">{r.score}/{r.maxScore}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold mono" style={{ color: r.percentage >= 80 ? '#15803D' : r.percentage >= 60 ? '#B45309' : '#B91C1C', minWidth: '40px' }}>
                      {r.percentage}%
                    </span>
                    <div className="flex-1 rounded-full overflow-hidden" style={{ height: '5px', background: 'var(--secondary)', maxWidth: '80px' }}>
                      <div className="h-full rounded-full" style={{ width: `${r.percentage}%`, background: r.percentage >= 80 ? '#16A34A' : r.percentage >= 60 ? '#D97706' : '#DC2626' }} />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm mono" style={{ color: 'var(--muted-foreground)' }}>{r.completedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
