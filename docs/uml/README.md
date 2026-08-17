-----------------------Use Case Diagram--------------------------

@startuml use-case-diagram
title Lexicon Platform - Use Case Diagram

left to right direction
skinparam packageStyle rectangle
skinparam backgroundColor transparent

actor Student
actor Teacher
actor Admin

rectangle "Lexicon Learning Analytics & AI Feedback Platform" {
  usecase "Authenticate" as UC1
  usecase "Manage Users,\nCourses & Groups" as UC2
  usecase "Register / Import\nStudents" as UC3
  usecase "Record Attendance" as UC4
  usecase "Manage Assessments,\nQuizzes & Rubrics" as UC5
  usecase "View Student Dashboard" as UC6
  usecase "View Competency Matrix" as UC7
  usecase "View Group Analytics" as UC8
  usecase "Generate AI\nFeedback Draft" as UC9
  usecase "Review & Approve\nAI Feedback" as UC10
  usecase "View Approved Feedback" as UC11
  usecase "Generate PDF\nProgress Report" as UC12
  usecase "Manage Certificates" as UC13
  usecase "View Certificates" as UC14
}

Student --> UC1
Student --> UC6
Student --> UC7
Student --> UC11
Student --> UC14

Teacher --> UC1
Teacher --> UC3
Teacher --> UC4
Teacher --> UC5
Teacher --> UC6
Teacher --> UC7
Teacher --> UC8
Teacher --> UC9
Teacher --> UC10
Teacher --> UC12
Teacher --> UC13

Admin --> UC1
Admin --> UC2
Admin --> UC3
Admin --> UC6
Admin --> UC8
Admin --> UC13

@enduml


-------------------Class Diagram------------------

@startuml class-diagram
title Lexicon Platform - Domain Class Diagram

skinparam backgroundColor transparent
skinparam classAttributeIconSize 0
hide empty methods

class User {
  +id: Long
  +name: String
  +email: String
  +passwordHash: String
  +role: UserRole
  +isActive: Boolean
}

enum UserRole {
  ADMIN
  TEACHER
  STUDENT
}

class Course {
  +id: Long
  +name: String
  +description: Text
  +startDate: Date
  +endDate: Date
}

class Group {
  +id: Long
  +courseId: Long
  +name: String
  +startDate: Date
  +endDate: Date
}

class GroupTeacher {
  +groupId: Long
  +teacherId: Long
}

class GroupStudent {
  +groupId: Long
  +studentId: Long
  +joinedAt: Date
}

class Attendance {
  +id: Long
  +attendanceDate: Date
  +session: AttendanceSession
  +status: AttendanceStatus
  +note: Text
}

enum AttendanceSession {
  MORNING
  AFTERNOON
}

enum AttendanceStatus {
  PRESENT
  LATE
  ABSENT
  EXCUSED
}

class Assessment {
  +id: Long
  +title: String
  +description: Text
  +type: AssessmentType
  +maxScore: Decimal
  +assessmentDate: Date
}

enum AssessmentType {
  PROJECT
  ASSIGNMENT
  PRESENTATION
  PRACTICAL
  FINAL_PROJECT
  OTHER
}

class AssessmentCriterion {
  +id: Long
  +name: String
  +maxScore: Decimal
}

class AssessmentScore {
  +id: Long
  +score: Decimal
  +feedback: Text
}

class CriterionScore {
  +id: Long
  +score: Decimal
}

class Quiz {
  +id: Long
  +title: String
  +topic: String
  +quizDate: Date
  +maxScore: Decimal
  +createdBy: Long
}

class QuizResult {
  +id: Long
  +score: Decimal
  +completedAt: DateTime
}

class Competency {
  +id: Long
  +name: String
  +description: Text
}

class StudentCompetency {
  +id: Long
  +score: Decimal
  +updatedAt: DateTime
}

class TeacherFeedback {
  +id: Long
  +content: Text
  +createdAt: DateTime
}

class AIFeedback {
  +id: Long
  +content: Text
  +status: FeedbackStatus
  +generatedBy: Long
  +reviewedBy: Long
  +generatedAt: DateTime
  +reviewedAt: DateTime
}

enum FeedbackStatus {
  DRAFT
  APPROVED
  REJECTED
}

class Certificate {
  +id: Long
  +name: String
  +issuingOrganization: String
  +issueDate: Date
  +expiryDate: Date
  +certificateCode: String
  +fileUrl: String
}

User --> UserRole

Course "1" -- "0..*" Group

Group "1" -- "0..*" GroupTeacher
User "1" -- "0..*" GroupTeacher : teacher

Group "1" -- "0..*" GroupStudent
User "1" -- "0..*" GroupStudent : student

Group "1" -- "0..*" Attendance
User "1" -- "0..*" Attendance : student
User "1" -- "0..*" Attendance : recordedBy

Group "1" -- "0..*" Assessment
User "1" -- "0..*" Assessment : createdBy

Assessment "1" -- "0..*" AssessmentCriterion
Assessment "1" -- "0..*" AssessmentScore
User "1" -- "0..*" AssessmentScore : student

AssessmentScore "1" -- "0..*" CriterionScore
AssessmentCriterion "1" -- "0..*" CriterionScore

Group "1" -- "0..*" Quiz
User "1" -- "0..*" Quiz : createdBy

Quiz "1" -- "0..*" QuizResult
User "1" -- "0..*" QuizResult : student

User "1" -- "0..*" StudentCompetency : student
Competency "1" -- "0..*" StudentCompetency

User "1" -- "0..*" TeacherFeedback : student
User "1" -- "0..*" TeacherFeedback : teacher
Assessment "0..1" -- "0..*" TeacherFeedback

User "1" -- "0..*" AIFeedback : student
User "1" -- "0..*" AIFeedback : generatedBy
User "1" -- "0..*" AIFeedback : reviewedBy
Assessment "0..1" -- "0..*" AIFeedback

User "1" -- "0..*" Certificate : student

@enduml











-------------------Sequence Diagram-----------------


@startuml sequence-diagram
title Lexicon Platform - Sequence: Teacher-Reviewed AI Feedback

skinparam backgroundColor transparent
autonumber

actor Teacher
actor Student
participant "React Web App" as UI
participant "Express API" as API
participant "Learning Analytics\nService" as Analytics
participant "AI Feedback\nService" as AIS
database "MySQL" as DB
participant "OpenAI API" as OpenAI

Teacher -> UI : Select student / assessment\nRequest AI feedback
UI -> API : POST /feedback/ai-drafts
API -> Analytics : collect student performance data
Analytics -> DB : read attendance, scores, quizzes,\ncompetencies and teacher feedback
DB --> Analytics : learner data
Analytics --> API : structured performance summary
API -> AIS : generate draft
AIS -> OpenAI : AI request with relevant summary
OpenAI --> AIS : draft strengths, improvements,\nrecommendations and next steps
AIS -> DB : save AIFeedback(status = DRAFT)
AIS --> API : draft feedback
API --> UI : 201 Created - draft for review
UI --> Teacher : display editable draft

Teacher -> UI : Edit and approve feedback
UI -> API : PATCH /feedback/{id}/approve
API -> DB : update status = APPROVED\nand reviewedBy = teacher
DB --> API : approval saved
API --> UI : approved feedback

Student -> UI : Open personal feedback
UI -> API : GET /students/me/feedback
API -> DB : select only approved feedback
DB --> API : approved feedback
API --> UI : feedback items
UI --> Student : display approved feedback

@enduml
