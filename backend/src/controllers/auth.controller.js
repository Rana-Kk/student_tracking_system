import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../config/db.js'
import { ApiError } from '../utils/ApiError.js'
import { asyncHandler } from '../utils/asyncHandler.js'

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  })
}

// In production, only an admin creates teacher/student accounts (proposal §3:
// "administrator can create and manage teachers / add and manage students").
// This open /register endpoint is here for local development convenience —
// wire it behind `authenticate, requireRole('admin')` once the frontend's
// admin "add teacher/student" screens call the API directly.
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body

  if (!name || !email || !password || !role) {
    throw new ApiError(400, 'name, email, password and role are required')
  }
  if (!['admin', 'teacher', 'student'].includes(role)) {
    throw new ApiError(400, 'role must be admin, teacher or student')
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const [result] = await pool.query(
    `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`,
    [name, email, passwordHash, role]
  )

  const user = { id: result.insertId, name, email, role }
  const token = signToken(user)
  res.status(201).json({ user, token })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new ApiError(400, 'email and password are required')
  }

  const [rows] = await pool.query(
    `SELECT id, name, email, password_hash, role, is_active FROM users WHERE email = ?`,
    [email]
  )
  const dbUser = rows[0]

  // Deliberately vague error for both "no such user" and "wrong password" —
  // don't reveal which one to a caller probing for valid emails.
  if (!dbUser || !dbUser.is_active) {
    throw new ApiError(401, 'Invalid email or password')
  }

  const passwordMatches = await bcrypt.compare(password, dbUser.password_hash)
  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password')
  }

  const user = { id: dbUser.id, name: dbUser.name, email: dbUser.email, role: dbUser.role }
  const token = signToken(user)
  res.json({ user, token })
})

export const me = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT id, name, email, role, github_username, is_active, created_at FROM users WHERE id = ?`,
    [req.user.id]
  )
  if (!rows[0]) throw new ApiError(404, 'User not found')
  res.json(rows[0])
})
