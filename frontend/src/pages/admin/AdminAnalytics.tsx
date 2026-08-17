import { GROUP_PERFORMANCE, PROGRESS_TREND } from '../../data/mockData'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

export default function AdminAnalytics() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Analytics</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Organisation-wide performance metrics</p>
      </div>

      <div className="grid gap-6">
        <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Group Comparison</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={GROUP_PERFORMANCE} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="group" tick={{ fontSize: 12, fill: '#64748B', fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={32} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '12px' }} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
              <Bar dataKey="attendance" name="Attendance %" fill="#1D4ED8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="quizAvg" name="Quiz Avg %" fill="#0891B2" radius={[4, 4, 0, 0]} />
              <Bar dataKey="projectAvg" name="Project Avg %" fill="#7C3AED" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Average Score Trend — FSWD-2026-A</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={PROGRESS_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#64748B', fontFamily: 'DM Mono, monospace' }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} width={32} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '12px' }} />
              <Line type="monotone" dataKey="score" name="Score %" stroke="#1D4ED8" strokeWidth={2} dot={{ r: 4, fill: '#1D4ED8', strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
