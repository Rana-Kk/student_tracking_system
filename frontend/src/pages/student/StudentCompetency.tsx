import { STUDENT_COMPETENCIES } from '../../data/mockData'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function StudentCompetency() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Competency Matrix</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Skill levels across the program curriculum</p>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Overview</h2>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={STUDENT_COMPETENCIES} outerRadius={100}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'DM Mono, monospace' }} />
              <Radar dataKey="level" stroke="#0891B2" fill="#0891B2" fillOpacity={0.2} strokeWidth={2.5} name="Level %" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '12px' }} formatter={(v) => [`${v}%`, 'Level']} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <h2 className="text-base font-semibold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Skill Detail</h2>
          <div className="space-y-4">
            {STUDENT_COMPETENCIES.map((c) => {
              const tier = c.level >= 80 ? 'Advanced' : c.level >= 65 ? 'Intermediate' : 'Developing'
              const color = c.level >= 80 ? '#15803D' : c.level >= 65 ? '#0891B2' : '#B45309'
              const bg = c.level >= 80 ? '#DCFCE7' : c.level >= 65 ? '#CFFAFE' : '#FEF3C7'
              const trendIcon = c.trend === 'improving' ? '↑ Improving' : c.trend === 'declining' ? '↓ Declining' : '→ Stable'
              const trendColor = c.trend === 'improving' ? '#15803D' : c.trend === 'declining' ? '#B91C1C' : '#64748B'
              return (
                <div key={c.skill}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{c.skill}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: bg, color }}>{tier}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium" style={{ color: trendColor }}>{trendIcon}</span>
                      <span className="text-sm mono font-semibold">{c.level}%</span>
                    </div>
                  </div>
                  <div className="w-full rounded-full overflow-hidden" style={{ height: '8px', background: 'var(--secondary)' }}>
                    <div className="h-full rounded-full" style={{ width: `${c.level}%`, background: color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
