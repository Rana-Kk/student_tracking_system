import { GROUPS } from '../../data/mockData'

export default function AdminGroups() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Groups</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{GROUPS.length} groups across 3 courses</p>
        </div>
        <button
          className="text-sm font-semibold px-4 py-2 rounded-lg"
          style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          + New Group
        </button>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Group', 'Course', 'Teachers', 'Students', 'Actions'].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GROUPS.map((g, i) => (
              <tr key={g.id} style={{ borderBottom: i < GROUPS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <td className="px-5 py-4 text-sm font-semibold mono">{g.name}</td>
                <td className="px-5 py-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>{g.courseName}</td>
                <td className="px-5 py-4 text-sm">{g.teacherNames.join(', ')}</td>
                <td className="px-5 py-4 text-sm mono">{g.studentCount}</td>
                <td className="px-5 py-4">
                  <button className="text-xs px-3 py-1.5 rounded-lg mr-2" style={{ border: '1px solid var(--border)', cursor: 'pointer', background: 'transparent' }}>View</button>
                  <button className="text-xs px-3 py-1.5 rounded-lg" style={{ border: '1px solid var(--border)', cursor: 'pointer', background: 'transparent' }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
