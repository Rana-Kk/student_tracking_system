# Figma AI Prompt — Lexicon Learning Analytics & AI Feedback Platform

Design and build the frontend for the Lexicon Learning Analytics & AI Feedback Platform.

This is a professional web-based learning analytics platform used by a training organization to manage courses, groups, students, attendance, assessments, GitHub-based assignment submissions, AI-assisted assessment evaluation, quiz results, competencies, feedback and reports.

IMPORTANT:
The existing formal architecture and UML diagrams are planning artifacts. The UI should focus on the actual product workflow described below.

---

## 1. Project Context

The platform follows this overall workflow:

Collect → Assess → Analyze → Understand → Recommend → Report

Teachers manage groups, attendance, assessments and evaluation criteria.

Assessments are always assigned to a GROUP.

An assessment can have one of two submission modes:

1. INDIVIDUAL
   - Every student in the assigned group completes the assignment individually.
   - Each student submits their own GitHub repository URL.

2. TEAM
   - Students in the assigned group are organized into teams.
   - Each team works together.
   - Each team submits one GitHub repository URL.

Students do NOT upload assignment files directly to the platform.

Instead, the platform stores the GitHub repository URL and uses it as the source for AI-assisted evaluation.

The Teacher defines evaluation criteria/rubric when creating the assignment.

The AI analyzes the submitted GitHub repository against those teacher-defined criteria and generates:

- Criterion-level recommended scores
- Rationale for each recommended score
- Strengths
- Areas for improvement
- Recommendations
- Suggested next steps

The AI output is NEVER automatically treated as the final result.

The Teacher must review the AI evaluation, edit or override scores/comments if necessary, and approve the evaluation before the Student can see the final result.

Make this human-in-the-loop workflow visually obvious throughout the product.

Use clear states:

- Submitted
- Analyzing
- AI Reviewed / Draft
- Teacher Review
- Approved
- Rejected

Never show an AI draft to Students as if it were a final result.

---

# 2. Target Users & Roles

The platform has three roles with strictly separated access.

### Admin

Admin manages:

- Teachers
- Courses
- Groups
- Students
- Group assignments
- Teams
- Aggregate course/group analytics

Admin should not see private Student information outside the authorised access boundary.

### Teacher

Teacher manages assigned groups only.

Teacher can:

- View assigned groups and students
- Record attendance
- Create assessments
- Assign assessments to groups
- Choose Individual or Team submission mode
- Define evaluation criteria/rubrics
- View submitted GitHub repositories
- Trigger/view AI evaluations
- Review and edit AI recommendations
- Approve or reject AI evaluations
- View assessment results
- View quiz results
- Import external quiz results from Excel
- View group analytics
- Generate PDF reports
- Manage certificates

### Student

Student can:

- View their own dashboard
- View attendance
- View assigned assessments
- Submit GitHub repository URLs
- View submission status
- View approved assessment results
- View approved feedback
- View quiz results
- View competency matrix
- View certificates

Students must never see another student's private information.

Students must never see unapproved AI evaluations.

---

# 3. Navigation

Create different navigation shells for each role.

## Admin navigation

Dashboard
Teachers
Courses
Groups
Students
Teams
Analytics

## Teacher navigation

Dashboard
Groups
Attendance
Assessments
Quiz Results
Analytics
AI Evaluations
Reports
Certificates

## Student navigation

Dashboard
My Assignments
My Submissions
Quiz Results
Attendance
Competency
Feedback
Certificates

Use a persistent sidebar on desktop and an appropriate responsive navigation on smaller screens.

---

# 4. Authentication

## Login

Create a clean professional login screen.

Fields:

- Email
- Password

Actions:

- Log in
- Forgot password?

Show validation and error states.

After login, route the user to the correct role-specific dashboard.

---

# 5. Admin Dashboard

Create an analytics-oriented dashboard.

Top navigation/sidebar:

Teachers
Courses
Groups
Students
Teams
Analytics

Summary cards:

- Total Students
- Total Teachers
- Active Courses
- Active Groups
- Average Attendance %

Charts:

- Group performance
- Attendance overview
- Assessment performance
- Quiz performance

Recent activity:

- New student
- New group
- Assessment created
- Team created
- Quiz results imported

Admin management screens should support:

- Create/edit course
- Create/edit group
- Assign teachers to group
- Add/import students
- Create/manage teams
- View aggregate analytics

---

# 6. Teacher Dashboard

Create a Teacher-specific dashboard focused on assigned groups.

Summary cards:

- My Groups
- Students
- Pending Submissions
- Assessments to Review
- Average Group Attendance
- Average Assessment Score
- Average Quiz Score

Include:

- Recent assignment submissions
- AI evaluations waiting for review
- Upcoming assessment deadlines
- Attendance alerts
- Quiz performance overview

The Teacher should immediately see which GitHub submissions require AI evaluation or Teacher review.

---

# 7. Teacher — Groups & Teams

Create a Group detail page.

Show:

- Group name
- Course
- Teacher(s)
- Students
- Teams
- Group performance

Team management:

- Create Team
- Rename Team
- Add/remove students
- View team members

Example:

Group A

Team 1
- Student A
- Student B
- Student C

Team 2
- Student D
- Student E

Teams are optional depending on the assignment mode.

---

# 8. Teacher — Attendance

Create an attendance management screen.

Controls:

- Group selector
- Date picker
- Session toggle

Sessions:

Morning (09:00–12:00)
Afternoon (13:00–16:00)

Student roster with:

- Present
- Late
- Absent
- Excused

Show:

- Save attendance
- Confirmation message
- Attendance percentage
- Absence count
- Late count

Also provide a read-only attendance summary/chart for the selected group.

---

# 9. Teacher — Create Assessment

This is one of the most important screens.

Create an assessment form with:

- Assessment title
- Description
- Assessment type
- Group
- Assessment date
- Due date
- Maximum score

Assessment types:

- Project
- Assignment
- Presentation
- Practical
- Final Project
- Other

IMPORTANT:

Every assessment is assigned to a GROUP.

Add a prominent:

### Submission Mode

Two options:

○ Individual

○ Team

Explain the difference:

Individual:
Every student in the selected group submits their own GitHub repository.

Team:
Teams in the selected group submit one GitHub repository per team.

---

# 10. Teacher — Assessment Evaluation Criteria

When creating an assessment, the Teacher defines the rubric.

Create a clean editable criteria table:

| Criterion | Description | Max Score |
|-----------|-------------|-----------|
| Code Quality | Code organization and readability | 10 |
| Database Design | Database structure and relationships | 10 |
| Backend | API/backend implementation | 20 |
| Frontend | UI and frontend implementation | 20 |
| Testing | Tests and reliability | 10 |
| Documentation | README and documentation | 10 |

Allow:

- Add criterion
- Edit criterion
- Delete criterion
- Reorder criterion
- Change max score

Show:

Total possible score: 80

The rubric is the main evaluation criteria used by the AI.

---

# 11. Teacher — Assessment Submissions

Create an Assessment Submissions page.

Example:

Assessment:
"Full Stack Learning Platform"

Group:
Group A

Submission Mode:
Individual

Table:

Student | GitHub Repository | Submitted | Status | AI Evaluation | Teacher Review

Example statuses:

Submitted
Analyzing
AI Draft Ready
Teacher Review
Approved
Rejected

For Team mode, show:

Team | Members | GitHub Repository | Submitted | Status | AI Evaluation | Review

Each GitHub repository should be displayed as a clickable repository card/link.

Example:

GitHub Repository
github.com/student/project-name

Show:

- Repository URL
- Submission date
- Last analysis date
- Analysis status

---

# 12. Student — Submit GitHub Repository

Create a dedicated assignment submission page.

Show:

Assignment information:

- Assignment title
- Description
- Group
- Due date
- Submission mode
- Evaluation criteria

For Individual assignments:

Show:

GitHub Repository URL

[ https://github.com/username/project ]

Button:

Submit Repository

For Team assignments:

Show the current team and team members.

The team submits one repository URL.

After submission show:

✓ Repository submitted

Status:
Submitted / Analyzing / AI Review / Teacher Review / Approved

Do NOT provide file-upload UI for assignments.

The assignment submission mechanism is GitHub repository URL based.

---

# 13. GitHub Repository Analysis

Create a clear repository analysis state.

When AI analysis is running:

Show:

Repository:
github.com/team/project

Status:
Analyzing Repository...

Progress steps:

✓ Repository connected
✓ Repository structure inspected
✓ Source code analyzed
● Evaluation criteria being checked
○ AI recommendations generated

Do not imply that AI has made a final decision.

---

# 14. Teacher — AI Evaluation Review

This is a CORE screen.

Create a detailed AI evaluation review page.

Header:

Assignment:
Full Stack Learning Platform

Student:
Student Name

OR:

Team:
Team Alpha

GitHub Repository:
github.com/team/project

Status:

AI DRAFT — TEACHER REVIEW REQUIRED

---

## Criterion Evaluation

Create a table:

Criterion | Max | AI Recommended | Teacher Final | AI Rationale

Example:

Code Quality | 10 | 8 | [ 8 ] | "Code is well structured but..."
Database Design | 10 | 7 | [ 9 ] | "Relationships are mostly correct..."
Backend | 20 | 17 | [ 17 ] | "API structure is strong..."
Testing | 10 | 5 | [ 7 ] | "Limited automated tests..."

Important:

AI Recommended Score must be visually distinct from Teacher Final Score.

The Teacher can:

- Accept AI recommendation
- Edit score
- Override score
- Edit rationale/comment

---

# 15. AI Evaluation Feedback

Below the criterion scores show:

### Strengths

AI-generated strengths.

### Areas for Improvement

AI-generated weaknesses/improvement areas.

### Recommendations

AI-generated recommendations.

### Suggested Next Steps

AI-generated learning/action recommendations.

Every AI-generated section must have a visible:

AI Generated / Draft

label.

Actions:

[Approve Evaluation]

[Reject]

[Save Changes]

The Teacher must approve before Students can see the result.

---

# 16. Teacher — Final Assessment Result

After approval, show:

Assessment Result

Student / Team

Final Score:
82 / 100

Percentage:
82%

Criterion breakdown:

Code Quality
8 / 10

Database Design
9 / 10

Backend
17 / 20

Frontend
18 / 20

Testing
7 / 10

Documentation
10 / 10

Status:

✓ Approved by Teacher

Also show:

Teacher Feedback

and approved AI recommendations.

---

# 17. Student — My Assignments

Create a Student assignment list.

Columns/cards:

- Assignment
- Group
- Due Date
- Submission Mode
- Submission Status
- GitHub Repository
- Evaluation Status
- Final Result

Examples:

Not Submitted
Submitted
AI Analyzing
Teacher Review
Approved

Students should NOT see AI draft scores.

---

# 18. Student — Assignment Result

When approved:

Show:

Assignment title

Final Score:
82 / 100

Percentage:
82%

Criterion breakdown.

Show:

Teacher-approved feedback

Strengths
Areas for Improvement
Recommendations
Suggested Next Steps

If the evaluation is still a draft:

Show:

"Your submission is currently being reviewed by your Teacher."

Do NOT expose AI draft scores.

---

# 19. Teacher — Quiz Results Import

Quiz results come from an EXTERNAL QUIZ PLATFORM.

The Lexicon platform does not need to create the original quiz attempt data.

Create a dedicated:

### Quiz Results Import

workflow:

Step 1:
Upload Excel file

Step 2:
Map columns

Example:

Excel Column → Platform Field

Student Email → Student
Quiz Name → Quiz
Topic → Topic
Score → Score
Date → Completed At

Step 3:
Validate

Show:

- Valid rows
- Invalid rows
- Missing students
- Duplicate results
- Invalid scores

Step 4:
Preview

Step 5:
Confirm Import

After confirmation, import the results.

---

# 20. Teacher — Quiz Results Page

Create a dedicated Quiz Results page.

Filters:

- Group
- Student
- Quiz
- Topic
- Date range

Summary cards:

- Average Quiz Score
- Highest Score
- Lowest Score
- Quizzes Completed

Table:

Student | Quiz | Topic | Score | Percentage | Date

Charts:

- Quiz performance over time
- Topic performance
- Group average vs individual student
- Score distribution

Make percentages very visible.

Example:

84%

76%

91%

---

# 21. Student — Quiz Results

Create a Student-specific Quiz Results page.

Summary:

Average Quiz Score
84%

Quizzes Completed
12

Best Topic
C#

Needs Improvement
SQL

Table:

Quiz | Topic | Score | Percentage | Date

Chart:

Quiz Performance Over Time

Only show the logged-in student's data.

---

# 22. Student Dashboard

Top navigation:

Dashboard
My Assignments
Quiz Results
Attendance
Competency
Feedback
Certificates

Summary cards:

- Overall Progress %
- Attendance %
- Average Assessment Score
- Average Quiz Score
- Pending Assignments

Charts:

- Performance over time
- Assessment performance
- Quiz performance

Competency:

- C#
- SQL
- React
- Git
- Other configured competencies

Use progress bars and/or radar chart.

Show only:

Teacher-approved feedback

Never show AI draft feedback.

---

# 23. Competency Matrix

Create a detailed competency page.

Columns:

Competency
Current Level
Progress
Trend

Example:

C#
82%
↑ Improving

SQL
71%
→ Stable

React
88%
↑ Improving

Git
76%
↑ Improving

Use readable progress bars.

---

# 24. Teacher — Group Analytics

Show:

- Average attendance
- Average assessment score
- Average quiz score
- Average competency level
- Progress over time

Allow filtering by:

- Group
- Assessment
- Quiz
- Topic
- Date range

Student comparison table:

Student | Attendance | Assessment Avg | Quiz Avg | Competency | Progress

Keep analytics clear and professional.

---

# 25. Teacher — PDF Report

Create:

Student selector

Report preview containing:

- Student information
- Course information
- Attendance
- Assessment results
- Quiz results
- Competency matrix
- Approved Teacher feedback
- Approved AI-assisted recommendations
- Certificates
- Final evaluation

Button:

Generate & Download PDF

Do not include unapproved AI drafts in the report.

---

# 26. Certificates

Teacher/Admin:

- Add certificate
- Edit certificate
- Student selector
- Certificate name
- Issuing organization
- Issue date
- Expiry date
- Certificate code
- File/link

Student:

View certificates only.

---

# 27. Data Model Reference

Use these entities and fields as the source of truth for realistic UI content.

Do not invent unrelated entities.

### User

- name
- email
- role
- active status

### Course

- name
- description
- start date
- end date

### Group

- name
- course
- assigned teachers
- enrolled students

### Team

- name
- group
- team members

### Attendance

- student
- group
- date
- session
- status
- note
- recorded by

### Assessment

- group
- title
- description
- type
- submission mode
- assessment date
- due date
- max score
- created by

### Assessment Criterion

- name
- description
- max score
- order

### Assessment Submission

- assessment
- student OR team
- GitHub repository URL
- submitted date
- status

### Assessment Score

- student
- assessment
- final score
- feedback

### Criterion Score

- criterion
- final score
- AI recommended score
- AI rationale
- Teacher override score

### AI Evaluation

- submission
- generated by
- reviewed by
- content
- status
- Teacher comment
- created date
- reviewed date

### Quiz

- group
- title
- topic
- date
- max score
- source

### Quiz Import

- quiz
- file name
- imported by
- import status
- created date

### Quiz Result

- student
- quiz
- score
- completed date

### Competency

- name
- description

### Student Competency

- student
- competency
- score
- updated date

### Teacher Feedback

- student
- teacher
- optional assessment
- content
- created date

### Certificate

- student
- name
- issuing organization
- issue date
- expiry date
- certificate code
- file URL

---

# 28. Important UX Rules

1. AI content must always have a visible AI/Draft label until approved.

2. AI Recommended Score and Teacher Final Score must never look like the same value.

3. Teacher override actions must be obvious.

4. Students must never see unapproved AI evaluations.

5. GitHub repository submission must be represented as a URL/repository workflow, NOT as a file upload.

6. Assessment creation must clearly distinguish Individual vs Team submission mode.

7. Assessments are assigned to Groups, not individually selected student-by-student during assignment creation.

8. Quiz Results are imported from an external Excel source and should have a dedicated import/review/confirmation flow.

9. Quiz Results need their own dedicated page and analytics.

10. Use realistic loading, empty, success, validation and error states.

11. Long-running GitHub/AI analysis must show a clear progress state.

12. Use confirmation dialogs for destructive actions.

13. Make tables sortable and filterable where appropriate.

14. Do not create fake features that are not described above.

---

# 29. Design Guidelines

Style:

Clean, professional, modern SaaS education/analytics platform.

Avoid:
- overly playful education visuals
- cartoon illustrations
- excessive gradients
- unnecessary decorative elements

Use:

- Professional dashboard cards
- Data tables
- Progress bars
- Line charts
- Bar charts
- Radar chart for competencies
- Status badges
- Side navigation
- Clear form layouts
- Modal confirmations

AI-related UI should feel distinct but integrated into the normal Teacher workflow.

Use clear semantic status colors:

Green:
Approved / Present / Success

Amber:
Draft / Late / Waiting for Review

Blue:
AI Analysis / In Progress

Red:
Rejected / Absent / Error

Gray:
Neutral / Excused / Not Started

Typography:

Use one clean modern sans-serif font.

Maintain strong hierarchy:

Page title
Section title
Card title
Metric
Supporting text

---

# 30. Responsive Design

The application must work on:

- Desktop
- Laptop
- Tablet

Desktop:

Persistent sidebar + content area.

Tablet:

Collapsible sidebar.

Tables should become horizontally scrollable or transform into cards on smaller screens.

Do not sacrifice usability for visual density.

---

# 31. States to Design

Create realistic states for:

- Empty dashboard
- No assignments
- No GitHub submission
- GitHub URL validation error
- Repository analysis in progress
- AI evaluation ready
- Teacher review required
- Evaluation approved
- Evaluation rejected
- Excel upload
- Excel validation error
- Excel import preview
- Excel import success
- No quiz results
- Loading
- API error
- Permission denied
- No competency data

---

# 32. Technical Requirements

Frontend:

React + TypeScript

Use reusable components such as:

- Sidebar
- Topbar
- StatCard
- DataTable
- StatusBadge
- AttendanceStatusSelect
- AssessmentForm
- RubricCriteriaTable
- GitHubRepositoryCard
- SubmissionStatusBadge
- AIEvaluationPanel
- CriterionScoreRow
- TeacherOverrideInput
- QuizImportWizard
- QuizResultsTable
- CompetencyProgress
- FeedbackStatusBanner
- ConfirmDialog

Use role-based routing/navigation.

Do not hard-code data directly inside components.

Structure components so that data can later be connected to a REST API.

---

# 33. Deliverables

Generate a complete, consistent frontend design covering at minimum:

1. Login
2. Admin Dashboard
3. Teacher Dashboard
4. Teacher Attendance
5. Teacher Assessment Creation
6. Teacher Rubric Configuration
7. Teacher Assessment Submissions
8. Student GitHub Submission
9. Teacher AI Evaluation Review
10. Teacher Final Assessment Result
11. Teacher Quiz Results Import
12. Teacher Quiz Results
13. Student Dashboard
14. Student Assignments
15. Student Assignment Result
16. Student Quiz Results
17. Competency Matrix
18. Teacher Group Analytics
19. PDF Report
20. Certificates
21. Loading / Error / Empty states

Maintain one coherent design system across all screens.

The final frontend should feel like a real production-ready learning analytics SaaS product, not a collection of unrelated mockups.