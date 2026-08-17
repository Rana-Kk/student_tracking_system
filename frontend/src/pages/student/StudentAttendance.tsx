import StatusBadge from '../../components/StatusBadge'

const ATTENDANCE_LOG = [
  { date: '2026-08-15', session: 'Morning', status: 'Present' as const },
  { date: '2026-08-15', session: 'Afternoon', status: 'Present' as const },
  { date: '2026-08-14', session: 'Morning', status: 'Present' as const },
  { date: '2026-08-14', session: 'Afternoon', status: 'Late' as const },
  { date: '2026-08-13', session: 'Morning', status: 'Present' as const },
  { date: '2026-08-13', session: 'Afternoon', status: 'Present' as const },
  { date: '2026-08-12', session: 'Morning', status: 'Absent' as const },
  { date: '2026-08-12', session: 'Afternoon', status: 'Excused' as const },
  { date: '2026-08-11', session: 'Morning', status: 'Present' as const },
  { date: '2026-08-11', session: 'Afternoon', status: 'Present' as const },
]

export default function StudentAttendance() {
  const present = ATTENDANCE_LOG.filter((r) => r.status === 'Present').length
  const rate = Math.round((present / ATTENDANCE_LOG.length) * 100)

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Attendance</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Your session-by-session attendance record</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Attendance Rate', value: `${rate}%`, color: '#1D4ED8' },
          { label: 'Sessions Present', value: present, color: '#15803D' },
          { label: 'Total Sessions', value: ATTENDANCE_LOG.length, color: 'var(--foreground)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl p-4 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <p className="text-2xl font-semibold" style={{ color, fontFamily: 'Outfit, sans-serif' }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Date', 'Session', 'Status'].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ATTENDANCE_LOG.map((r, i) => (
              <tr key={i} style={{ borderBottom: i < ATTENDANCE_LOG.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <td className="px-5 py-3.5 text-sm mono">{r.date}</td>
                <td className="px-5 py-3.5 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  {r.session === 'Morning' ? '☀ Morning' : '🌤 Afternoon'}
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
