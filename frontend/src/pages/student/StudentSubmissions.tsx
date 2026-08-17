import { useState } from 'react'
import { ASSESSMENTS, SUBMISSIONS, AI_EVALUATIONS } from '../../data/mockData'

// Student-facing steps — AI analysis is completely hidden
const STUDENT_STEPS = ['Submitted', 'Teacher Review', 'Approved'] as const

// Map internal submission status to the student-visible step index (0-based)
function studentStep(status: string): number {
  switch (status) {
    case 'Submitted':
    case 'Analyzing':
    case 'AI Draft Ready':
      return 0
    case 'Teacher Review':
      return 1
    case 'Approved':
    case 'Rejected':
      return 2
    default:
      return -1
  }
}

export default function StudentSubmissions() {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(ASSESSMENTS[0].id)
  const [githubUrl, setGithubUrl] = useState('')
  const [urlError, setUrlError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const assessment = ASSESSMENTS.find((a) => a.id === selectedAssessmentId)!
  const mySubmission = SUBMISSIONS.find(
    (s) => s.assessmentId === selectedAssessmentId && (s.studentId === 'student-1' || s.teamId === 't1')
  )
  const approvedEval = mySubmission?.status === 'Approved'
    ? AI_EVALUATIONS.find((e) => e.submissionId === mySubmission.id)
    : null

  const validateAndSubmit = () => {
    setUrlError('')
    if (!githubUrl.trim()) { setUrlError('Please enter a GitHub repository URL.'); return }
    if (!githubUrl.includes('github.com')) { setUrlError('URL must be a valid GitHub repository (e.g. https://github.com/username/repo).'); return }
    setSubmitted(true)
  }

  const internalStatus = mySubmission?.status ?? (submitted ? 'Submitted' : 'Not Submitted')
  const stepIndex = studentStep(internalStatus)
  const isRejected = internalStatus === 'Rejected'

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>My Submissions</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Submit your GitHub repository and track review status</p>
      </div>

      {/* Assessment tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {ASSESSMENTS.map((a) => (
          <button key={a.id} onClick={() => setSelectedAssessmentId(a.id)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: selectedAssessmentId === a.id ? 'var(--primary)' : 'var(--card)', color: selectedAssessmentId === a.id ? 'white' : 'var(--foreground)', border: `1px solid ${selectedAssessmentId === a.id ? 'var(--primary)' : 'var(--border)'}`, cursor: 'pointer' }}>
            {a.title}
          </button>
        ))}
      </div>

      {/* Assignment info */}
      <div className="rounded-xl p-5 mb-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-semibold mb-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>{assessment.title}</h2>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{assessment.description}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm border-t pt-4" style={{ borderColor: 'var(--border)' }}>
          <div><p className="text-xs mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Group</p><p className="font-medium mono text-xs">{assessment.groupName}</p></div>
          <div><p className="text-xs mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Due Date</p><p className="font-medium mono text-xs">{assessment.dueDate}</p></div>
          <div><p className="text-xs mb-0.5" style={{ color: 'var(--muted-foreground)' }}>Submission Mode</p><p className="font-medium text-xs">{assessment.submissionMode}</p></div>
        </div>
      </div>

      {/* Status tracker — 3 student-visible steps only */}
      {stepIndex >= 0 && (
        <div className="rounded-xl p-5 mb-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <p className="text-sm font-semibold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>Submission Status</p>
          <div className="flex items-center">
            {STUDENT_STEPS.map((step, i) => {
              const done = i < stepIndex || (stepIndex === 2 && !isRejected)
              const current = i === stepIndex && !(stepIndex === 2 && isRejected)
              const rejected = isRejected && i === 2
              return (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: rejected ? '#FEE2E2' : done ? '#15803D' : current ? 'var(--primary)' : 'var(--secondary)',
                        color: rejected ? '#B91C1C' : (done || current) ? 'white' : 'var(--muted-foreground)',
                      }}
                    >
                      {rejected ? '✕' : done && !current ? '✓' : i + 1}
                    </div>
                    <span className="text-xs whitespace-nowrap" style={{ color: rejected ? '#B91C1C' : current ? 'var(--primary)' : done ? '#15803D' : 'var(--muted-foreground)', fontWeight: current ? 600 : 400 }}>
                      {rejected && step === 'Approved' ? 'Not Approved' : step}
                    </span>
                  </div>
                  {i < STUDENT_STEPS.length - 1 && (
                    <div className="flex-1 h-px mx-2 mb-4" style={{ background: i < stepIndex ? '#15803D' : 'var(--border)' }} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Submitted repo URL */}
          {mySubmission?.githubUrl && (
            <div className="mt-4 pt-4 border-t flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
              <span style={{ color: '#94A3B8' }}>⎇</span>
              <span className="text-sm mono" style={{ color: 'var(--primary)' }}>{mySubmission.githubUrl}</span>
              <span className="text-xs ml-auto mono" style={{ color: 'var(--muted-foreground)' }}>
                Submitted {mySubmission.submittedAt ? new Date(mySubmission.submittedAt).toLocaleDateString('en-GB') : ''}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Submit form */}
      {internalStatus === 'Not Submitted' && !submitted && (
        <div className="rounded-xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <p className="text-sm font-semibold mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {assessment.submissionMode === 'Team' ? 'Submit Team Repository' : 'Submit Your Repository'}
          </p>
          {assessment.submissionMode === 'Team' && (
            <div className="mb-3 px-3 py-2.5 rounded-lg text-sm" style={{ background: '#EFF6FF', color: '#1E40AF' }}>
              You are submitting on behalf of <strong>Team Alpha</strong> (Aisha Patel, Tobias Werner, Mei-Ling Chen)
            </div>
          )}
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--muted-foreground)' }}>GitHub Repository URL</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#94A3B8' }}>⎇</span>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => { setGithubUrl(e.target.value); setUrlError('') }}
                placeholder="https://github.com/username/project-name"
                className="w-full pl-8 pr-3 py-2.5 rounded-lg text-sm mono"
                style={{ border: `1px solid ${urlError ? '#FCA5A5' : 'var(--border)'}`, background: 'var(--muted)', outline: 'none' }}
              />
            </div>
            <button onClick={validateAndSubmit} className="px-5 py-2.5 rounded-lg text-sm font-semibold flex-shrink-0" style={{ background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer' }}>
              Submit Repository
            </button>
          </div>
          {urlError && <p className="text-xs mt-1.5" style={{ color: '#B91C1C' }}>{urlError}</p>}
          <p className="text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>
            Submit your GitHub repository URL. Do not upload files directly.
          </p>
        </div>
      )}

      {/* Just submitted locally */}
      {submitted && internalStatus === 'Submitted' && (
        <div className="rounded-xl p-5 text-center" style={{ background: '#F0FDF4', border: '1px solid #86EFAC' }}>
          <p className="text-2xl mb-2">✓</p>
          <p className="font-semibold" style={{ color: '#15803D', fontFamily: 'Outfit, sans-serif' }}>Repository submitted successfully</p>
          <p className="text-sm mt-1" style={{ color: '#166534' }}>Your submission is currently being reviewed by your teacher.</p>
        </div>
      )}

      {/* Pending — any non-approved submitted state */}
      {mySubmission && !['Not Submitted', 'Approved', 'Rejected'].includes(internalStatus) && (
        <div className="rounded-xl p-5 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          <p className="text-sm font-medium mb-1">Your submission is currently being reviewed by your teacher.</p>
          <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Your result will be available once the review is complete.</p>
        </div>
      )}

      {/* Rejected */}
      {isRejected && (
        <div className="rounded-xl p-5" style={{ background: '#FFF1F2', border: '1px solid #FECDD3' }}>
          <p className="font-semibold mb-1" style={{ color: '#B91C1C', fontFamily: 'Outfit, sans-serif' }}>Submission not approved</p>
          <p className="text-sm" style={{ color: '#9F1239' }}>Your teacher has not approved this submission. Please check with your teacher for further guidance.</p>
        </div>
      )}

      {/* Approved result — show final teacher-approved score and feedback only */}
      {approvedEval && (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #86EFAC' }}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ background: '#F0FDF4', borderBottom: '1px solid #86EFAC' }}>
            <p className="font-semibold" style={{ color: '#15803D', fontFamily: 'Outfit, sans-serif' }}>✓ Your result is now available</p>
            <div className="text-right">
              <p className="text-2xl font-bold mono" style={{ color: '#15803D' }}>
                {approvedEval.totalTeacherScore}<span className="text-base font-normal">/{approvedEval.maxScore}</span>
              </p>
              <p className="text-xs" style={{ color: '#166534' }}>Final Score · {Math.round((approvedEval.totalTeacherScore / approvedEval.maxScore) * 100)}%</p>
            </div>
          </div>
          <div className="p-5 space-y-4" style={{ background: 'var(--card)' }}>
            {/* Criterion breakdown — teacher final scores only, no AI info */}
            <div>
              <p className="text-sm font-semibold mb-3">Score Breakdown</p>
              <div className="space-y-2">
                {approvedEval.criterionScores.map((c) => (
                  <div key={c.criterionId} className="flex items-center gap-3">
                    <span className="text-sm flex-1">{c.criterionName}</span>
                    <div className="flex-1 rounded-full overflow-hidden" style={{ height: '6px', background: 'var(--secondary)' }}>
                      <div className="h-full rounded-full" style={{ width: `${(c.teacherFinalScore / c.maxScore) * 100}%`, background: 'var(--primary)' }} />
                    </div>
                    <span className="text-sm mono font-semibold w-12 text-right">{c.teacherFinalScore}/{c.maxScore}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback sections — teacher-approved content, no AI attribution shown to student */}
            {([
              { key: 'strengths', label: 'Strengths', bg: '#F0FDF4', color: '#15803D' },
              { key: 'areasForImprovement', label: 'Areas for Improvement', bg: '#FFFBEB', color: '#92400E' },
              { key: 'recommendations', label: 'Recommendations', bg: '#EFF6FF', color: '#1E40AF' },
              { key: 'suggestedNextSteps', label: 'Next Steps', bg: '#FAF5FF', color: '#6D28D9' },
            ] as const).map(({ key, label, bg, color }) => (
              <div key={key} className="rounded-lg p-4" style={{ background: bg }}>
                <p className="text-xs font-semibold mb-1.5" style={{ color }}>{label}</p>
                <p className="text-sm leading-relaxed" style={{ color }}>{approvedEval[key]}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
