# Database Schema

Database: **MySQL 8**. Full DDL is in `schema.sql`; the visual model is
in `er-diagram.puml` and `database-relationships.puml`.

## Tables

| Table | Purpose | Key constraints |
|---|---|---|
| `users` | Admins, Teachers and Students (single table, `role` column) | `email` unique |
| `courses` | Top-level course definitions | |
| `groups` | Groups under a course | FK → `courses.id`, cascade delete |
| `group_teachers` | Teacher ↔ group assignment | Composite PK, FKs → `groups.id`, `users.id` |
| `group_students` | Student ↔ group membership | Composite PK, FKs → `groups.id`, `users.id` |
| `attendance` | Morning/Afternoon attendance per student | Unique (`student_id`, `attendance_date`, `session`) — FR-3.3 |
| `assessments` | Projects, assignments, presentations, practical exercises, final projects | FK → `groups.id`, `users.id` (creator) |
| `assessment_criteria` | Rubric criteria template for an assessment | FK → `assessments.id`, cascade delete |
| `assessment_scores` | A student's total score for an assessment | Unique (`assessment_id`, `student_id`) |
| `criterion_scores` | A student's score per rubric criterion | Unique (`assessment_score_id`, `criterion_id`) |
| `quizzes` | Quiz definitions, tracked separately from other assessments | FK → `groups.id` |
| `quiz_results` | A student's score for a quiz | Unique (`quiz_id`, `student_id`) |
| `competencies` | Technical competency areas (e.g. C#, SQL, React) | `name` unique |
| `student_competencies` | A student's current level per competency | Unique (`student_id`, `competency_id`) |
| `teacher_feedback` | Free-text feedback authored directly by a Teacher | FK → `users.id` (student, teacher), optional FK → `assessments.id` |
| `ai_feedback` | AI-generated draft feedback and its review status | `status` ENUM(`draft`,`approved`,`rejected`); FK → `users.id` (student, generated_by, reviewed_by), optional FK → `assessments.id` |
| `certificates` | Certificates attached to a Student profile | FK → `users.id` |

## Notes

- Indexes: `ix_attendance_group_date` (`group_id`, `attendance_date`),
  `ix_assessment_scores_student` (`student_id`),
  `ix_quiz_results_student` (`student_id`), and
  `ix_ai_feedback_student_status` (`student_id`, `status`) support the
  most common dashboard and report queries.
- All primary keys are `BIGINT UNSIGNED AUTO_INCREMENT`, matching the
  domain class diagram (`Long` in `class-diagram.puml`).
- `assessment_criteria` stores the rubric **template** (criterion name
  and max score); `criterion_scores` stores each student's actual
  score per criterion. This keeps rubric definitions reusable and
  avoids duplicating the template per student.
- Cascading deletes follow the ownership chain: deleting a `course`
  removes its `groups`; deleting a `group` removes its memberships,
  attendance, assessments and quizzes.
- Dashboard percentages and analytics (attendance %, average scores)
  are **calculated from these source records** at query/report time
  rather than stored as duplicated totals. `student_competencies.score`
  is stored directly and may be updated based on relevant assessment,
  quiz and rubric data; the exact update mechanism is an
  implementation detail to be finalized during development.
