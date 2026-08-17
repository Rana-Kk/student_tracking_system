export type Role = 'admin' | 'teacher' | 'student'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  active?: boolean
}

export interface Course {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
}

export interface Group {
  id: string
  name: string
  courseId: string
  courseName: string
  teacherIds: string[]
  teacherNames: string[]
  studentCount: number
}

export interface Team {
  id: string
  name: string
  groupId: string
  groupName: string
  memberIds: string[]
  memberNames: string[]
}

export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Excused'
export type Session = 'Morning' | 'Afternoon'

export interface AttendanceRecord {
  studentId: string
  studentName: string
  status: AttendanceStatus
}

export type AssessmentType = 'Project' | 'Assignment' | 'Presentation' | 'Practical' | 'Final Project' | 'Other'
export type SubmissionMode = 'Individual' | 'Team'
export type SubmissionStatus = 'Not Submitted' | 'Submitted' | 'Analyzing' | 'AI Draft Ready' | 'Teacher Review' | 'Approved' | 'Rejected'

export interface RubricCriterion {
  id: string
  name: string
  description: string
  maxScore: number
  order: number
}

export interface Assessment {
  id: string
  title: string
  description: string
  type: AssessmentType
  groupId: string
  groupName: string
  submissionMode: SubmissionMode
  assessmentDate: string
  dueDate: string
  maxScore: number
  rubric: RubricCriterion[]
  createdBy: string
}

export interface AssessmentSubmission {
  id: string
  assessmentId: string
  assessmentTitle: string
  studentId?: string
  studentName?: string
  teamId?: string
  teamName?: string
  teamMembers?: string[]
  githubUrl: string
  submittedAt: string
  status: SubmissionStatus
  lastAnalyzedAt?: string
}

export interface CriterionScore {
  criterionId: string
  criterionName: string
  maxScore: number
  aiRecommendedScore: number
  aiRationale: string
  teacherFinalScore: number
  teacherOverride?: boolean
}

export type EvaluationStatus = 'Draft' | 'Approved' | 'Rejected'

export interface AIEvaluation {
  id: string
  submissionId: string
  assessmentTitle: string
  studentName?: string
  teamName?: string
  githubUrl: string
  criterionScores: CriterionScore[]
  totalAIScore: number
  totalTeacherScore: number
  maxScore: number
  strengths: string
  areasForImprovement: string
  recommendations: string
  suggestedNextSteps: string
  status: EvaluationStatus
  reviewedBy?: string
  createdAt: string
  reviewedAt?: string
}

export type AttendanceStatusType = AttendanceStatus
export type FeedbackStatus = EvaluationStatus

export interface Competency {
  skill: string
  level: number
  trend: 'improving' | 'stable' | 'declining'
}

export interface Certificate {
  id: string
  studentId?: string
  studentName?: string
  name: string
  issuingOrganization: string
  issueDate: string
  expiryDate?: string
  certificateCode?: string
  fileUrl?: string
}

export interface Quiz {
  id: string
  groupId: string
  title: string
  topic: string
  date: string
  maxScore: number
  source: string
}

export interface QuizResult {
  id: string
  studentId: string
  studentName: string
  quizId: string
  quizTitle: string
  topic: string
  score: number
  maxScore: number
  percentage: number
  completedAt: string
}

export interface QuizImportRow {
  email: string
  quizName: string
  topic: string
  score: number
  date: string
  status: 'valid' | 'invalid' | 'duplicate' | 'missing_student'
  error?: string
}
