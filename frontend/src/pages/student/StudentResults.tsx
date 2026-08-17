import { ASSESSMENTS, QUIZ_RESULTS } from '../../data/mockData'

const MY_SCORES: Record<string, Record<string, number>> = {
  a1: { r1: 8, r2: 9, r3: 17, r4: 18, r5: 7, r6: 9, r7: 8, r8: 9 },
  a2: { r9: 17, r10: 16, r11: 15, r12: 8, r13: 7 },
}

export default function StudentResults() {
  const myQuizResults = QUIZ_RESULTS.filter((r) => r.studentId === 'student-1')

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Results</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Approved assessment scores and quiz results</p>
      </div>

      {/* Assessments */}
      <div className="rounded-xl overflow-hidden mb-6" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-base font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Assessment Scores</h2>
        </div>
        {ASSESSMENTS.map((a, idx) => {
          const myScores = MY_SCORES[a.id] ?? {}
          const total = Object.values(myScores).reduce((s, v) => s + v, 0)
          const pct = Math.round((total / a.maxScore) * 100)
          return (
            <div key={a.id} className="px-5 py-5" style={{ borderBottom: idx < ASSESSMENTS.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm font-semibold">{a.title}</p>
                  <p className="text-xs mt-0.5 mono" style={{ color: 'var(--muted-foreground)' }}>{a.type} · Due {a.dueDate} · {a.submissionMode}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-sm mono font-medium">{total} / {a.maxScore}</span>
                  <span className="text-sm font-semibold px-3 py-1 rounded-full mono" style={{ background: pct >= 80 ? '#DCFCE7' : pct >= 60 ? '#FEF3C7' : '#FEE2E2', color: pct >= 80 ? '#15803D' : pct >= 60 ? '#B45309' : '#B91C1C' }}>
                    {pct}%
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                {a.rubric.map((c) => {
                  const score = myScores[c.id] ?? 0
                  return (
                    <div key={c.id} className="flex items-center gap-3">
                      <span className="text-xs w-36 flex-shrink-0" style={{ color: 'var(--muted-foreground)' }}>{c.name}</span>
                      <div className="flex-1 rounded-full overflow-hidden" style={{ height: '4px', background: 'var(--secondary)' }}>
                        <div className="h-full rounded-full" style={{ width: `${(score / c.maxScore) * 100}%`, background: 'var(--primary)' }} />
                      </div>
                      <span className="text-xs mono w-10 text-right">{score}/{c.maxScore}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Quiz results */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-base font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Quiz Results</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
              {['Quiz', 'Topic', 'Date', 'Score'].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {myQuizResults.map((q, i) => (
              <tr key={q.id} style={{ borderBottom: i < myQuizResults.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <td className="px-5 py-3.5 text-sm font-medium">{q.quizTitle}</td>
                <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--muted-foreground)' }}>{q.topic}</td>
                <td className="px-5 py-3.5 text-sm mono" style={{ color: 'var(--muted-foreground)' }}>{q.completedAt}</td>
                <td className="px-5 py-3.5">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full mono" style={{ background: q.percentage >= 80 ? '#DCFCE7' : q.percentage >= 60 ? '#FEF3C7' : '#FEE2E2', color: q.percentage >= 80 ? '#15803D' : q.percentage >= 60 ? '#B45309' : '#B91C1C' }}>
                    {q.score}/{q.maxScore} ({q.percentage}%)
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
