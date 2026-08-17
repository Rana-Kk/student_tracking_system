import { pool } from '../config/db.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

export const listCourses = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT id, name, description, start_date, end_date, created_at FROM courses ORDER BY start_date DESC`
  )
  res.json(rows)
})

export const getCourse = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(`SELECT * FROM courses WHERE id = ?`, [req.params.id])
  if (!rows[0]) throw new ApiError(404, 'Course not found')
  res.json(rows[0])
})

export const createCourse = asyncHandler(async (req, res) => {
  const { name, description, start_date, end_date } = req.body
  if (!name) throw new ApiError(400, 'name is required')

  const [result] = await pool.query(
    `INSERT INTO courses (name, description, start_date, end_date) VALUES (?, ?, ?, ?)`,
    [name, description ?? null, start_date ?? null, end_date ?? null]
  )
  res.status(201).json({ id: result.insertId, name, description, start_date, end_date })
})

export const updateCourse = asyncHandler(async (req, res) => {
  const { name, description, start_date, end_date } = req.body
  const [result] = await pool.query(
    `UPDATE courses SET name = COALESCE(?, name), description = COALESCE(?, description),
     start_date = COALESCE(?, start_date), end_date = COALESCE(?, end_date) WHERE id = ?`,
    [name ?? null, description ?? null, start_date ?? null, end_date ?? null, req.params.id]
  )
  if (result.affectedRows === 0) throw new ApiError(404, 'Course not found')
  res.json({ message: 'Course updated' })
})

export const deleteCourse = asyncHandler(async (req, res) => {
  // ON DELETE CASCADE on student_groups.course_id means this also removes the
  // course's groups (and, transitively, their attendance/assessments). That's
  // intentional per the schema, but worth a confirm step in the UI.
  const [result] = await pool.query(`DELETE FROM courses WHERE id = ?`, [req.params.id])
  if (result.affectedRows === 0) throw new ApiError(404, 'Course not found')
  res.status(204).send()
})
