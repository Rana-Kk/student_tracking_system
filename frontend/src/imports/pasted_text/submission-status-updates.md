Please make the following corrections and additions to the existing design. 
Do NOT redesign the whole application. Keep the current visual design system, layout, colors, typography and existing workflows. Only make the changes described below.

---

## 1. STUDENT — Submission Status

On the Student assignment/submission page, simplify the Submission Status workflow.

CURRENT:
Submitted → Analyzing → Teacher Review → Approved

CHANGE TO:
Submitted → Teacher Review → Approved

REMOVE the "Analyzing" step completely from the Student UI.

The Student must NOT know that AI is analyzing or evaluating their repository.

The Student-facing status flow must be:

1. Submitted
2. Teacher Review
3. Approved

Example:

Submission Status

✓ Submitted
────────────
2 Teacher Review
────────────
3 Approved

Do NOT show:
- Analyzing
- AI Analyzing
- AI Evaluation
- AI Review
- AI Draft
- AI Processing
- AI Recommended Score

The internal AI analysis process should remain completely hidden from Students.

When the submission has been submitted but not yet approved, show a simple message such as:

"Your submission is currently being reviewed by your teacher."

Do not mention AI.

When the Teacher approves the evaluation, show:

"Your result is now available."

Then display the final approved score and Teacher-approved feedback.

The Student should only see the final approved result, never the AI-recommended score or AI rationale.

---

## 2. TEACHER — AI Evaluation Review

IMPORTANT:
The Teacher MUST be able to edit the AI-generated evaluation.

The existing AI Evaluation Review page should include clear editing controls.

For each evaluation criterion, show:

Criterion | Max Score | AI Recommended | Teacher Final | AI Rationale

Example:

Code Quality
Max: 10
AI Recommended: 8/10
Teacher Final: [ 8/10 ]   ← editable
AI Rationale: ...

Database Design
Max: 10
AI Recommended: 7/10
Teacher Final: [ 9/10 ]   ← editable
AI Rationale: ...

The Teacher must be able to:

- Edit the final score
- Override the AI recommended score
- Edit Teacher comments/feedback
- Accept the AI recommendation
- Save changes
- Approve the final evaluation
- Reject the evaluation if necessary

Make the Teacher Final score clearly editable.

The AI Recommended Score must remain read-only.

The AI Rationale should also remain clearly identified as AI-generated.

Use clear actions:

[Accept AI Score]
[Edit / Override]
[Save Changes]
[Approve Evaluation]
[Reject]

Do NOT remove the editing/override functionality from the Teacher AI Evaluation screen.

The final score shown to Students must always be the Teacher-approved final score, not the AI recommendation.

---

## 3. TEACHER — CREATE NEW GROUP / CLASS

Add the ability for a Teacher to create a new Group/Class.

The Teacher should have a clear action such as:

[ + Create Group ]

or

[ + New Class ]

on the Teacher Groups page.

Create a form containing:

- Group/Class Name
- Course
- Start Date
- End Date

The Teacher should be able to save the new Group/Class.

After creation, the Teacher should be taken to the Group/Class detail page.

---

## 4. TEACHER — ADD STUDENTS TO A GROUP

Inside the Group/Class detail page, allow the Teacher to add Students by email address.

Add an action:

[ + Add Student ]

Open a modal/form:

Add Student

Student Email:
[ student@example.com ]

[ Add Student ]

The system should use the email address to identify the Student.

Show useful validation states:

- Student found → allow adding
- Student not found → show a clear error
- Student already in this group → show a clear warning
- Invalid email → show validation error

After successfully adding the Student, update the group student list immediately.

Example:

JavaScript Group A

Students:

- student1@example.com
- student2@example.com
- student3@example.com

[ + Add Student ]

---

## 5. TEACHER — GROUP DETAIL PAGE

The Group/Class detail page should clearly contain:

Group Name
Course
Teacher(s)
Students
Teams
Assessments
Attendance
Group Analytics

The Students section should show:

Student Name
Email
Team (if applicable)
Status

Provide:

[ + Add Student ]

The Teacher should be able to manage the Students belonging to the Group.

---

## 6. IMPORTANT ACCESS RULE

Teachers should only be able to manage Groups and Students within their authorised scope.

Do not add an unrestricted platform-wide student management interface to the Teacher role.

The Teacher should manage:

- Their Groups
- Students in their Groups
- Teams within their Groups
- Assessments assigned to their Groups

---

## 7. KEEP THE EXISTING WORKFLOW

Do NOT change the core assessment workflow:

Teacher:
Create Assessment
↓
Select Group/Class
↓
Choose Individual or Team
↓
Define Evaluation Criteria
↓
Publish

Individual:
Student → GitHub Repository → AI Evaluation → Teacher Review → Final Result

Team:
Team → GitHub Repository → AI Evaluation → Teacher Review → Final Result

The AI evaluation remains internal.

Students only see:

Submitted → Teacher Review → Approved

Teachers see the complete internal workflow, including AI evaluation and editing/override controls.

---

## FINAL IMPORTANT CHECK

After making these changes, verify that:

Student:
✓ Submitted
✓ Teacher Review
✓ Approved
✗ No "Analyzing"
✗ No AI-related status

Teacher:
✓ Can see AI Evaluation
✓ Can edit/override AI recommended scores
✓ Can edit feedback
✓ Can approve/reject evaluation
✓ Can create a Group/Class
✓ Can add Students to a Group by email
✓ Can manage Students inside their Groups