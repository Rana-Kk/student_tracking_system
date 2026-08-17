import { pool } from '../config/db.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// Proposal §4: "Teachers should only have access to the groups and students
// assigned to them." Admins see everything; teachers see only groups where
// they appear in group_teachers; students see only groups they belong to.
export const listGroups = asyncHandler(async (req, res) => {
  const { role, id: userId } = req.user

  let query = `
    SELECT g.id, g.name, g.course_id, c.name AS course_name, g.start_date, g.end_date,
           (SELECT COUNT(*) FROM group_students gs WHERE gs.group_id = g.id) AS student_count
    FROM student_groups g
    JOIN courses c ON c.id = g.course_id
  `
  const params = []

  if (role === 'teacher') {
    query += ` JOIN group_teachers gt ON gt.group_id = g.id AND gt.teacher_id = ?`
    params.push(userId)
  } else if (role === 'student') {
    query += ` JOIN group_students gs2 ON gs2.group_id = g.id AND gs2.student_id = ?`
    params.push(userId)
  }
  // admin: no extra join, sees all groups

  query += ` ORDER BY g.start_date DESC`

  const [rows] = await pool.query(query, params)
  res.json(rows)
})

async function assertGroupAccess(groupId, user) {
  if (user.role === 'admin') return

  const table = user.role === 'teacher' ? 'group_teachers' : 'group_students'
  const idColumn = user.role === 'teacher' ? 'teacher_id' : 'student_id'

  const [rows] = await pool.query(
    `SELECT 1 FROM ${table} WHERE group_id = ? AND ${idColumn} = ? LIMIT 1`,
    [groupId, user.id]
  )
  if (!rows[0]) throw new ApiError(403, 'You do not have access to this group')
}

export const getGroup = asyncHandler(async (req, res) => {
  await assertGroupAccess(req.params.id, req.user)

  const [rows] = await pool.query(
    `SELECT g.*, c.name AS course_name FROM student_groups g
     JOIN courses c ON c.id = g.course_id WHERE g.id = ?`,
    [req.params.id]
  )
  if (!rows[0]) throw new ApiError(404, 'Group not found')
  res.json(rows[0])
})

export const createGroup = asyncHandler(async (req, res) => {
  const { course_id, name, start_date, end_date } = req.body
  if (!course_id || !name) throw new ApiError(400, 'course_id and name are required')

  const [result] = await pool.query(
    `INSERT INTO student_groups (course_id, name, start_date, end_date, created_by)
     VALUES (?, ?, ?, ?, ?)`,
    [course_id, name, start_date ?? null, end_date ?? null, req.user.id]
  )
  res.status(201).json({ id: result.insertId, course_id, name, start_date, end_date })
})

export const assignTeacher = asyncHandler(async (req, res) => {
  const { teacher_id } = req.body
  if (!teacher_id) throw new ApiError(400, 'teacher_id is required')

  await pool.query(
    `INSERT IGNORE INTO group_teachers (group_id, teacher_id) VALUES (?, ?)`,
    [req.params.id, teacher_id]
  )
  res.status(201).json({ message: 'Teacher assigned to group' })
})

export const addStudent = asyncHandler(async (req, res) => {
  const { student_id, joined_at } = req.body
  if (!student_id) throw new ApiError(400, 'student_id is required')

  await pool.query(
    `INSERT IGNORE INTO group_students (group_id, student_id, joined_at) VALUES (?, ?, ?)`,
    [req.params.id, student_id, joined_at ?? new Date().toISOString().slice(0, 10)]
  )
  res.status(201).json({ message: 'Student added to group' })
})

export const listGroupStudents = asyncHandler(async (req, res) => {
  await assertGroupAccess(req.params.id, req.user)

  const [rows] = await pool.query(
    `SELECT u.id, u.name, u.email, gs.joined_at
     FROM group_students gs JOIN users u ON u.id = gs.student_id
     WHERE gs.group_id = ? ORDER BY u.name`,
    [req.params.id]
  )
  res.json(rows)
})
