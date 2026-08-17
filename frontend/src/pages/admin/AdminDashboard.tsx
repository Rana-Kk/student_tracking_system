import StatCard from '../../components/StatCard'
import { GROUPS, TEACHERS, STUDENTS, GROUP_PERFORMANCE, RECENT_ACTIVITY } from '../../data/mockData'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

const ACTIVITY_ICONS: Record<string, string> = {
  student: '🎓',
  feedback: '✦',
  assessment: '📝',
  certificate: '🏆',
  teacher: '👤',
}

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>
          Overview
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
          Organisation-wide summary · August 2026
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StatCard
          label="Total Students"
          value={STUDENTS.length}
          sub="Across all groups"
          trend={{ value: '4 this week', positive: true }}
          icon={<span>🎓</span>}
          accent
        />
        <StatCard
          label="Total Teachers"
          value={TEACHERS.length}
          sub="Active instructors"
          icon={<span>👤</span>}
        />
        <StatCard
          label="Active Groups"
          value={GROUPS.length}
          sub="In 3 courses"
          icon={<span>🗂</span>}
        />
        <StatCard
          label="Avg Attendance"
          value="86%"
          sub="Last 30 days"
          trend={{ value: '2% from last month', positive: true }}
          icon={<span>✓</span>}
        />
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 320px' }}>
        {/* Group performance chart */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Group Performance
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={GROUP_PERFORMANCE} barGap={4} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="group"
                tick={{ fontSize: 12, fill: '#64748B', fontFamily: 'DM Mono, monospace' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '12px',
                }}
                cursor={{ fill: 'rgba(0,0,0,0.03)' }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
              />
              <Bar dataKey="attendance" name="Attendance %" fill="#1D4ED8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="quizAvg" name="Quiz Avg %" fill="#0891B2" radius={[4, 4, 0, 0]} />
              <Bar dataKey="projectAvg" name="Project Avg %" fill="#7C3AED" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent activity */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Recent Activity
          </h2>
          <div className="space-y-1">
            {RECENT_ACTIVITY.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 py-3 border-b last:border-0"
                style={{ borderColor: 'var(--border)' }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: 'var(--secondary)' }}
                >
                  {ACTIVITY_ICONS[item.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">{item.action}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted-foreground)' }}>
                    {item.detail}
                  </p>
                  <p className="text-xs mt-1 mono" style={{ color: 'var(--muted-foreground)' }}>
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Groups table */}
      <div
        className="mt-6 rounded-xl overflow-hidden"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-base font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Active Groups</h2>
          <button
            className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            + New Group
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Group', 'Course', 'Teacher', 'Students'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GROUPS.map((g, i) => (
              <tr
                key={g.id}
                style={{ borderBottom: i < GROUPS.length - 1 ? '1px solid var(--border)' : 'none' }}
              >
                <td className="px-5 py-3.5 text-sm font-medium mono">{g.name}</td>
                <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--muted-foreground)' }}>{g.courseName}</td>
                <td className="px-5 py-3.5 text-sm">{g.teacherNames.join(', ')}</td>
                <td className="px-5 py-3.5 text-sm mono">{g.studentCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
