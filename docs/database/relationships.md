# Database Relationship Overview

Detailed keys and cardinalities are shown in `er-diagram.puml`. This
file summarises relationships by data domain; see
`database-relationships.puml` for the grouped diagram.

## Identity & Membership

| Relationship | Cardinality | Notes |
|---|---|---|
| courses → groups | 1 : N | A course can contain multiple groups |
| groups ↔ users (teacher) | N : N via `group_teachers` | A teacher can be assigned to multiple groups; a group can have multiple teachers |
| groups ↔ users (student) | N : N via `group_students` | A student may belong to multiple groups. |

## Learning Evidence

| Relationship | Cardinality | Notes |
|---|---|---|
| groups → attendance | 1 : N | Attendance records belong to a group and a student |
| users (student) → attendance | 1 : N | |
| users (recordedBy) → attendance | 0..1 : N | Optional; identifies which Teacher recorded the entry |
| groups → assessments | 1 : N | |
| assessments → assessment_criteria | 1 : N | Rubric template: criteria and their max scores, defined once per assessment |
| assessments → assessment_scores | 1 : N | One score record per student per assessment |
| assessment_scores → criterion_scores | 1 : N | Per-criterion breakdown of a student's assessment score |
| assessment_criteria → criterion_scores | 1 : N | Links a criterion definition to each student's score for it |
| groups → quizzes | 1 : N | |
| quizzes → quiz_results | 1 : N | One result per student per quiz |

## Analytics & Feedback

| Relationship | Cardinality | Notes |
|---|---|---|
| users (student) ↔ competencies | N : N via `student_competencies` | Stores the student's current level per competency area |
| users (student, teacher) → teacher_feedback | 1 : N each | Feedback authored directly by a teacher |
| assessments → teacher_feedback | 0..1 : N | Optional link to a specific assessment |
| users (student, generator, reviewer) → ai_feedback | 1 : N each | AI-generated draft feedback; `reviewed_by` is set only after Teacher approval |
| assessments → ai_feedback | 0..1 : N | Optional link for assessment-specific AI feedback |
| users (student) → certificates | 1 : N | |

## Domain Rules

1. A student can only have one attendance record per (`student_id`, `attendance_date`, `session`) — enforced by a unique key (FR-3.3).
2. A student can only have one score per assessment (`assessment_id`, `student_id`) and one result per quiz (`quiz_id`, `student_id`) — enforced by unique keys.
3. `ai_feedback.status` starts as `draft` and only becomes `approved` (or `rejected`) once a Teacher reviews it — students are only shown `approved` records (FR-6.5, FR-6.6).
4. `student_competencies.score` stores the current competency level for the student and competency area. The value may be updated based on relevant assessment, quiz and rubric data; the exact calculation approach is an implementation detail to be finalized during development.
5. Deleting a course cascades to its groups; deleting a group cascades to its memberships, attendance, assessments and quizzes, so historical learner data stays consistent with its owning group.
