import { useState } from 'react'
import { COURSES } from '../../data/mockData'

export default function AdminCourses() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Courses</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{COURSES.length} courses active</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="text-sm font-semibold px-4 py-2 rounded-lg"
          style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          + New Course
        </button>
      </div>

      <div className="grid gap-4">
        {COURSES.map((c) => (
          <div
            key={c.id}
            className="rounded-xl p-5 flex items-start gap-5"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: 'var(--secondary)' }}
            >
              📚
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>{c.name}</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{c.description}</p>
              <div className="flex gap-4 mt-3 text-xs mono" style={{ color: 'var(--muted-foreground)' }}>
                <span>Start: {c.startDate}</span>
                <span>End: {c.endDate}</span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                className="text-xs px-3 py-1.5 rounded-lg"
                style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="rounded-xl p-6 w-full max-w-md"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>Create Course</h2>
            <div className="space-y-4">
              {[
                { label: 'Course Name', placeholder: 'e.g. Full-Stack Web Development' },
                { label: 'Description', placeholder: 'Short program description' },
                { label: 'Start Date', placeholder: '2026-09-01' },
                { label: 'End Date', placeholder: '2026-12-12' },
              ].map(({ label, placeholder }) => (
                <div key={label}>
                  <label className="block text-sm font-medium mb-1.5">{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 rounded-lg text-sm"
                    style={{ border: '1px solid var(--border)', background: 'var(--muted)', outline: 'none' }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg text-sm font-medium" style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}>Create Course</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
