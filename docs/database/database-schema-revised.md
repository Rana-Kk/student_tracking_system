# Revised Database Schema

Database: **MySQL 8**.

The revised model preserves the existing core entities and adds the data structures required for:
- Group-based assessments with Individual/Team submission mode
- Team membership
- GitHub repository submissions
- AI rubric-based evaluation and Teacher approval
- External quiz-result Excel imports

## Key additions

- `teams` and `team_members`: support team-based assignments while preserving Group membership.
- `assessments.submission_mode`: `individual` or `team`.
- `assessment_submissions`: stores the GitHub repository URL and associates a submission with either a Student or a Team.
- `ai_evaluations`: stores the AI evaluation draft and its Teacher review/approval status.
- `criterion_scores.ai_recommended_score` and `criterion_scores.ai_rationale`: preserve criterion-level AI recommendations separately from final/teacher-controlled scores.
- `quiz_imports`: records external Excel import operations and their review/confirmation status.
- `quizzes.source`: distinguishes imported quiz data from manually managed quiz definitions.

## Important integrity rules

1. Every assessment belongs to a Group.
2. Every assessment uses either Individual or Team submission mode.
3. An `assessment_submissions` row belongs to exactly one Student or one Team.
4. A submission stores a GitHub repository URL rather than an uploaded assignment file.
5. AI evaluation is linked to the submission, not directly to the assessment alone.
6. AI-recommended criterion scores are not the final score; the Teacher can review and override them.
7. Quiz results are imported from an external source and stored in `quiz_results`.
8. Dashboard percentages and aggregate analytics are calculated from source records rather than duplicated totals.

## Existing formal diagrams

The existing formal architecture/UML diagrams can remain unchanged as planning artifacts. This ERD reflects the revised implementation/database model.
