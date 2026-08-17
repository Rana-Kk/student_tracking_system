import { useState } from 'react'
import { CERTIFICATES } from '../../data/mockData'
import type { Certificate } from '../../types'

const EMPTY: Omit<Certificate, 'id' | 'studentId' | 'studentName' | 'fileUrl'> = {
  name: '',
  issuingOrganization: '',
  certificateCode: '',
  issueDate: '',
  expiryDate: '',
}

export default function StudentCertificates() {
  const [certs, setCerts] = useState<Certificate[]>(CERTIFICATES)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ ...EMPTY })
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  function validate() {
    const e: Partial<typeof form> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.issuingOrganization.trim()) e.issuingOrganization = 'Required'
    if (!form.issueDate.trim()) e.issueDate = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleAdd() {
    if (!validate()) return
    const newCert: Certificate = {
      id: `cert-student-${Date.now()}`,
      studentId: 'student-1',
      studentName: 'Alex Johnson',
      fileUrl: '',
      ...form,
    }
    setCerts((prev) => [...prev, newCert])
    setForm({ ...EMPTY })
    setErrors({})
    setShowAdd(false)
  }

  function field(key: keyof typeof form, label: string, placeholder: string, type = 'text') {
    return (
      <div key={key}>
        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
          {label}{key !== 'certificateCode' && key !== 'expiryDate' && <span style={{ color: '#EF4444' }}> *</span>}
        </label>
        <input
          type={type}
          placeholder={placeholder}
          value={form[key]}
          onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
          className="w-full px-3 py-2.5 rounded-lg text-sm"
          style={{ border: `1px solid ${errors[key] ? '#EF4444' : 'var(--border)'}`, background: 'var(--muted)', outline: 'none' }}
        />
        {errors[key] && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors[key]}</p>}
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>Certificates</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{certs.length} certificate{certs.length !== 1 ? 's' : ''} earned</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="text-sm font-semibold px-4 py-2 rounded-lg"
          style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          + Add Certificate
        </button>
      </div>

      {certs.length === 0 && (
        <div className="rounded-xl py-16 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <p className="text-3xl mb-3">🏆</p>
          <p className="font-medium" style={{ color: 'var(--muted-foreground)' }}>No certificates yet</p>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Add your first certificate to get started.</p>
        </div>
      )}

      <div className="space-y-3">
        {certs.map((cert) => (
          <div
            key={cert.id}
            className="rounded-xl p-5 flex items-center gap-5"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #FEF3C7, #FCD34D)' }}
            >
              🏆
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>{cert.name}</p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{cert.issuingOrganization}</p>
              <div className="flex items-center gap-4 mt-2 text-xs mono" style={{ color: 'var(--muted-foreground)' }}>
                <span>Issued: {cert.issueDate}</span>
                {cert.expiryDate && <span>Expires: {cert.expiryDate}</span>}
                {cert.certificateCode && <span>Code: {cert.certificateCode}</span>}
              </div>
            </div>
            <button
              className="flex-shrink-0 text-sm font-medium px-4 py-2 rounded-lg"
              style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}
            >
              Download
            </button>
          </div>
        ))}
      </div>

      {/* Add Certificate Modal */}
      {showAdd && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={() => setShowAdd(false)}
        >
          <div
            className="rounded-xl p-6 w-full max-w-md"
            style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>Add Certificate</h2>
            <div className="space-y-3">
              {field('name', 'Certificate Name', 'e.g. AWS Certified Developer')}
              {field('issuingOrganization', 'Issuing Organization', 'e.g. Amazon Web Services')}
              {field('certificateCode', 'Certificate Code', 'e.g. AWD-123456 (optional)')}
              <div className="grid grid-cols-2 gap-3">
                {field('issueDate', 'Issue Date', '2026-01-15', 'date')}
                {field('expiryDate', 'Expiry Date', '2029-01-15 (optional)', 'date')}
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => { setShowAdd(false); setErrors({}) }}
                className="flex-1 py-2.5 rounded-lg text-sm"
                style={{ border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                Add Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
