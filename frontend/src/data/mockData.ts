import type {
  User, Course, Group, Team, AttendanceRecord, Assessment,
  AssessmentSubmission, AIEvaluation, CriterionScore,
  Competency, Certificate, Quiz, QuizResult, QuizImportRow
} from '../types'

export const DEMO_USERS: User[] = [
  { id: 'admin-1', name: 'Sarah Mitchell', email: 'admin@lexicon.edu', role: 'admin', active: true },
  { id: 'teacher-1', name: 'James Okonkwo', email: 'teacher@lexicon.edu', role: 'teacher', active: true },
  { id: 'student-1', name: 'Aisha Patel', email: 'student@lexicon.edu', role: 'student', active: true },
]

export const COURSES: Course[] = [
  { id: 'c1', name: 'Full-Stack Web Development', description: 'Intensive 16-week program covering React, Node.js, SQL, and DevOps.', startDate: '2026-02-03', endDate: '2026-05-30' },
  { id: 'c2', name: 'Data Engineering Fundamentals', description: '12-week program in Python, SQL, ETL pipelines, and cloud data platforms.', startDate: '2026-03-10', endDate: '2026-06-06' },
  { id: 'c3', name: 'UX & Product Design', description: '10-week program covering design thinking, Figma, prototyping, and user research.', startDate: '2026-04-07', endDate: '2026-06-20' },
]

export const GROUPS: Group[] = [
  { id: 'g1', name: 'FSWD-2026-A', courseId: 'c1', courseName: 'Full-Stack Web Development', teacherIds: ['teacher-1'], teacherNames: ['James Okonkwo'], studentCount: 18 },
  { id: 'g2', name: 'FSWD-2026-B', courseId: 'c1', courseName: 'Full-Stack Web Development', teacherIds: ['teacher-2'], teacherNames: ['Priya Sharma'], studentCount: 16 },
  { id: 'g3', name: 'DE-2026-A', courseId: 'c2', courseName: 'Data Engineering Fundamentals', teacherIds: ['teacher-3'], teacherNames: ['Carlos Reyes'], studentCount: 14 },
  { id: 'g4', name: 'UXD-2026-A', courseId: 'c3', courseName: 'UX & Product Design', teacherIds: ['teacher-4'], teacherNames: ['Ngozi Adeyemi'], studentCount: 12 },
]

export const TEAMS: Team[] = [
  { id: 't1', name: 'Team Alpha', groupId: 'g1', groupName: 'FSWD-2026-A', memberIds: ['student-1', 'student-2', 'student-3'], memberNames: ['Aisha Patel', 'Tobias Werner', 'Mei-Ling Chen'] },
  { id: 't2', name: 'Team Beta', groupId: 'g1', groupName: 'FSWD-2026-A', memberIds: ['student-4', 'student-5'], memberNames: ['Kofi Asante', 'Layla Hassan'] },
  { id: 't3', name: 'Team Gamma', groupId: 'g1', groupName: 'FSWD-2026-A', memberIds: ['student-6', 'student-7', 'student-8'], memberNames: ['Dmitri Volkov', 'Sofia Barbosa', 'Ravi Nair'] },
]

export const TEACHERS: User[] = [
  { id: 'teacher-1', name: 'James Okonkwo', email: 'j.okonkwo@lexicon.edu', role: 'teacher', active: true },
  { id: 'teacher-2', name: 'Priya Sharma', email: 'p.sharma@lexicon.edu', role: 'teacher', active: true },
  { id: 'teacher-3', name: 'Carlos Reyes', email: 'c.reyes@lexicon.edu', role: 'teacher', active: true },
  { id: 'teacher-4', name: 'Ngozi Adeyemi', email: 'n.adeyemi@lexicon.edu', role: 'teacher', active: true },
]

export const STUDENTS: User[] = [
  { id: 'student-1', name: 'Aisha Patel', email: 'a.patel@lexicon.edu', role: 'student', active: true },
  { id: 'student-2', name: 'Tobias Werner', email: 't.werner@lexicon.edu', role: 'student', active: true },
  { id: 'student-3', name: 'Mei-Ling Chen', email: 'm.chen@lexicon.edu', role: 'student', active: true },
  { id: 'student-4', name: 'Kofi Asante', email: 'k.asante@lexicon.edu', role: 'student', active: true },
  { id: 'student-5', name: 'Layla Hassan', email: 'l.hassan@lexicon.edu', role: 'student', active: true },
  { id: 'student-6', name: 'Dmitri Volkov', email: 'd.volkov@lexicon.edu', role: 'student', active: true },
  { id: 'student-7', name: 'Sofia Barbosa', email: 's.barbosa@lexicon.edu', role: 'student', active: true },
  { id: 'student-8', name: 'Ravi Nair', email: 'r.nair@lexicon.edu', role: 'student', active: true },
]

export const ATTENDANCE_RECORDS: AttendanceRecord[] = STUDENTS.map((s, i) => ({
  studentId: s.id,
  studentName: s.name,
  status: (['Present', 'Present', 'Present', 'Late', 'Present', 'Absent', 'Present', 'Excused'] as const)[i],
}))

export const ASSESSMENTS: Assessment[] = [
  {
    id: 'a1',
    title: 'Full Stack Learning Platform',
    description: 'Build a full-stack learning management system with authentication, course management, and student progress tracking.',
    type: 'Final Project',
    groupId: 'g1',
    groupName: 'FSWD-2026-A',
    submissionMode: 'Team',
    assessmentDate: '2026-05-12',
    dueDate: '2026-05-16',
    maxScore: 100,
    createdBy: 'teacher-1',
    rubric: [
      { id: 'r1', name: 'Code Quality', description: 'Code organization, readability, and best practices', maxScore: 10, order: 1 },
      { id: 'r2', name: 'Database Design', description: 'Database structure, normalization, and relationships', maxScore: 10, order: 2 },
      { id: 'r3', name: 'Backend', description: 'API design, middleware, authentication, and reliability', maxScore: 20, order: 3 },
      { id: 'r4', name: 'Frontend', description: 'UI implementation, UX quality, and responsiveness', maxScore: 20, order: 4 },
      { id: 'r5', name: 'Testing', description: 'Test coverage, test quality, and CI integration', maxScore: 10, order: 5 },
      { id: 'r6', name: 'Documentation', description: 'README, API docs, and inline comments', maxScore: 10, order: 6 },
      { id: 'r7', name: 'Deployment', description: 'CI/CD pipeline and production deployment', maxScore: 10, order: 7 },
      { id: 'r8', name: 'Presentation', description: 'Demo quality and ability to explain decisions', maxScore: 10, order: 8 },
    ],
  },
  {
    id: 'a2',
    title: 'React Component Architecture',
    description: 'Build a modular React application demonstrating state management, custom hooks, and component reuse.',
    type: 'Assignment',
    groupId: 'g1',
    groupName: 'FSWD-2026-A',
    submissionMode: 'Individual',
    assessmentDate: '2026-04-14',
    dueDate: '2026-04-18',
    maxScore: 80,
    createdBy: 'teacher-1',
    rubric: [
      { id: 'r9', name: 'Component Design', description: 'Separation of concerns and component reuse', maxScore: 20, order: 1 },
      { id: 'r10', name: 'State Management', description: 'Correct use of hooks and state patterns', maxScore: 20, order: 2 },
      { id: 'r11', name: 'Code Quality', description: 'TypeScript types, naming, and readability', maxScore: 20, order: 3 },
      { id: 'r12', name: 'Documentation', description: 'README and code comments', maxScore: 10, order: 4 },
      { id: 'r13', name: 'Testing', description: 'Unit tests with React Testing Library', maxScore: 10, order: 5 },
    ],
  },
]

const RUBRIC_A1 = ASSESSMENTS[0].rubric

const CRITERION_SCORES_ALPHA: CriterionScore[] = [
  { criterionId: 'r1', criterionName: 'Code Quality', maxScore: 10, aiRecommendedScore: 8, aiRationale: 'Code is well-structured with consistent naming conventions. Minor inconsistencies in error handling patterns.', teacherFinalScore: 8, teacherOverride: false },
  { criterionId: 'r2', criterionName: 'Database Design', maxScore: 10, aiRecommendedScore: 7, aiRationale: 'Relationships are mostly correct. The user-course join table lacks an index on foreign keys which may impact performance.', teacherFinalScore: 9, teacherOverride: true },
  { criterionId: 'r3', criterionName: 'Backend', maxScore: 20, aiRecommendedScore: 17, aiRationale: 'API structure is strong with proper REST conventions. JWT implementation is correct. Missing rate limiting on auth endpoints.', teacherFinalScore: 17, teacherOverride: false },
  { criterionId: 'r4', criterionName: 'Frontend', maxScore: 20, aiRecommendedScore: 16, aiRationale: 'Clean component hierarchy. Responsive layout works well at 1024px+. Some accessibility attributes missing on interactive elements.', teacherFinalScore: 18, teacherOverride: true },
  { criterionId: 'r5', criterionName: 'Testing', maxScore: 10, aiRecommendedScore: 5, aiRationale: 'Limited automated tests. Only happy-path tests present. No integration tests for API endpoints.', teacherFinalScore: 7, teacherOverride: true },
  { criterionId: 'r6', criterionName: 'Documentation', maxScore: 10, aiRecommendedScore: 9, aiRationale: 'README is thorough with setup instructions, architecture diagram, and API reference. Good use of JSDoc comments.', teacherFinalScore: 9, teacherOverride: false },
  { criterionId: 'r7', criterionName: 'Deployment', maxScore: 10, aiRecommendedScore: 8, aiRationale: 'Working CI/CD pipeline via GitHub Actions. Deployed to Railway. No staging environment configured.', teacherFinalScore: 8, teacherOverride: false },
  { criterionId: 'r8', criterionName: 'Presentation', maxScore: 10, aiRecommendedScore: 9, aiRationale: 'Clear and confident demo. Team answered technical questions well and articulated design decisions.', teacherFinalScore: 9, teacherOverride: false },
]

export const SUBMISSIONS: AssessmentSubmission[] = [
  { id: 's1', assessmentId: 'a1', assessmentTitle: 'Full Stack Learning Platform', teamId: 't1', teamName: 'Team Alpha', teamMembers: ['Aisha Patel', 'Tobias Werner', 'Mei-Ling Chen'], githubUrl: 'github.com/team-alpha/lexicon-platform', submittedAt: '2026-05-15T14:32:00Z', status: 'Teacher Review', lastAnalyzedAt: '2026-05-15T15:10:00Z' },
  { id: 's2', assessmentId: 'a1', assessmentTitle: 'Full Stack Learning Platform', teamId: 't2', teamName: 'Team Beta', teamMembers: ['Kofi Asante', 'Layla Hassan'], githubUrl: 'github.com/team-beta/lms-app', submittedAt: '2026-05-16T09:14:00Z', status: 'Approved', lastAnalyzedAt: '2026-05-16T10:00:00Z' },
  { id: 's3', assessmentId: 'a1', assessmentTitle: 'Full Stack Learning Platform', teamId: 't3', teamName: 'Team Gamma', teamMembers: ['Dmitri Volkov', 'Sofia Barbosa', 'Ravi Nair'], githubUrl: 'github.com/team-gamma/fswd-project', submittedAt: '2026-05-16T11:55:00Z', status: 'Analyzing', lastAnalyzedAt: undefined },
  { id: 's4', assessmentId: 'a2', assessmentTitle: 'React Component Architecture', studentId: 'student-1', studentName: 'Aisha Patel', githubUrl: 'github.com/aisha-patel/react-arch', submittedAt: '2026-04-17T10:20:00Z', status: 'Approved', lastAnalyzedAt: '2026-04-17T11:00:00Z' },
  { id: 's5', assessmentId: 'a2', assessmentTitle: 'React Component Architecture', studentId: 'student-2', studentName: 'Tobias Werner', githubUrl: 'github.com/tobias-w/react-components', submittedAt: '2026-04-17T13:45:00Z', status: 'AI Draft Ready', lastAnalyzedAt: '2026-04-17T14:30:00Z' },
  { id: 's6', assessmentId: 'a2', assessmentTitle: 'React Component Architecture', studentId: 'student-3', studentName: 'Mei-Ling Chen', githubUrl: 'github.com/mei-chen/component-lib', submittedAt: '2026-04-18T08:30:00Z', status: 'Approved', lastAnalyzedAt: '2026-04-18T09:15:00Z' },
  { id: 's7', assessmentId: 'a2', assessmentTitle: 'React Component Architecture', studentId: 'student-4', studentName: 'Kofi Asante', githubUrl: '', submittedAt: '', status: 'Not Submitted' },
]

export const AI_EVALUATIONS: AIEvaluation[] = [
  {
    id: 'eval1',
    submissionId: 's1',
    assessmentTitle: 'Full Stack Learning Platform',
    teamName: 'Team Alpha',
    githubUrl: 'github.com/team-alpha/lexicon-platform',
    criterionScores: CRITERION_SCORES_ALPHA,
    totalAIScore: 79,
    totalTeacherScore: 85,
    maxScore: 100,
    strengths: 'Team Alpha produced an exceptionally clean codebase. The backend API follows REST conventions consistently and the database schema is well-normalized. The README is among the best in the cohort — thorough, accurate, and readable. The team\'s live demo was confident and technically articulate.',
    areasForImprovement: 'Test coverage is the main weakness — only happy-path scenarios are covered and there are no integration tests for API endpoints. The frontend also lacks aria-label attributes on several interactive elements, which would be flagged in an accessibility audit.',
    recommendations: 'Implement at minimum one integration test suite for the authentication flow and core CRUD endpoints. Run axe-core against the deployed app and address any accessibility violations. Consider adding a staging environment to the CI/CD pipeline.',
    suggestedNextSteps: 'Complete the advanced testing module (Module 11). Schedule a code review session focused on accessibility before the end of the cohort. Review the OWASP API Security Top 10 to strengthen the auth layer.',
    status: 'Draft',
    createdAt: '2026-05-15T15:10:00Z',
  },
  {
    id: 'eval2',
    submissionId: 's2',
    assessmentTitle: 'Full Stack Learning Platform',
    teamName: 'Team Beta',
    githubUrl: 'github.com/team-beta/lms-app',
    criterionScores: [
      { criterionId: 'r1', criterionName: 'Code Quality', maxScore: 10, aiRecommendedScore: 7, aiRationale: 'Generally readable but inconsistent use of async/await vs Promises.', teacherFinalScore: 7, teacherOverride: false },
      { criterionId: 'r2', criterionName: 'Database Design', maxScore: 10, aiRecommendedScore: 8, aiRationale: 'Schema is clean and well-indexed.', teacherFinalScore: 8, teacherOverride: false },
      { criterionId: 'r3', criterionName: 'Backend', maxScore: 20, aiRecommendedScore: 15, aiRationale: 'API works but error responses are not consistent across endpoints.', teacherFinalScore: 15, teacherOverride: false },
      { criterionId: 'r4', criterionName: 'Frontend', maxScore: 20, aiRecommendedScore: 14, aiRationale: 'Functional but mobile layout breaks below 768px.', teacherFinalScore: 14, teacherOverride: false },
      { criterionId: 'r5', criterionName: 'Testing', maxScore: 10, aiRecommendedScore: 6, aiRationale: 'Some unit tests present, coverage is around 40%.', teacherFinalScore: 6, teacherOverride: false },
      { criterionId: 'r6', criterionName: 'Documentation', maxScore: 10, aiRecommendedScore: 7, aiRationale: 'README covers setup but API documentation is minimal.', teacherFinalScore: 7, teacherOverride: false },
      { criterionId: 'r7', criterionName: 'Deployment', maxScore: 10, aiRecommendedScore: 7, aiRationale: 'Deployed to Vercel + Railway. No CI pipeline.', teacherFinalScore: 7, teacherOverride: false },
      { criterionId: 'r8', criterionName: 'Presentation', maxScore: 10, aiRecommendedScore: 7, aiRationale: 'Demo was clear. Some technical questions were answered hesitantly.', teacherFinalScore: 7, teacherOverride: false },
    ],
    totalAIScore: 71,
    totalTeacherScore: 71,
    maxScore: 100,
    strengths: 'Solid understanding of the full-stack architecture. Database design is clean and the deployment is functional.',
    areasForImprovement: 'Frontend responsiveness needs work below tablet breakpoints. Error handling on the API is inconsistent.',
    recommendations: 'Refactor error middleware to return consistent JSON shapes across all endpoints. Fix mobile layout issues before the cohort showcase.',
    suggestedNextSteps: 'Review the Responsive Design module. Implement a global error handler middleware.',
    status: 'Approved',
    reviewedBy: 'James Okonkwo',
    createdAt: '2026-05-16T10:00:00Z',
    reviewedAt: '2026-05-16T14:30:00Z',
  },
]

export const STUDENT_COMPETENCIES: Competency[] = [
  { skill: 'React', level: 82, trend: 'improving' },
  { skill: 'TypeScript', level: 71, trend: 'improving' },
  { skill: 'SQL', level: 68, trend: 'stable' },
  { skill: 'Node.js', level: 74, trend: 'improving' },
  { skill: 'Git', level: 90, trend: 'stable' },
  { skill: 'Testing', level: 60, trend: 'improving' },
]

export const CERTIFICATES: Certificate[] = [
  { id: 'cert1', studentId: 'student-1', studentName: 'Aisha Patel', name: 'React Developer Certification', issuingOrganization: 'Lexicon Institute', issueDate: '2026-05-15', certificateCode: 'LXN-2026-RD-0412' },
  { id: 'cert2', studentId: 'student-1', studentName: 'Aisha Patel', name: 'AWS Cloud Practitioner', issuingOrganization: 'Amazon Web Services', issueDate: '2026-03-22', expiryDate: '2029-03-22', certificateCode: 'AWS-CLF-C02-7823' },
  { id: 'cert3', studentId: 'student-1', studentName: 'Aisha Patel', name: 'Professional Scrum Master I', issuingOrganization: 'Scrum.org', issueDate: '2026-01-10', certificateCode: 'PSM-I-91847' },
]

export const QUIZZES: Quiz[] = [
  { id: 'q1', groupId: 'g1', title: 'JavaScript Fundamentals', topic: 'Closures & Scope', date: '2026-02-14', maxScore: 20, source: 'Moodle Export' },
  { id: 'q2', groupId: 'g1', title: 'React Basics', topic: 'Hooks & Lifecycle', date: '2026-02-28', maxScore: 20, source: 'Moodle Export' },
  { id: 'q3', groupId: 'g1', title: 'SQL Joins', topic: 'Relational Algebra', date: '2026-03-14', maxScore: 20, source: 'Google Forms Import' },
  { id: 'q4', groupId: 'g1', title: 'TypeScript Types', topic: 'Generics & Utility Types', date: '2026-03-28', maxScore: 20, source: 'Moodle Export' },
  { id: 'q5', groupId: 'g1', title: 'Node.js APIs', topic: 'REST & Middleware', date: '2026-04-11', maxScore: 20, source: 'Excel Import' },
]

export const QUIZ_RESULTS: QuizResult[] = [
  { id: 'qr1', studentId: 'student-1', studentName: 'Aisha Patel', quizId: 'q1', quizTitle: 'JavaScript Fundamentals', topic: 'Closures & Scope', score: 18, maxScore: 20, percentage: 90, completedAt: '2026-02-14' },
  { id: 'qr2', studentId: 'student-1', studentName: 'Aisha Patel', quizId: 'q2', quizTitle: 'React Basics', topic: 'Hooks & Lifecycle', score: 16, maxScore: 20, percentage: 80, completedAt: '2026-02-28' },
  { id: 'qr3', studentId: 'student-1', studentName: 'Aisha Patel', quizId: 'q3', quizTitle: 'SQL Joins', topic: 'Relational Algebra', score: 14, maxScore: 20, percentage: 70, completedAt: '2026-03-14' },
  { id: 'qr4', studentId: 'student-1', studentName: 'Aisha Patel', quizId: 'q4', quizTitle: 'TypeScript Types', topic: 'Generics & Utility Types', score: 17, maxScore: 20, percentage: 85, completedAt: '2026-03-28' },
  { id: 'qr5', studentId: 'student-1', studentName: 'Aisha Patel', quizId: 'q5', quizTitle: 'Node.js APIs', topic: 'REST & Middleware', score: 15, maxScore: 20, percentage: 75, completedAt: '2026-04-11' },
  { id: 'qr6', studentId: 'student-2', studentName: 'Tobias Werner', quizId: 'q1', quizTitle: 'JavaScript Fundamentals', topic: 'Closures & Scope', score: 15, maxScore: 20, percentage: 75, completedAt: '2026-02-14' },
  { id: 'qr7', studentId: 'student-2', studentName: 'Tobias Werner', quizId: 'q2', quizTitle: 'React Basics', topic: 'Hooks & Lifecycle', score: 14, maxScore: 20, percentage: 70, completedAt: '2026-02-28' },
  { id: 'qr8', studentId: 'student-3', studentName: 'Mei-Ling Chen', quizId: 'q1', quizTitle: 'JavaScript Fundamentals', topic: 'Closures & Scope', score: 19, maxScore: 20, percentage: 95, completedAt: '2026-02-14' },
  { id: 'qr9', studentId: 'student-3', studentName: 'Mei-Ling Chen', quizId: 'q2', quizTitle: 'React Basics', topic: 'Hooks & Lifecycle', score: 18, maxScore: 20, percentage: 90, completedAt: '2026-02-28' },
  { id: 'qr10', studentId: 'student-4', studentName: 'Kofi Asante', quizId: 'q1', quizTitle: 'JavaScript Fundamentals', topic: 'Closures & Scope', score: 12, maxScore: 20, percentage: 60, completedAt: '2026-02-14' },
]

export const QUIZ_IMPORT_PREVIEW: QuizImportRow[] = [
  { email: 'a.patel@lexicon.edu', quizName: 'Node.js Advanced', topic: 'Streams & Buffers', score: 17, date: '2026-05-02', status: 'valid' },
  { email: 't.werner@lexicon.edu', quizName: 'Node.js Advanced', topic: 'Streams & Buffers', score: 14, date: '2026-05-02', status: 'valid' },
  { email: 'm.chen@lexicon.edu', quizName: 'Node.js Advanced', topic: 'Streams & Buffers', score: 19, date: '2026-05-02', status: 'valid' },
  { email: 'k.asante@lexicon.edu', quizName: 'Node.js Advanced', topic: 'Streams & Buffers', score: 11, date: '2026-05-02', status: 'valid' },
  { email: 'unknown@example.com', quizName: 'Node.js Advanced', topic: 'Streams & Buffers', score: 15, date: '2026-05-02', status: 'missing_student', error: 'Email not found in any group' },
  { email: 'a.patel@lexicon.edu', quizName: 'Node.js Advanced', topic: 'Streams & Buffers', score: 17, date: '2026-05-02', status: 'duplicate', error: 'Result already imported for this student and quiz' },
  { email: 'l.hassan@lexicon.edu', quizName: 'Node.js Advanced', topic: 'Streams & Buffers', score: 105, date: '2026-05-02', status: 'invalid', error: 'Score 105 exceeds max score 20' },
]

export const PROGRESS_TREND = [
  { week: 'Wk 1', score: 58 },
  { week: 'Wk 2', score: 63 },
  { week: 'Wk 3', score: 67 },
  { week: 'Wk 4', score: 65 },
  { week: 'Wk 5', score: 71 },
  { week: 'Wk 6', score: 74 },
  { week: 'Wk 7', score: 78 },
  { week: 'Wk 8', score: 82 },
]

export const GROUP_PERFORMANCE = [
  { group: 'FSWD-A', attendance: 88, quizAvg: 76, projectAvg: 82 },
  { group: 'FSWD-B', attendance: 82, quizAvg: 71, projectAvg: 78 },
  { group: 'DE-A', attendance: 91, quizAvg: 79, projectAvg: 85 },
  { group: 'UXD-A', attendance: 85, quizAvg: 73, projectAvg: 80 },
]

export const RECENT_ACTIVITY = [
  { id: 1, action: 'GitHub submission received', detail: 'Team Gamma — Full Stack Learning Platform', time: '22 min ago', type: 'submission' },
  { id: 2, action: 'AI evaluation ready for review', detail: 'Team Alpha — Full Stack Learning Platform', time: '1 hr ago', type: 'ai' },
  { id: 3, action: 'Evaluation approved', detail: 'Team Beta — Full Stack Learning Platform', time: '4 hr ago', type: 'approved' },
  { id: 4, action: 'Quiz results imported', detail: '32 results — Node.js Advanced', time: '1 day ago', type: 'quiz' },
  { id: 5, action: 'New student enrolled', detail: 'Yuki Tanaka added to FSWD-2026-A', time: '2 days ago', type: 'student' },
]
