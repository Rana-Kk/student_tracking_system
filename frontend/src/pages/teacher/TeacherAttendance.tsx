import { useState } from 'react'
import type { AttendanceStatus } from '../../types'
import AttendanceStatusSelect from '../../components/AttendanceStatusSelect'
import { ATTENDANCE_RECORDS } from '../../data/mockData'

type SessionType = 'Morning' | 'Afternoon'

export default function TeacherAttendance() {
  const [date, setDate] = useState('2026-08-15')
  const [session, setSession] = useState<SessionType>('Morning')
  const [records, setRecords] = useState(ATTENDANCE_RECORDS)
  const [saved, setSaved] = useState(false)

  const updateStatus = (studentId: string, status: AttendanceStatus) => {
    setSaved(false)
    setRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status } : r))
    )
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const counts = records.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const presentCount = (counts['Present'] || 0) + (counts['Late'] || 0)
  const attendancePct = Math.round((presentCount / records.length) * 100)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Attendance</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>FSWD-2026-A · Record attendance by session</p>
      </div>

      {/* Controls */}
      <div
        className="rounded-xl p-5 mb-6 flex flex-wrap items-center gap-5"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); setSaved(false) }}
            className="px-3 py-2 rounded-lg text-sm mono"
            style={{ border: '1px solid var(--border)', background: 'var(--muted)', outline: 'none' }}
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted-foreground)' }}>Session</label>
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {(['Morning', 'Afternoon'] as SessionType[]).map((s) => (
              <button
                key={s}
                onClick={() => { setSession(s); setSaved(false) }}
                className="px-4 py-2 text-sm font-medium transition-colors"
                style={{
                  background: session === s ? 'var(--primary)' : 'var(--muted)',
                  color: session === s ? 'white' : 'var(--muted-foreground)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {s === 'Morning' ? '☀ Morning 09:00–12:00' : '🌤 Afternoon 13:00–16:00'}
              </button>
            ))}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {saved && (
            <span
              className="text-sm font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{ background: '#DCFCE7', color: '#15803D' }}
            >
              ✓ Attendance saved
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg text-sm font-semibold"
            style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Save Attendance
          </button>
        </div>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total', value: records.length, color: 'var(--muted-foreground)' },
          { label: 'Present', value: counts['Present'] || 0, color: '#15803D' },
          { label: 'Late', value: counts['Late'] || 0, color: '#B45309' },
          { label: 'Absent', value: counts['Absent'] || 0, color: '#B91C1C' },
          { label: 'Attendance', value: `${attendancePct}%`, color: '#1D4ED8' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-lg px-4 py-3 text-center"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <p className="text-xl font-semibold" style={{ color, fontFamily: 'Outfit, sans-serif' }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Roster */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="grid text-xs font-medium uppercase tracking-wider" style={{ gridTemplateColumns: '1fr 2fr', color: 'var(--muted-foreground)' }}>
            <span>Student</span>
            <span>Status</span>
          </div>
        </div>
        {records.map((r, i) => (
          <div
            key={r.studentId}
            className="px-5 py-4 grid items-center"
            style={{
              gridTemplateColumns: '1fr 2fr',
              borderBottom: i < records.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: `hsl(${i * 47}, 55%, 50%)` }}
              >
                {r.studentName.charAt(0)}
              </div>
              <span className="text-sm font-medium">{r.studentName}</span>
            </div>
            <AttendanceStatusSelect
              value={r.status}
              onChange={(status) => updateStatus(r.studentId, status)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
