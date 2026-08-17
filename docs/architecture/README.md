--------------System ARchitecture Diagram------------

@startuml system-architecture
title Lexicon Learning Analytics & AI Feedback Platform - System Architecture

left to right direction
skinparam componentStyle rectangle
skinparam backgroundColor transparent

actor Student
actor Teacher
actor Admin
cloud Internet

node "Web Hosting" {
  component "React + TypeScript\nWeb Application" as Web
}

node "Application Hosting" {
  component "Node.js + Express\nREST API" as API
  component "Authentication &\nAuthorisation (JWT + RBAC)" as Auth
  component "Learning Analytics" as Analytics
  component "AI Feedback Orchestrator" as FeedbackAI
  component "PDF Report Generator" as Reports
}

database "MySQL Database" as DB
cloud "OpenAI API" as OpenAI

Student --> Internet
Teacher --> Internet
Admin --> Internet
Internet --> Web : HTTPS
Web --> API : HTTPS / JSON REST

API --> Auth
API --> Analytics
API --> FeedbackAI
API --> Reports

Auth --> DB
Analytics --> DB
FeedbackAI --> DB : read learner data\nwrite feedback draft
Reports --> DB
FeedbackAI --> OpenAI : relevant student data\n(AI analysis request)

note bottom of FeedbackAI
  AI feedback is a draft (see FR-6.5).
  Only Teacher-approved feedback
  is visible to Students.
end note

@enduml



-----------------Component Architecture Diagram---------------------
@startuml component-architecture
title Lexicon Platform - Component Architecture

skinparam componentStyle rectangle
skinparam backgroundColor transparent

package "React + TypeScript Client" {
  [Admin Portal] as AdminUI
  [Teacher Workspace] as TeacherUI
  [Student Dashboard] as StudentUI
  [Shared API Client] as Client
  [Charts & Report Views] as Charts
  AdminUI --> Client
  TeacherUI --> Client
  StudentUI --> Client
  Charts --> Client
}

package "Express REST API" {
  [Auth Controller] as AuthC
  [Course & Group Controller] as CourseC
  [Attendance Controller] as AttendC
  [Assessment Controller] as AssessC
  [Analytics Controller] as AnalyticC
  [Feedback Controller] as FeedbackC
  [Report Controller] as ReportC

  [Auth Service] as AuthS
  [Learning Service] as LearningS
  [Analytics Service] as AnalyticS
  [AI Feedback Service] as AIS
  [PDF Service] as PDFS
  [Repository / Data Access Layer] as Repo

  AuthC --> AuthS
  CourseC --> LearningS
  AttendC --> LearningS
  AssessC --> LearningS
  AnalyticC --> AnalyticS
  FeedbackC --> AIS
  ReportC --> PDFS
  AuthS --> Repo
  LearningS --> Repo
  AnalyticS --> Repo
  AIS --> Repo
  PDFS --> Repo
}

database "MySQL" as DB
cloud "OpenAI API" as OpenAI

Client --> AuthC : /auth
Client --> CourseC : /courses, /groups
Client --> AttendC : /attendance
Client --> AssessC : /assessments, /quizzes
Client --> AnalyticC : /analytics
Client --> FeedbackC : /feedback
Client --> ReportC : /reports
Repo --> DB
AIS --> OpenAI

note right of AuthS
  Enforces NFR-1.2: role and
  assignment-based access checks
  on every server-side request.
end note

@enduml



---------------Deployment Architecture----------------

@startuml deployment-architecture
title Lexicon Platform - Deployment Architecture

skinparam backgroundColor transparent

node "User Device" {
  artifact "Browser\n(Admin / Teacher / Student)" as Browser
}
cloud "Internet" as Net
node "Frontend Hosting\n(Vercel or equivalent)" {
  artifact "React + TypeScript SPA" as SPA
}
node "Backend Hosting\n(Azure App Service or equivalent)" {
  artifact "Node.js + Express API" as API
}
database "Managed MySQL 8" as DB
cloud "OpenAI API" as AI

Browser --> Net : HTTPS
Net --> SPA : static assets
SPA --> API : HTTPS REST / JSON
API --> DB : TLS SQL connection
API --> AI : HTTPS AI request

note bottom of API
  Includes the PDF Report Service
  and AI Feedback Service as
  in-process modules within the
  same Express application - they
  are not deployed as separate
  artifacts.
  Secrets (DB credentials, JWT
  signing key, OpenAI API key) are
  managed via hosting-provider
  environment variables (NFR-1.1).
  No secret is committed to source
  control.
end note

@enduml
