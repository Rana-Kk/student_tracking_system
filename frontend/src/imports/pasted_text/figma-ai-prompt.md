# Figma AI Prompt — Lexicon Learning Analytics & AI Feedback Platform

Copy everything below this line into Figma AI (or Figma Make).

---

## Project Context

Design and build the frontend for the **Lexicon Learning Analytics & AI
Feedback Platform**, a web application used by a training organization to
track student learning progress and generate AI-assisted feedback.

The platform follows this workflow:
**Collect → Assess → Analyze → Understand → Recommend → Report**

Teachers record attendance and assessment data. The system turns this into
dashboards and analytics. An AI Feedback Engine analyzes the data and
produces a **draft** performance report. A Teacher must review, edit, and
approve that draft before it becomes visible to the Student. This
human-in-the-loop approval step is a core product principle and must be
visually obvious everywhere AI content appears (clear "Draft" vs "Approved"
states, never silently shown to Students).

## Target Users & Roles

The product has three roles with strictly separated access:

1. **Admin** — manages teachers, courses, groups, and students; views
   aggregate/organization-wide analytics.
2. **Teacher** — manages only their assigned groups: attendance,
   assessments/quizzes, rubric scoring, AI feedback generation and
   approval, group analytics, PDF reports, certificates.
3. **Student** — read-only view of their own data: dashboard, attendance,
   results, competency matrix, approved feedback, certificates.

Design a distinct, role-appropriate navigation/dashboard shell for each
role. A user only ever sees their own role's shell after login.

## Screens to Design

### 1. Login
- Email + password fields, "Forgot password?" link, primary "Log in" button.
- Clean, minimal, single-column, centered card layout.

### 2. Admin Dashboard
- Top navigation: Teachers | Courses | Groups | Students | Analytics.
- Summary cards: total students, total teachers, active groups, average
  attendance %.
- Group performance chart (bar or line).
- Recent activity list.
- CRUD screens/modals for: creating a course, creating a group under a
  course, assigning teachers to a group, adding/importing students.

### 3. Teacher — Attendance
- Group selector, date picker, session toggle: **Morning (09:00–12:00)** /
  **Afternoon (13:00–16:00)**.
- Student roster list with a status control per student: Present / Late /
  Absent / Excused.
- Save action; show a confirmation once saved.
- A read-only summary of attendance % for the selected group.

### 4. Teacher — Assessments & Rubrics
- Create/edit an assessment: title, description, type (Project /
  Assignment / Presentation / Practical / Final Project), date, max score.
- Rubric criteria table (criterion name, max score) that a teacher can
  configure per assessment.
- Per-student scoring view: enter a score per criterion, auto-calculated
  total score and percentage.
- Separate, simpler flow for quizzes: title, topic, max score, per-student
  result entry.

### 5. Teacher — AI Feedback Review
- Select a student (and optionally a specific assessment), trigger
  "Generate AI Feedback."
- Show the generated draft in four clearly labeled, editable sections:
  **Strengths / Areas for Improvement / Recommendations / Suggested Next
  Steps.**
- Prominent status badge: **Draft** (default) vs **Approved** vs
  **Rejected**.
- Actions: edit text inline, **Approve & Publish**, **Reject**.
- Make it visually explicit that Draft feedback is never visible to the
  Student.

### 6. Teacher — Group Analytics
- Group-level summary: average attendance, average quiz score, average
  project score, average progress.
- Student comparison table/chart, skill/competency distribution chart.

### 7. Teacher — PDF Report Generation
- Student selector, a preview panel showing what will be included
  (attendance, scores, competency matrix, certificates, approved
  feedback), and a "Generate & Download PDF" action.

### 8. Student Dashboard
- Top navigation: Dashboard | Attendance | Results | Competency |
  Feedback | Certificates.
- Summary cards: overall progress %, attendance %, average score.
- Performance-over-time trend chart (e.g., Week 1 → 62%, Week 8 → 82%).
- Competency matrix as a radar chart and/or progress bars across skill
  areas (e.g., C#, SQL, React, Git).
- List of approved feedback items only, shown chronologically.
- Certificates list (name, issuing organization, date).

## Data Model Reference (for realistic field names/content)

Use these entities and fields as the source of truth for form fields,
table columns, and chart data — do not invent unrelated fields:

- **User**: name, email, role (Admin/Teacher/Student)
- **Course**: name, description, start date, end date
- **Group**: name, linked course, assigned teacher(s), enrolled students
- **Attendance**: date, session (Morning/Afternoon), status
  (Present/Late/Absent/Excused), recorded by
- **Assessment**: title, description, type, date, max score;
  **Rubric Criterion**: name, max score; **Score**: per student, per
  criterion, total, percentage
- **Quiz**: title, topic, date, max score; **Quiz Result**: per student score
- **Competency**: skill area name, student's level (%)
- **AI Feedback**: strengths, areas for improvement, recommendations,
  suggested next steps, status (Draft/Approved/Rejected), reviewed by
- **Teacher Feedback**: free-text comment, optionally linked to an
  assessment
- **Certificate**: name, issuing organization, issue date, expiry date

## Design Guidelines

- Style: clean, professional, education/analytics product — think a
  modern SaaS dashboard, not a playful consumer app.
- Layout: persistent left or top navigation per role, content area with
  cards, tables, and charts.
- Charts: bar charts, line/trend charts, and a radar chart for
  competencies. Keep them simple and readable, not decorative.
- Color: use a calm primary color (blue or teal) for navigation/actions,
  with clear semantic colors for attendance/status states (e.g., green =
  Present/Approved, amber = Late/Draft, red = Absent/Rejected, gray =
  Excused/neutral).
- Typography: one clean sans-serif font family, clear hierarchy between
  page titles, card labels, and data values.
- Empty/loading/error states should be designed for at least the
  Dashboard and Attendance screens.
- Accessibility: sufficient color contrast, readable font sizes, and
  keyboard-navigable focus states — this is a stated requirement, not
  optional polish.

## Technical Requirements

- Frontend stack: **React + TypeScript**.
- Fully responsive: usable on desktop and tablet screen widths at minimum.
- Component-based structure: build reusable components (e.g., StatCard,
  StatusBadge, DataTable, AttendanceStatusSelect, ScoreInput,
  FeedbackStatusBanner) rather than one-off screens.
- Role-based routing/navigation: the same login flow branches into three
  different navigation shells based on the authenticated user's role.
- Do not hard-code sample data into components — structure components to
  receive this data as props/state so they can later be wired to a real
  API.

## Deliverables Expected

1. A complete design (all 8 screens above) with a consistent design
   system (colors, typography, spacing, reusable components).
2. Working React + TypeScript frontend code generated from that design,
   organized by role (Admin / Teacher / Student) and ready to be
   connected to a backend REST API later.
