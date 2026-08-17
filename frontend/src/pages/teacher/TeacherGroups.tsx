import { useState } from 'react'
import { GROUPS, TEAMS, STUDENTS, COURSES, ASSESSMENTS, ATTENDANCE_RECORDS } from '../../data/mockData'
import type { Group, Team, User } from '../../types'

/* ─── Types ────────────────────────────────────────────────── */

interface GroupWithStudents extends Group {
  students: User[]
  startDate?: string
  endDate?: string
}

/* ─── Seed local state ─────────────────────────────────────── */

const INITIAL_GROUPS: GroupWithStudents[] = GROUPS.map((g) => ({
  ...g,
  students: STUDENTS.filter((_, i) => i < g.studentCount),
  startDate: '2026-01-13',
  endDate: '2026-07-25',
}))

/* ─── Create Group Modal ───────────────────────────────────── */

function CreateGroupModal({ onClose, onCreate }: { onClose: () => void; onCreate: (g: GroupWithStudents) => void }) {
  const [name, setName] = useState('')
  const [courseId, setCourseId] = useState(COURSES[0]?.id ?? '')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  function submit() {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Group name is required'
    if (!courseId) e.courseId = 'Please select a course'
    if (!startDate) e.startDate = 'Required'
    if (!endDate) e.endDate = 'Required'
    setErrors(e)
    if (Object.keys(e).length > 0) return

    const course = COURSES.find((c) => c.id === courseId)!
    const newGroup: GroupWithStudents = {
      id: `g-${Date.now()}`,
      name: name.trim(),
      courseId,
      courseName: course.name,
      teacherIds: ['teacher-1'],
      teacherNames: ['James Okonkwo'],
      studentCount: 0,
      students: [],
      startDate,
      endDate,
    }
    onCreate(newGroup)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <div className="rounded-xl p-6 w-full max-w-md" style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>Create New Group</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Group / Class Name <span style={{ color: '#EF4444' }}>*</span></label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. FSWD-2026-C" className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: `1px solid ${errors.name ? '#EF4444' : 'var(--border)'}`, background: 'var(--muted)', outline: 'none' }} />
            {errors.name && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.name}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Course <span style={{ color: '#EF4444' }}>*</span></label>
            <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: `1px solid ${errors.courseId ? '#EF4444' : 'var(--border)'}`, background: 'var(--muted)', outline: 'none' }}>
              {COURSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Start Date <span style={{ color: '#EF4444' }}>*</span></label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: `1px solid ${errors.startDate ? '#EF4444' : 'var(--border)'}`, background: 'var(--muted)', outline: 'none' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>End Date <span style={{ color: '#EF4444' }}>*</span></label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: `1px solid ${errors.endDate ? '#EF4444' : 'var(--border)'}`, background: 'var(--muted)', outline: 'none' }} />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm" style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
          <button onClick={submit} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}>Create Group</button>
        </div>
      </div>
    </div>
  )
}

/* ─── Add Student Modal ─────────────────────────────────────── */

type AddStudentState = 'idle' | 'found' | 'not_found' | 'already_in' | 'invalid'

function AddStudentModal({ group, onClose, onAdd }: { group: GroupWithStudents; onClose: () => void; onAdd: (s: User) => void }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<AddStudentState>('idle')
  const [foundStudent, setFoundStudent] = useState<User | null>(null)

  function lookup() {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !/\S+@\S+\.\S+/.test(trimmed)) { setState('invalid'); return }
    const student = STUDENTS.find((s) => s.email.toLowerCase() === trimmed)
    if (!student) { setState('not_found'); setFoundStudent(null); return }
    if (group.students.some((s) => s.id === student.id)) { setState('already_in'); setFoundStudent(null); return }
    setState('found')
    setFoundStudent(student)
  }

  function handleAdd() {
    if (foundStudent) { onAdd(foundStudent); onClose() }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <div className="rounded-xl p-6 w-full max-w-sm" style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Add Student</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>Add a student to <strong>{group.name}</strong> by email address.</p>

        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Student Email</label>
        <div className="flex gap-2 mb-3">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setState('idle') }}
            placeholder="student@lexicon.edu"
            onKeyDown={(e) => e.key === 'Enter' && lookup()}
            className="flex-1 px-3 py-2.5 rounded-lg text-sm"
            style={{ border: `1px solid ${state === 'invalid' || state === 'not_found' ? '#EF4444' : state === 'already_in' ? '#F59E0B' : 'var(--border)'}`, background: 'var(--muted)', outline: 'none' }}
          />
          <button onClick={lookup} className="px-4 py-2.5 rounded-lg text-sm font-medium" style={{ background: 'var(--secondary)', border: '1px solid var(--border)', cursor: 'pointer' }}>Find</button>
        </div>

        {/* Validation feedback */}
        {state === 'invalid' && <p className="text-xs mb-3" style={{ color: '#EF4444' }}>Please enter a valid email address.</p>}
        {state === 'not_found' && <p className="text-xs mb-3" style={{ color: '#EF4444' }}>No student found with this email address.</p>}
        {state === 'already_in' && <p className="text-xs mb-3" style={{ color: '#B45309' }}>This student is already in {group.name}.</p>}
        {state === 'found' && foundStudent && (
          <div className="flex items-center gap-3 px-3 py-3 rounded-lg mb-3" style={{ background: '#F0FDF4', border: '1px solid #86EFAC' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: '#0891B2' }}>{foundStudent.name.charAt(0)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: '#15803D' }}>{foundStudent.name}</p>
              <p className="text-xs" style={{ color: '#166534' }}>{foundStudent.email}</p>
            </div>
            <span className="text-xs font-medium" style={{ color: '#15803D' }}>✓ Found</span>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg text-sm" style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleAdd} disabled={state !== 'found'} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ background: state === 'found' ? 'var(--primary)' : 'var(--secondary)', color: state === 'found' ? 'white' : 'var(--muted-foreground)', border: 'none', cursor: state === 'found' ? 'pointer' : 'not-allowed' }}>
            Add Student
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Group Detail Page ─────────────────────────────────────── */

type DetailTab = 'students' | 'teams' | 'assessments' | 'attendance' | 'analytics'

function GroupDetail({
  group,
  teams,
  onBack,
  onAddStudent,
  onRemoveStudent,
  onCreateTeam,
  onDeleteTeam,
}: {
  group: GroupWithStudents
  teams: Team[]
  onBack: () => void
  onAddStudent: () => void
  onRemoveStudent: (studentId: string) => void
  onCreateTeam: (name: string) => void
  onDeleteTeam: (teamId: string) => void
}) {
  const [tab, setTab] = useState<DetailTab>('students')
  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null)

  const groupTeams = teams.filter((t) => t.groupId === group.id)
  const groupAssessments = ASSESSMENTS.filter((a) => a.groupId === group.id)

  const TABS: { id: DetailTab; label: string }[] = [
    { id: 'students', label: `Students (${group.students.length})` },
    { id: 'teams', label: `Teams (${groupTeams.length})` },
    { id: 'assessments', label: `Assessments (${groupAssessments.length})` },
    { id: 'attendance', label: 'Attendance' },
    { id: 'analytics', label: 'Analytics' },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: 0, fontSize: '14px' }}>← Groups</button>
        <span>/</span>
        <span className="font-medium" style={{ color: 'var(--foreground)' }}>{group.name}</span>
      </div>

      {/* Group header */}
      <div className="rounded-xl p-5 mb-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-medium px-2.5 py-1 rounded-md mono" style={{ background: '#DBEAFE', color: '#1E40AF' }}>{group.name}</span>
            </div>
            <h1 className="text-xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>{group.courseName}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
              <span>Teacher: {group.teacherNames.join(', ')}</span>
              {group.startDate && <span>Start: {group.startDate}</span>}
              {group.endDate && <span>End: {group.endDate}</span>}
            </div>
          </div>
          <div className="flex gap-5 text-center">
            {[
              { label: 'Students', value: group.students.length, color: 'var(--primary)' },
              { label: 'Teams', value: groupTeams.length, color: '#0891B2' },
              { label: 'Assessments', value: groupAssessments.length, color: '#6D28D9' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <p className="text-2xl font-bold mono" style={{ color }}>{value}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-5 border-b" style={{ borderColor: 'var(--border)' }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="px-4 py-2.5 text-sm font-medium whitespace-nowrap" style={{ background: 'none', border: 'none', cursor: 'pointer', color: tab === t.id ? 'var(--primary)' : 'var(--muted-foreground)', borderBottom: tab === t.id ? '2px solid var(--primary)' : '2px solid transparent', marginBottom: '-1px' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Students tab */}
      {tab === 'students' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>{group.students.length} students enrolled</p>
            <button onClick={onAddStudent} className="text-sm font-semibold px-3 py-1.5 rounded-lg" style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}>+ Add Student</button>
          </div>
          {group.students.length === 0 ? (
            <div className="rounded-xl py-12 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>No students yet.</p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Use "+ Add Student" to add students by email.</p>
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
                    {['Student', 'Email', 'Team', 'Status', ''].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {group.students.map((s, i) => {
                    const team = groupTeams.find((t) => t.memberIds.includes(s.id))
                    return (
                      <tr key={s.id} style={{ borderBottom: i < group.students.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: `hsl(${i * 47}, 55%, 50%)` }}>{s.name.charAt(0)}</div>
                            <span className="text-sm font-medium">{s.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-xs mono" style={{ color: 'var(--muted-foreground)' }}>{s.email}</td>
                        <td className="px-4 py-3.5">
                          {team
                            ? <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#EDE9FE', color: '#6D28D9' }}>{team.name}</span>
                            : <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Unassigned</span>}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#DCFCE7', color: '#15803D' }}>Active</span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button onClick={() => onRemoveStudent(s.id)} className="text-xs px-2 py-1 rounded" style={{ color: '#B91C1C', background: 'transparent', border: 'none', cursor: 'pointer' }}>Remove</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Teams tab */}
      {tab === 'teams' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>{groupTeams.length} team{groupTeams.length !== 1 ? 's' : ''}</p>
            <button onClick={() => setShowCreateTeam(true)} className="text-sm font-semibold px-3 py-1.5 rounded-lg" style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}>+ Create Team</button>
          </div>
          {showCreateTeam && (
            <div className="rounded-xl p-4 mb-3" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
              <div className="flex gap-2">
                <input autoFocus value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} placeholder="Team name e.g. Team Delta" onKeyDown={(e) => { if (e.key === 'Enter') { onCreateTeam(newTeamName); setNewTeamName(''); setShowCreateTeam(false) } }} className="flex-1 px-3 py-2 rounded-lg text-sm" style={{ border: '1px solid #93C5FD', outline: 'none', background: 'white' }} />
                <button onClick={() => { onCreateTeam(newTeamName); setNewTeamName(''); setShowCreateTeam(false) }} className="px-3 py-2 rounded-lg text-sm font-semibold" style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}>Create</button>
                <button onClick={() => setShowCreateTeam(false)} className="px-3 py-2 rounded-lg text-sm" style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          )}
          {groupTeams.length === 0 && !showCreateTeam ? (
            <div className="rounded-xl py-12 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>No teams yet. Create teams to organise students.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {groupTeams.map((team) => {
                const expanded = expandedTeam === team.id
                return (
                  <div key={team.id} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                    <div className="flex items-center justify-between px-5 py-4 cursor-pointer" style={{ background: 'var(--card)' }} onClick={() => setExpandedTeam(expanded ? null : team.id)}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: '#EDE9FE', color: '#6D28D9' }}>{team.name.charAt(team.name.lastIndexOf(' ') + 1)}</div>
                        <div>
                          <p className="text-sm font-semibold">{team.name}</p>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{team.memberNames.length} member{team.memberNames.length !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={(e) => { e.stopPropagation(); onDeleteTeam(team.id) }} className="text-xs px-2.5 py-1 rounded-lg" style={{ background: '#FEE2E2', color: '#B91C1C', border: 'none', cursor: 'pointer' }}>Delete</button>
                        <span style={{ color: 'var(--muted-foreground)', fontSize: '12px' }}>{expanded ? '▲' : '▼'}</span>
                      </div>
                    </div>
                    {expanded && (
                      <div style={{ borderTop: '1px solid var(--border)', background: 'var(--muted)' }}>
                        {team.memberNames.length === 0
                          ? <div className="px-5 py-4 text-center"><p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>No members yet.</p></div>
                          : team.memberNames.map((name, i) => (
                            <div key={i} className="px-5 py-3 flex items-center gap-3" style={{ borderBottom: i < team.memberNames.length - 1 ? '1px solid var(--border)' : 'none' }}>
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: `hsl(${i * 60 + 180}, 55%, 45%)` }}>{name.charAt(0)}</div>
                              <span className="text-sm">{name}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Assessments tab */}
      {tab === 'assessments' && (
        <div>
          {groupAssessments.length === 0 ? (
            <div className="rounded-xl py-12 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>No assessments assigned to this group yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {groupAssessments.map((a) => (
                <div key={a.id} className="flex items-center gap-4 px-5 py-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{a.title}</p>
                    <p className="text-xs mono mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Due {a.dueDate} · {a.maxScore} pts</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: a.submissionMode === 'Team' ? '#EDE9FE' : '#DBEAFE', color: a.submissionMode === 'Team' ? '#6D28D9' : '#1E40AF' }}>{a.submissionMode}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F3E8FF', color: '#6D28D9' }}>{a.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Attendance tab */}
      {tab === 'attendance' && (
        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)', background: 'var(--muted)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Attendance Summary</p>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
                {['Student', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ATTENDANCE_RECORDS.filter((_, i) => i < group.students.length).map((rec, i) => {
                const statusColor = rec.status === 'Present' ? { bg: '#DCFCE7', color: '#15803D' } : rec.status === 'Late' ? { bg: '#FEF3C7', color: '#B45309' } : rec.status === 'Absent' ? { bg: '#FEE2E2', color: '#B91C1C' } : { bg: '#F1F5F9', color: '#64748B' }
                return (
                  <tr key={rec.studentId} style={{ borderBottom: i < group.students.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td className="px-4 py-3.5 text-sm font-medium">{rec.studentName}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: statusColor.bg, color: statusColor.color }}>{rec.status}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Analytics tab */}
      {tab === 'analytics' && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Average Attendance', value: '86%', color: '#15803D', bg: '#DCFCE7' },
            { label: 'Avg Assessment Score', value: '82%', color: 'var(--primary)', bg: '#DBEAFE' },
            { label: 'Avg Quiz Score', value: '75%', color: '#6D28D9', bg: '#EDE9FE' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <p className="text-2xl font-bold mono" style={{ color }}>{value}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
              <div className="mt-3 rounded-full overflow-hidden" style={{ height: '6px', background: 'var(--secondary)' }}>
                <div className="h-full rounded-full" style={{ width: value, background: color }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Main Groups List ──────────────────────────────────────── */

export default function TeacherGroups() {
  const [groups, setGroups] = useState<GroupWithStudents[]>(INITIAL_GROUPS)
  const [teams, setTeams] = useState<Team[]>(TEAMS)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showAddStudent, setShowAddStudent] = useState(false)

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) ?? null

  function handleCreateGroup(g: GroupWithStudents) {
    setGroups((prev) => [...prev, g])
    setShowCreateGroup(false)
    setSelectedGroupId(g.id)
  }

  function handleAddStudent(student: User) {
    setGroups((prev) => prev.map((g) =>
      g.id === selectedGroupId
        ? { ...g, students: [...g.students, student], studentCount: g.studentCount + 1 }
        : g
    ))
  }

  function handleRemoveStudent(studentId: string) {
    setGroups((prev) => prev.map((g) =>
      g.id === selectedGroupId
        ? { ...g, students: g.students.filter((s) => s.id !== studentId), studentCount: Math.max(0, g.studentCount - 1) }
        : g
    ))
  }

  function handleCreateTeam(name: string) {
    if (!name.trim() || !selectedGroupId) return
    const group = groups.find((g) => g.id === selectedGroupId)!
    const t: Team = { id: `t-${Date.now()}`, name: name.trim(), groupId: selectedGroupId, groupName: group.name, memberIds: [], memberNames: [] }
    setTeams((prev) => [...prev, t])
  }

  function handleDeleteTeam(teamId: string) {
    setTeams((prev) => prev.filter((t) => t.id !== teamId))
  }

  // Show Group Detail
  if (selectedGroup) {
    return (
      <>
        <GroupDetail
          group={selectedGroup}
          teams={teams}
          onBack={() => setSelectedGroupId(null)}
          onAddStudent={() => setShowAddStudent(true)}
          onRemoveStudent={handleRemoveStudent}
          onCreateTeam={handleCreateTeam}
          onDeleteTeam={handleDeleteTeam}
        />
        {showAddStudent && (
          <AddStudentModal
            group={selectedGroup}
            onClose={() => setShowAddStudent(false)}
            onAdd={handleAddStudent}
          />
        )}
      </>
    )
  }

  // Groups list
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Groups & Teams</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{groups.length} group{groups.length !== 1 ? 's' : ''} within your scope</p>
        </div>
        <button onClick={() => setShowCreateGroup(true)} className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}>
          + Create Group
        </button>
      </div>

      <div className="space-y-3">
        {groups.map((g) => {
          const groupTeams = teams.filter((t) => t.groupId === g.id)
          const groupAssessments = ASSESSMENTS.filter((a) => a.groupId === g.id)
          return (
            <button
              key={g.id}
              onClick={() => setSelectedGroupId(g.id)}
              className="w-full text-left rounded-xl p-5 transition-shadow hover:shadow-md"
              style={{ background: 'var(--card)', border: '1px solid var(--border)', cursor: 'pointer' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: 'var(--primary)' }}>
                    {g.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-base font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>{g.name}</p>
                      <span className="text-xs mono px-2 py-0.5 rounded-full" style={{ background: '#DBEAFE', color: '#1E40AF' }}>{g.name}</span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{g.courseName}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                      Teacher: {g.teacherNames.join(', ')}
                      {g.startDate && ` · ${g.startDate} → ${g.endDate}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-5 text-center flex-shrink-0">
                  {[
                    { label: 'Students', value: g.studentCount, color: 'var(--primary)' },
                    { label: 'Teams', value: groupTeams.length, color: '#0891B2' },
                    { label: 'Assessments', value: groupAssessments.length, color: '#6D28D9' },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <p className="text-lg font-bold mono" style={{ color }}>{value}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {showCreateGroup && (
        <CreateGroupModal onClose={() => setShowCreateGroup(false)} onCreate={handleCreateGroup} />
      )}
    </div>
  )
}
