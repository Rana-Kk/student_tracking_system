--------------------ER DIAGRAM---------------------

@startuml er-diagram
title Lexicon Platform - Entity Relationship Diagram

skinparam backgroundColor transparent
left to right direction
hide circle
skinparam linetype ortho

entity users {
  * id : BIGINT <<PK>>
  --
  name : VARCHAR
  email : VARCHAR <<UQ>>
  password_hash : VARCHAR
  role : ENUM
  is_active : BOOLEAN
  created_at : TIMESTAMP
  updated_at : TIMESTAMP
}
entity courses {
  * id : BIGINT <<PK>>
  --
  name : VARCHAR
  description : TEXT
  start_date : DATE
  end_date : DATE
}
entity groups {
  * id : BIGINT <<PK>>
  --
  course_id : BIGINT <<FK>>
  name : VARCHAR
  start_date : DATE
  end_date : DATE
}
entity group_teachers {
  * group_id : BIGINT <<PK,FK>>
  * teacher_id : BIGINT <<PK,FK>>
}
entity group_students {
  * group_id : BIGINT <<PK,FK>>
  * student_id : BIGINT <<PK,FK>>
}
entity attendance {
  * id : BIGINT <<PK>>
  --
  student_id : BIGINT <<FK>>
  group_id : BIGINT <<FK>>
  attendance_date : DATE
  session : ENUM
  status : ENUM
  recorded_by : BIGINT <<FK>>
}
entity assessments {
  * id : BIGINT <<PK>>
  --
  group_id : BIGINT <<FK>>
  created_by : BIGINT <<FK>>
  type : ENUM
  max_score : DECIMAL
}
entity assessment_criteria {
  * id : BIGINT <<PK>>
  --
  assessment_id : BIGINT <<FK>>
  max_score : DECIMAL
}
entity assessment_scores {
  * id : BIGINT <<PK>>
  --
  assessment_id : BIGINT <<FK>>
  student_id : BIGINT <<FK>>
  score : DECIMAL
}
entity criterion_scores {
  * id : BIGINT <<PK>>
  --
  assessment_score_id : BIGINT <<FK>>
  criterion_id : BIGINT <<FK>>
  score : DECIMAL
}
entity quizzes {
  * id : BIGINT <<PK>>
  --
  group_id : BIGINT <<FK>>
  created_by : BIGINT <<FK>>
  topic : VARCHAR
}
entity quiz_results {
  * id : BIGINT <<PK>>
  --
  quiz_id : BIGINT <<FK>>
  student_id : BIGINT <<FK>>
  score : DECIMAL
}
entity competencies {
  * id : BIGINT <<PK>>
  --
  name : VARCHAR
}
entity student_competencies {
  * id : BIGINT <<PK>>
  --
  student_id : BIGINT <<FK>>
  competency_id : BIGINT <<FK>>
  score : DECIMAL
}
entity teacher_feedback {
  * id : BIGINT <<PK>>
  --
  student_id : BIGINT <<FK>>
  teacher_id : BIGINT <<FK>>
  assessment_id : BIGINT <<FK>>
}
entity ai_feedback {
  * id : BIGINT <<PK>>
  --
  student_id : BIGINT <<FK>>
  assessment_id : BIGINT <<FK>>
  generated_by : BIGINT <<FK>>
  reviewed_by : BIGINT <<FK>>
  status : ENUM
}
entity certificates {
  * id : BIGINT <<PK>>
  --
  student_id : BIGINT <<FK>>
  name : VARCHAR
}

courses ||--o{ groups
groups ||--o{ group_teachers
users ||--o{ group_teachers : teacher
groups ||--o{ group_students
users ||--o{ group_students : student
groups ||--o{ attendance
users ||--o{ attendance : student
users |o--o{ attendance : recordedBy
groups ||--o{ assessments
users ||--o{ assessments : creator
assessments ||--o{ assessment_criteria
assessments ||--o{ assessment_scores
users ||--o{ assessment_scores : student
assessment_scores ||--o{ criterion_scores
assessment_criteria ||--o{ criterion_scores
groups ||--o{ quizzes
quizzes ||--o{ quiz_results
users ||--o{ quiz_results : student
users ||--o{ student_competencies : student
competencies ||--o{ student_competencies
users ||--o{ teacher_feedback : student/teacher
assessments |o--o{ teacher_feedback
users ||--o{ ai_feedback : student/creator/reviewer
assessments |o--o{ ai_feedback
users ||--o{ certificates

@enduml




----------------DATABASE RELATIONSHIPS--------------------------
@startuml database-relationships
title Lexicon Platform - Database Relationship Overview

left to right direction
skinparam componentStyle rectangle
skinparam backgroundColor transparent

package "Identity & Membership" {
  [users] as users
  [courses] as courses
  [groups] as groups
  [group_teachers] as gt
  [group_students] as gs
}
package "Learning Evidence" {
  [attendance] as attendance
  [assessments] as assessments
  [assessment_criteria] as criteria
  [assessment_scores] as scores
  [criterion_scores] as cscores
  [quizzes] as quizzes
  [quiz_results] as qresults
}
package "Analytics & Feedback" {
  [competencies] as competencies
  [student_competencies] as scomp
  [teacher_feedback] as tf
  [ai_feedback] as aif
  [certificates] as cert
}

courses --> groups : 1 : many
groups --> gt : 1 : many
users --> gt : teacher membership
groups --> gs : 1 : many
users --> gs : student membership
groups --> attendance
users --> attendance : student
users --> attendance : recordedBy
groups --> assessments
assessments --> criteria
assessments --> scores
users --> scores : student
scores --> cscores
criteria --> cscores
groups --> quizzes
quizzes --> qresults
users --> qresults : student
users --> scomp : student
competencies --> scomp
users --> tf : student / teacher
assessments --> tf : optional link
users --> aif : student / generator / reviewer
assessments --> aif : optional link
users --> cert : student

@enduml
