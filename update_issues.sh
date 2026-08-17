REPO="student_tracking_system"

gh issue edit 1 -R "$REPO" --body "### Objectives
Analyze functional and non-functional requirements and establish system scope.
- Define role privileges: Admin, Teacher, Student.
- Map core functional modules (attendance, scoring, AI feedback).

- Deliverables:
  - Project Scope Document
  - Functional & Non-Functional Requirements Document
  - Initial Product Backlog

---
**Start Date:** Aug 3, 2026  
**End Date:** Aug 4, 2026"

gh issue edit 2 -R "$REPO" --body "### Objectives
Break down user flows and define formal user stories with acceptance criteria.
- Detail human-in-the-loop workflows for AI evaluation.
- Specify scenarios for multi-session attendance and rubric grading.

- Deliverables:
  - User Stories Catalog
  - Use Cases Specification

---
**Start Date:** Aug 4, 2026  
**End Date:** Aug 5, 2026"

gh issue edit 3 -R "$REPO" --body "### Objectives
Design relational schema to model students, courses, daily attendance, rubrics, and feedback.
- Model two daily sessions: Morning (09:00–12:00) & Afternoon (13:00–16:00).
- Build relationships for competencies, rubrics, and progress history.

- Deliverables:
  - ER Diagram
  - Database Schema & Data Dictionary
  - Seed & Relationship Scripts

---
**Start Date:** Aug 5, 2026  
**End Date:** Aug 7, 2026"

gh issue edit 4 -R "$REPO" --body "### Objectives
Model structural and behavioral aspects of the system.
- Cover Use Case, Class, Sequence, and Activity diagrams.

- Deliverables:
  - Use Case Diagram
  - Class Diagram
  - Sequence Diagram (AI Feedback & Review Flow)
  - Activity Diagram

---
**Start Date:** Aug 6, 2026  
**End Date:** Aug 10, 2026"

gh issue edit 5 -R "$REPO" --body "### Objectives
Define multi-tier architectural layout, technical stack, and data flow.
- Model frontend, backend API, database layer, and AI engine integration.

- Deliverables:
  - System Architecture Diagram
  - Component Architecture Diagram
  - Deployment Architecture Diagram
  - Technology Stack Selection Matrix

---
**Start Date:** Aug 10, 2026  
**End Date:** Aug 12, 2026"

gh issue edit 6 -R "$REPO" --body "### Objectives
Design wireframes and screen layouts for all user personas.
- Admin course/group management, Teacher attendance/evaluation grid, Student analytics dashboard.

- Deliverables:
  - Screen Wireframes
  - User Flow Diagrams
  - Dashboard & Feedback UI Layouts

---
**Start Date:** Aug 12, 2026  
**End Date:** Aug 14, 2026"

gh issue edit 7 -R "$REPO" --body "### Objectives
Initialize source control, documentation, and development environment.
- Setup project boilerplate and organize project structure.

- Deliverables:
  - GitHub Repository with README and Project Board
  - Monorepo/Backend-Frontend Initial Skeleton
  - Linter, Formatter, and Environment Configs

---
**Start Date:** Aug 17, 2026  
**End Date:** Aug 19, 2026"

gh issue edit 8 -R "$REPO" --body "### Objectives
Implement RESTful APIs for courses, groups, teachers, and students.
- Implement CRUD operations and filtering capabilities.

- Deliverables:
  - Course & Group Management API
  - Student Registration & Bulk Import API
  - OpenAPI / Swagger Documentation

---
**Start Date:** Aug 18, 2026  
**End Date:** Aug 28, 2026"

gh issue edit 9 -R "$REPO" --body "### Objectives
Set up database migrations, tables, indices, and seed datasets.

- Deliverables:
  - SQL DDL Migration Scripts
  - ORM Models and Database Context Setup
  - Initial Test Data Seed Scripts

---
**Start Date:** Aug 20, 2026  
**End Date:** Aug 26, 2026"

gh issue edit 10 -R "$REPO" --body "### Objectives
Build responsive frontend views, layouts, navigation, and state management.

- Deliverables:
  - Admin & Teacher Portal Views
  - Student Dashboard UI
  - Responsive Layout Components

---
**Start Date:** Aug 24, 2026  
**End Date:** Sep 4, 2026"

gh issue edit 11 -R "$REPO" --body "### Objectives
Implement secure authentication and Role-Based Access Control (RBAC).
- Restrict access to Admin, Teacher, and Student routes.

- Deliverables:
  - JWT Login & Session Handling
  - Role-Based Route Guards & Middleware
  - Password Hashing & Security Policies

---
**Start Date:** Aug 27, 2026  
**End Date:** Sep 2, 2026"

gh issue edit 12 -R "$REPO" --body "### Objectives
Develop attendance recording, rubric grading, and quiz tracking systems.
- Track Morning (09:00–12:00) and Afternoon (13:00–16:00) attendance.
- Support configurable project rubrics and assessment criteria.

- Deliverables:
  - Attendance Management Module
  - Rubric Scoring & Calculation Engine
  - Quiz Assessment Module

---
**Start Date:** Sep 3, 2026  
**End Date:** Sep 11, 2026"

gh issue edit 13 -R "$REPO" --body "### Objectives
Integrate LLM APIs to process student performance data and generate draft evaluations.
- Analyze attendance, quizzes, projects, and competency scores.

- Deliverables:
  - AI Feedback Engine & Prompt Templates
  - Teacher Review & Approval Workflow (Human-in-the-loop)
  - Strengths & Areas for Improvement Generator

---
**Start Date:** Sep 14, 2026  
**End Date:** Sep 18, 2026"

gh issue edit 14 -R "$REPO" --body "### Objectives
Generate tailored study recommendations and identify student risk indicators.

- Deliverables:
  - Next Steps & Actionable Learning Plan Generator
  - Early-Warning / Risk Indicator Logic
  - Teacher Feedback Templates

---
**Start Date:** Sep 16, 2026  
**End Date:** Sep 21, 2026"

gh issue edit 15 -R "$REPO" --body "### Objectives
Execute test suites across business logic, endpoints, and AI integrations.

- Deliverables:
  - Unit Test Suite
  - Integration & API Test Suite
  - AI Output Quality & Hallucination Test Report

---
**Start Date:** Sep 21, 2026  
**End Date:** Sep 24, 2026"

gh issue edit 16 -R "$REPO" --body "### Objectives
Optimize PDF report generation, database queries, and charting responsiveness.

- Deliverables:
  - PDF Student Progress Report Generator
  - Optimized SQL Queries & Indices
  - Performance Benchmark Report

---
**Start Date:** Sep 23, 2026  
**End Date:** Sep 25, 2026"

gh issue edit 17 -R "$REPO" --body "### Objectives
Deploy full application and database to production cloud hosting.

- Deliverables:
  - Production Deployment (Frontend & Backend)
  - CI/CD Workflow Setup
  - Live Demo Environment

---
**Start Date:** Sep 28, 2026  
**End Date:** Sep 29, 2026"

gh issue edit 18 -R "$REPO" --body "### Objectives
Finalize all technical documentation, repository guides, and internship presentation materials.

- Deliverables:
  - Complete README & Setup Guide
  - Final Project Report Document
  - Final Presentation Slide Deck

---
**Start Date:** Sep 28, 2026  
**End Date:** Sep 30, 2026"
