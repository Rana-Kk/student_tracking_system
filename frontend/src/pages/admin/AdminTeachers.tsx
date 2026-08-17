import { useState } from 'react'
import { TEACHERS, GROUPS } from '../../data/mockData'

export default function AdminTeachers() {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '' })

  const teacherGroups = (teacherId: string) =>
    GROUPS.filter((g) => g.teacherIds.includes(teacherId))

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Teachers</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{TEACHERS.length} instructors registered</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="text-sm font-semibold px-4 py-2 rounded-lg"
          style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          + Add Teacher
        </button>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Name', 'Email', 'Assigned Groups', 'Actions'].map((h) => (
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
            {TEACHERS.map((t, i) => {
              const groups = teacherGroups(t.id)
              return (
                <tr
                  key={t.id}
                  style={{ borderBottom: i < TEACHERS.length - 1 ? '1px solid var(--border)' : 'none' }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: '#0891B2' }}
                      >
                        {t.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium">{t.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm mono" style={{ color: 'var(--muted-foreground)' }}>{t.email}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {groups.length > 0 ? (
                        groups.map((g) => (
                          <span
                            key={g.id}
                            className="text-xs px-2 py-0.5 rounded-full mono"
                            style={{ background: '#DBEAFE', color: '#1E40AF' }}
                          >
                            {g.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Unassigned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      className="text-xs font-medium px-3 py-1.5 rounded-lg mr-2"
                      style={{ background: 'var(--secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs font-medium px-3 py-1.5 rounded-lg"
                      style={{ background: '#FEE2E2', color: '#B91C1C', border: 'none', cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Add Teacher Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="rounded-xl p-6 w-full max-w-sm"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>Add Teacher</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Jane Smith"
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                  style={{ border: '1px solid var(--border)', background: 'var(--muted)', outline: 'none' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="j.smith@lexicon.edu"
                  className="w-full px-3 py-2.5 rounded-lg text-sm"
                  style={{ border: '1px solid var(--border)', background: 'var(--muted)', outline: 'none' }}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium"
                style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                Add Teacher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
