import { STUDENTS } from '../../data/mockData'

export default function AdminStudents() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Students</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{STUDENTS.length} students enrolled</p>
        </div>
        <div className="flex gap-2">
          <button className="text-sm px-4 py-2 rounded-lg" style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}>Import CSV</button>
          <button className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}>+ Add Student</button>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Student', 'Email', 'Group', 'Actions'].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STUDENTS.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: i < STUDENTS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: `hsl(${i * 47}, 60%, 50%)` }}>
                      {s.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{s.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm mono" style={{ color: 'var(--muted-foreground)' }}>{s.email}</td>
                <td className="px-5 py-4">
                  <span className="text-xs px-2.5 py-1 rounded-full mono" style={{ background: '#DBEAFE', color: '#1E40AF' }}>FSWD-2026-A</span>
                </td>
                <td className="px-5 py-4">
                  <button className="text-xs px-3 py-1.5 rounded-lg" style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
