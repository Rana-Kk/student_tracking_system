-- Lexicon Learning Analytics & AI Feedback Platform
-- Revised MySQL 8 schema
-- Clarifies Group-based assessments, Individual/Team submissions,
-- GitHub repository submission, AI rubric evaluation and external quiz import.

CREATE DATABASE IF NOT EXISTS lexicon_learning_analytics;
USE lexicon_learning_analytics;

CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','teacher','student') NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE courses (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE groups (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  course_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  created_by BIGINT UNSIGNED NULL,
  CONSTRAINT fk_groups_course
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  CONSTRAINT fk_groups_created_by
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE group_teachers (
  group_id BIGINT UNSIGNED NOT NULL,
  teacher_id BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (group_id, teacher_id),
  CONSTRAINT fk_group_teachers_group
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
  CONSTRAINT fk_group_teachers_teacher
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE group_students (
  group_id BIGINT UNSIGNED NOT NULL,
  student_id BIGINT UNSIGNED NOT NULL,
  joined_at DATE NOT NULL,
  PRIMARY KEY (group_id, student_id),
  CONSTRAINT fk_group_students_group
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
  CONSTRAINT fk_group_students_student
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE teams (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  group_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_team_name_per_group UNIQUE (group_id, name),
  CONSTRAINT fk_teams_group
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

CREATE TABLE team_members (
  team_id BIGINT UNSIGNED NOT NULL,
  student_id BIGINT UNSIGNED NOT NULL,
  joined_at DATE NOT NULL,
  PRIMARY KEY (team_id, student_id),
  CONSTRAINT fk_team_members_team
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  CONSTRAINT fk_team_members_student
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE attendance (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  group_id BIGINT UNSIGNED NOT NULL,
  attendance_date DATE NOT NULL,
  session ENUM('morning','afternoon') NOT NULL,
  status ENUM('present','late','absent','excused') NOT NULL,
  note TEXT NULL,
  recorded_by BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_attendance_student_date_session (student_id, attendance_date, session),
  CONSTRAINT fk_attendance_student
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_attendance_group
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
  CONSTRAINT fk_attendance_recorded_by
    FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE assessments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  group_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NULL,
  type ENUM('project','assignment','presentation','practical','final_project','other') NOT NULL,
  submission_mode ENUM('individual','team') NOT NULL DEFAULT 'individual',
  assessment_date DATE NULL,
  due_date DATE NULL,
  max_score DECIMAL(6,2) NOT NULL,
  created_by BIGINT UNSIGNED NULL,
  CONSTRAINT fk_assessments_group
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
  CONSTRAINT fk_assessments_created_by
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE assessment_criteria (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  assessment_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT NULL,
  max_score DECIMAL(6,2) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_assessment_criteria_assessment
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE
);

CREATE TABLE assessment_submissions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  assessment_id BIGINT UNSIGNED NOT NULL,
  student_id BIGINT UNSIGNED NULL,
  team_id BIGINT UNSIGNED NULL,
  github_url TEXT NOT NULL,
  submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('submitted','analyzing','ai_reviewed','teacher_reviewed','approved','rejected')
    NOT NULL DEFAULT 'submitted',
  CONSTRAINT fk_assessment_submissions_assessment
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
  CONSTRAINT fk_assessment_submissions_student
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_assessment_submissions_team
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  CONSTRAINT chk_submission_owner
    CHECK (
      (student_id IS NOT NULL AND team_id IS NULL)
      OR
      (student_id IS NULL AND team_id IS NOT NULL)
    )
);

CREATE TABLE assessment_scores (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  assessment_id BIGINT UNSIGNED NOT NULL,
  student_id BIGINT UNSIGNED NOT NULL,
  score DECIMAL(6,2) NOT NULL,
  feedback TEXT NULL,
  evaluated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_assessment_student (assessment_id, student_id),
  CONSTRAINT fk_assessment_scores_assessment
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE CASCADE,
  CONSTRAINT fk_assessment_scores_student
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE criterion_scores (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  assessment_score_id BIGINT UNSIGNED NOT NULL,
  criterion_id BIGINT UNSIGNED NOT NULL,
  score DECIMAL(6,2) NOT NULL,
  ai_recommended_score DECIMAL(6,2) NULL,
  ai_rationale TEXT NULL,
  teacher_override_score DECIMAL(6,2) NULL,
  UNIQUE KEY uq_score_criterion (assessment_score_id, criterion_id),
  CONSTRAINT fk_criterion_scores_assessment_score
    FOREIGN KEY (assessment_score_id) REFERENCES assessment_scores(id) ON DELETE CASCADE,
  CONSTRAINT fk_criterion_scores_criterion
    FOREIGN KEY (criterion_id) REFERENCES assessment_criteria(id) ON DELETE CASCADE
);

CREATE TABLE ai_evaluations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  submission_id BIGINT UNSIGNED NOT NULL,
  generated_by BIGINT UNSIGNED NULL,
  reviewed_by BIGINT UNSIGNED NULL,
  content TEXT NOT NULL,
  status ENUM('draft','approved','rejected') NOT NULL DEFAULT 'draft',
  teacher_comment TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  CONSTRAINT fk_ai_evaluations_submission
    FOREIGN KEY (submission_id) REFERENCES assessment_submissions(id) ON DELETE CASCADE,
  CONSTRAINT fk_ai_evaluations_generated_by
    FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_ai_evaluations_reviewed_by
    FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE quizzes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  group_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL,
  topic VARCHAR(150) NULL,
  quiz_date DATE NULL,
  max_score DECIMAL(6,2) NOT NULL,
  source ENUM('manual','imported') NOT NULL DEFAULT 'imported',
  created_by BIGINT UNSIGNED NULL,
  CONSTRAINT fk_quizzes_group
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
  CONSTRAINT fk_quizzes_created_by
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE quiz_imports (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  quiz_id BIGINT UNSIGNED NULL,
  file_name VARCHAR(255) NOT NULL,
  imported_by BIGINT UNSIGNED NULL,
  status ENUM('uploaded','validated','confirmed','rejected') NOT NULL DEFAULT 'uploaded',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_quiz_imports_quiz
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE SET NULL,
  CONSTRAINT fk_quiz_imports_imported_by
    FOREIGN KEY (imported_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE quiz_results (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  quiz_id BIGINT UNSIGNED NOT NULL,
  student_id BIGINT UNSIGNED NOT NULL,
  score DECIMAL(6,2) NOT NULL,
  completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_quiz_student (quiz_id, student_id),
  CONSTRAINT fk_quiz_results_quiz
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
  CONSTRAINT fk_quiz_results_student
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE competencies (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL UNIQUE,
  description TEXT NULL
);

CREATE TABLE student_competencies (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  competency_id BIGINT UNSIGNED NOT NULL,
  score DECIMAL(5,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_student_competency (student_id, competency_id),
  CONSTRAINT fk_student_competencies_student
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_student_competencies_competency
    FOREIGN KEY (competency_id) REFERENCES competencies(id) ON DELETE CASCADE
);

CREATE TABLE teacher_feedback (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  teacher_id BIGINT UNSIGNED NOT NULL,
  assessment_id BIGINT UNSIGNED NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_teacher_feedback_student
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_teacher_feedback_teacher
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_teacher_feedback_assessment
    FOREIGN KEY (assessment_id) REFERENCES assessments(id) ON DELETE SET NULL
);

CREATE TABLE certificates (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT UNSIGNED NOT NULL,
  added_by BIGINT UNSIGNED NULL,
  name VARCHAR(200) NOT NULL,
  issuing_organization VARCHAR(200) NULL,
  issue_date DATE NULL,
  expiry_date DATE NULL,
  certificate_code VARCHAR(150) NULL,
  file_url TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_certificates_student
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_certificates_added_by
    FOREIGN KEY (added_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Common query indexes
CREATE INDEX ix_attendance_group_date ON attendance (group_id, attendance_date);
CREATE INDEX ix_assessment_scores_student ON assessment_scores (student_id);
CREATE INDEX ix_submission_assessment ON assessment_submissions (assessment_id);
CREATE INDEX ix_submission_student ON assessment_submissions (student_id);
CREATE INDEX ix_submission_team ON assessment_submissions (team_id);
CREATE INDEX ix_ai_evaluations_submission ON ai_evaluations (submission_id);
CREATE INDEX ix_quiz_results_student ON quiz_results (student_id);
CREATE INDEX ix_quiz_results_quiz ON quiz_results (quiz_id);
CREATE INDEX ix_ai_status ON ai_evaluations (status);
