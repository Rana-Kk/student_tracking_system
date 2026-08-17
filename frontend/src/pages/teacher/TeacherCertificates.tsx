import { useState } from 'react'
import { CERTIFICATES, STUDENTS } from '../../data/mockData'
import type { Certificate } from '../../types'

export default function TeacherCertificates() {
  const [certs, setCerts] = useState<Certificate[]>(CERTIFICATES)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ studentId: '', name: '', issuingOrganization: '', issueDate: '', expiryDate: '', certificateCode: '' })

  const addCert = () => {
    const student = STUDENTS.find((s) => s.id === form.studentId)
    if (!student || !form.name) return
    setCerts((prev) => [...prev, {
      id: `cert-${Date.now()}`,
      studentId: form.studentId,
      studentName: student.name,
      name: form.name,
      issuingOrganization: form.issuingOrganization,
      issueDate: form.issueDate,
      expiryDate: form.expiryDate || undefined,
      certificateCode: form.certificateCode || undefined,
    }])
    setShowModal(false)
    setForm({ studentId: '', name: '', issuingOrganization: '', issueDate: '', expiryDate: '', certificateCode: '' })
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Certificates</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Issue and manage student certificates</p>
        </div>
        <button onClick={() => setShowModal(true)} className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}>
          + Issue Certificate
        </button>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--muted)' }}>
              {['Student', 'Certificate', 'Issuing Org', 'Code', 'Issue Date', 'Expiry', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {certs.map((c, i) => (
              <tr key={c.id} style={{ borderBottom: i < certs.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <td className="px-4 py-3.5 text-sm font-medium">{c.studentName ?? '—'}</td>
                <td className="px-4 py-3.5 text-sm">{c.name}</td>
                <td className="px-4 py-3.5 text-sm" style={{ color: 'var(--muted-foreground)' }}>{c.issuingOrganization}</td>
                <td className="px-4 py-3.5 text-xs mono" style={{ color: 'var(--muted-foreground)' }}>{c.certificateCode ?? '—'}</td>
                <td className="px-4 py-3.5 text-xs mono">{c.issueDate}</td>
                <td className="px-4 py-3.5 text-xs mono" style={{ color: 'var(--muted-foreground)' }}>{c.expiryDate ?? '—'}</td>
                <td className="px-4 py-3.5">
                  <button className="text-xs px-2.5 py-1 rounded-lg mr-1.5" style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}>Edit</button>
                  <button className="text-xs px-2.5 py-1 rounded-lg" style={{ background: '#FEE2E2', color: '#B91C1C', border: 'none', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={() => setShowModal(false)}>
          <div className="rounded-xl p-6 w-full max-w-md" style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>Issue Certificate</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>Student</label>
                <select value={form.studentId} onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1px solid var(--border)', background: 'var(--muted)', outline: 'none' }}>
                  <option value="">Select student…</option>
                  {STUDENTS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              {[
                { key: 'name', label: 'Certificate Name', placeholder: 'e.g. React Developer Certification' },
                { key: 'issuingOrganization', label: 'Issuing Organization', placeholder: 'e.g. Lexicon Institute' },
                { key: 'certificateCode', label: 'Certificate Code', placeholder: 'e.g. LXN-2026-RD-0001' },
                { key: 'issueDate', label: 'Issue Date', placeholder: '2026-05-15' },
                { key: 'expiryDate', label: 'Expiry Date (optional)', placeholder: '2029-05-15' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>{label}</label>
                  <input type="text" value={form[key as keyof typeof form]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} className="w-full px-3 py-2.5 rounded-lg text-sm" style={{ border: '1px solid var(--border)', background: 'var(--muted)', outline: 'none' }} />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-lg text-sm" style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
              <button onClick={addCert} className="flex-1 py-2.5 rounded-lg text-sm font-semibold" style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}>Issue Certificate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
